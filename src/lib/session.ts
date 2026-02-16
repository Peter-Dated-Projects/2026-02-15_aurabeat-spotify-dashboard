import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key-min-32-chars-long"
);

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export async function createSession(session: Session) {
  const token = await new SignJWT(session as any)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SESSION_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  
  if (!sessionCookie) return null;

  try {
    const { payload } = await jwtVerify(sessionCookie.value, SESSION_SECRET);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete("session");
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  // Check if token is expired
  if (Date.now() >= session.expiresAt * 1000) {
    // Try to refresh the token
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: session.refreshToken,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const refreshed = await response.json();

      // Update session with new token
      await createSession({
        ...session,
        accessToken: refreshed.access_token,
        expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
      });

      return refreshed.access_token;
    } catch {
      return null;
    }
  }

  return session.accessToken;
}
