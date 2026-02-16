import { getAccessToken } from "@/lib/session";
import { getCurrentlyPlaying } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getCurrentlyPlaying(accessToken);

    if (!data) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching currently playing:", error);
    return NextResponse.json(
      { error: "Failed to fetch currently playing" },
      { status: 500 }
    );
  }
}
