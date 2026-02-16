import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_SCOPES = [
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
  "user-read-playback-state",
].join(" ");

const REDIRECT_URI = "http://127.0.0.1:3000/api/auth/callback";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SPOTIFY_SCOPES,
    state: callbackUrl,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
