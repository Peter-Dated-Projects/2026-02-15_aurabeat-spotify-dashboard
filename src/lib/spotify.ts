const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// ---------- Types ----------

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface AudioFeatures {
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
}

export interface CurrentlyPlaying {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyTrack;
  currently_playing_type: string;
}

export interface SpotifyPaginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: SpotifyImage[];
  tracks: { total: number };
}

// ---------- Fetcher ----------

async function spotifyFetch<T>(
  endpoint: string,
  accessToken: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    ...options,
  });

  if (res.status === 204 || res.status === 202) {
    return null as T;
  }

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Spotify API error (${res.status}): ${error}`);
  }

  return res.json();
}

// ---------- API Wrappers ----------

export async function getTopTracks(
  accessToken: string,
  timeRange: string = "medium_term",
  limit: number = 5
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<SpotifyPaginated<SpotifyTrack>>(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
  return data.items;
}

export async function getTopArtists(
  accessToken: string,
  timeRange: string = "medium_term",
  limit: number = 5
): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch<SpotifyPaginated<SpotifyArtist>>(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
  return data.items;
}

export async function getAudioFeatures(
  accessToken: string,
  trackIds: string[]
): Promise<AudioFeatures[]> {
  const data = await spotifyFetch<{ audio_features: AudioFeatures[] }>(
    `/audio-features?ids=${trackIds.join(",")}`,
    accessToken
  );
  return data.audio_features;
}

export async function getAverageAudioFeatures(
  accessToken: string,
  trackIds: string[]
): Promise<AudioFeatures> {
  const features = await getAudioFeatures(accessToken, trackIds);
  const validFeatures = features.filter(Boolean);
  const count = validFeatures.length || 1;

  return {
    energy: validFeatures.reduce((sum, f) => sum + f.energy, 0) / count,
    danceability:
      validFeatures.reduce((sum, f) => sum + f.danceability, 0) / count,
    valence: validFeatures.reduce((sum, f) => sum + f.valence, 0) / count,
    acousticness:
      validFeatures.reduce((sum, f) => sum + f.acousticness, 0) / count,
    instrumentalness:
      validFeatures.reduce((sum, f) => sum + f.instrumentalness, 0) / count,
  };
}

export async function getCurrentlyPlaying(
  accessToken: string
): Promise<CurrentlyPlaying | null> {
  return spotifyFetch<CurrentlyPlaying | null>(
    "/me/player/currently-playing",
    accessToken
  );
}

export async function getLikedSongsCount(
  accessToken: string
): Promise<number> {
  const data = await spotifyFetch<SpotifyPaginated<unknown>>(
    "/me/tracks?limit=1",
    accessToken
  );
  return data.total;
}

export async function getUserPlaylists(
  accessToken: string
): Promise<{ items: SpotifyPlaylist[]; total: number }> {
  const data = await spotifyFetch<SpotifyPaginated<SpotifyPlaylist>>(
    "/me/playlists?limit=50",
    accessToken
  );
  return { items: data.items, total: data.total };
}
