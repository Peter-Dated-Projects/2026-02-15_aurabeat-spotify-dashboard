import { getSession, getAccessToken } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  getTopTracks,
  getTopArtists,
  computeVibeFromGenres,
  getLikedSongsCount,
  getRecentlyLikedSongs,
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
  const [topTracks, topArtists, likedSongs, recentlyLiked, playlists] = await Promise.all([
    getTopTracks(accessToken),
    getTopArtists(accessToken, "medium_term", 50),
    getLikedSongsCount(accessToken),
    getRecentlyLikedSongs(accessToken, 10),
    getUserPlaylists(accessToken),
  ]);

  // Compute vibe radar from artist genres (replaces deprecated audio-features API)
  const audioFeatures = computeVibeFromGenres(topArtists);

  return (
    <DashboardClient
      topTracks={topTracks}
      topArtists={topArtists.slice(0, 5)}
      audioFeatures={audioFeatures}
      likedSongs={likedSongs}
      recentlyLikedSongs={recentlyLiked}
      playlists={playlists.items}
      user={session.user}
    />
  );
}
