import { getSession, getAccessToken } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  getTopTracks,
  getTopArtists,
  getAverageAudioFeatures,
  getLikedSongsCount,
  getUserPlaylists,
} from "@/lib/spotify";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  const accessToken = await getAccessToken();

  if (!session || !accessToken) {
    redirect("/login");
  }

  // Fetch all data in parallel
  const [topTracks, topArtists, likedSongs, playlists] = await Promise.all([
    getTopTracks(accessToken),
    getTopArtists(accessToken),
    getLikedSongsCount(accessToken),
    getUserPlaylists(accessToken),
  ]);

  // Calculate audio features from top tracks
  const trackIds = topTracks.map((t) => t.id);
  let audioFeatures = {
    energy: 0,
    danceability: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
  };

  try {
    audioFeatures = await getAverageAudioFeatures(accessToken, trackIds);
  } catch (e) {
    console.error("Failed to fetch audio features:", e);
  }

  return (
    <DashboardClient
      topTracks={topTracks}
      topArtists={topArtists}
      audioFeatures={audioFeatures}
      likedSongs={likedSongs}
      totalPlaylists={playlists.total}
      user={session.user}
    />
  );
}
