import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

const REDIRECT_URI = "http://127.0.0.1:3000/api/auth/callback";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/";
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${error}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=no_code", request.url)
    );
  }

  try {
    // Exchange code for tokens
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Token exchange failed:", error);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", request.url)
      );
    }

    const tokens = await response.json();

    // Get user profile
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.redirect(
        new URL("/login?error=profile_fetch_failed", request.url)
      );
    }

    const profile = await profileResponse.json();

    // Create session
    await createSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + tokens.expires_in,
      user: {
        id: profile.id,
        name: profile.display_name,
        email: profile.email,
      },
    });

    // Return HTML that redirects via JavaScript to ensure cookie is set
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Redirecting...</title>
        </head>
        <body>
          <script>
            window.location.href = "${state}";
          </script>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=unknown", request.url)
    );
  }
}
