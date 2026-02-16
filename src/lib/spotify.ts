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
  external_urls: { spotify: string };
  description: string | null;
  owner: { display_name: string };
}

export interface SavedTrack {
  added_at: string;
  track: SpotifyTrack;
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

export async function getRecentlyLikedSongs(
  accessToken: string,
  limit: number = 10
): Promise<SavedTrack[]> {
  const data = await spotifyFetch<SpotifyPaginated<SavedTrack>>(
    `/me/tracks?limit=${limit}`,
    accessToken
  );
  return data.items;
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

// ---------- Genre-based Vibe Computation ----------
// Replaces deprecated Spotify Audio Features API

const GENRE_VIBE_MAP: Record<string, AudioFeatures> = {
  electronic: { energy: 0.8, danceability: 0.8, valence: 0.6, acousticness: 0.1, instrumentalness: 0.4 },
  edm:        { energy: 0.9, danceability: 0.9, valence: 0.7, acousticness: 0.05, instrumentalness: 0.5 },
  house:      { energy: 0.8, danceability: 0.9, valence: 0.7, acousticness: 0.1, instrumentalness: 0.5 },
  techno:     { energy: 0.85, danceability: 0.8, valence: 0.5, acousticness: 0.05, instrumentalness: 0.7 },
  trance:     { energy: 0.8, danceability: 0.7, valence: 0.6, acousticness: 0.05, instrumentalness: 0.6 },
  "drum and bass": { energy: 0.9, danceability: 0.8, valence: 0.5, acousticness: 0.05, instrumentalness: 0.5 },
  dubstep:    { energy: 0.9, danceability: 0.7, valence: 0.4, acousticness: 0.05, instrumentalness: 0.4 },
  dance:      { energy: 0.8, danceability: 0.9, valence: 0.7, acousticness: 0.1, instrumentalness: 0.3 },
  pop:        { energy: 0.7, danceability: 0.7, valence: 0.7, acousticness: 0.3, instrumentalness: 0.1 },
  "k-pop":    { energy: 0.75, danceability: 0.8, valence: 0.7, acousticness: 0.2, instrumentalness: 0.1 },
  rock:       { energy: 0.8, danceability: 0.5, valence: 0.5, acousticness: 0.3, instrumentalness: 0.2 },
  "alt rock": { energy: 0.7, danceability: 0.5, valence: 0.45, acousticness: 0.35, instrumentalness: 0.25 },
  metal:      { energy: 0.95, danceability: 0.35, valence: 0.3, acousticness: 0.05, instrumentalness: 0.3 },
  "hip hop":  { energy: 0.7, danceability: 0.8, valence: 0.6, acousticness: 0.1, instrumentalness: 0.1 },
  rap:        { energy: 0.7, danceability: 0.8, valence: 0.5, acousticness: 0.1, instrumentalness: 0.05 },
  trap:       { energy: 0.75, danceability: 0.85, valence: 0.45, acousticness: 0.05, instrumentalness: 0.1 },
  "r&b":      { energy: 0.5, danceability: 0.7, valence: 0.6, acousticness: 0.3, instrumentalness: 0.1 },
  soul:       { energy: 0.5, danceability: 0.6, valence: 0.6, acousticness: 0.5, instrumentalness: 0.1 },
  funk:       { energy: 0.7, danceability: 0.8, valence: 0.7, acousticness: 0.3, instrumentalness: 0.2 },
  jazz:       { energy: 0.4, danceability: 0.5, valence: 0.5, acousticness: 0.7, instrumentalness: 0.5 },
  classical:  { energy: 0.3, danceability: 0.2, valence: 0.4, acousticness: 0.9, instrumentalness: 0.9 },
  acoustic:   { energy: 0.3, danceability: 0.4, valence: 0.5, acousticness: 0.9, instrumentalness: 0.2 },
  folk:       { energy: 0.4, danceability: 0.4, valence: 0.5, acousticness: 0.8, instrumentalness: 0.2 },
  country:    { energy: 0.55, danceability: 0.55, valence: 0.65, acousticness: 0.55, instrumentalness: 0.1 },
  indie:      { energy: 0.55, danceability: 0.5, valence: 0.5, acousticness: 0.5, instrumentalness: 0.3 },
  ambient:    { energy: 0.2, danceability: 0.2, valence: 0.4, acousticness: 0.6, instrumentalness: 0.85 },
  punk:       { energy: 0.9, danceability: 0.5, valence: 0.5, acousticness: 0.1, instrumentalness: 0.1 },
  reggae:     { energy: 0.5, danceability: 0.7, valence: 0.7, acousticness: 0.4, instrumentalness: 0.2 },
  reggaeton:  { energy: 0.75, danceability: 0.9, valence: 0.7, acousticness: 0.15, instrumentalness: 0.1 },
  latin:      { energy: 0.7, danceability: 0.8, valence: 0.7, acousticness: 0.3, instrumentalness: 0.1 },
  blues:      { energy: 0.5, danceability: 0.4, valence: 0.4, acousticness: 0.6, instrumentalness: 0.2 },
  gospel:     { energy: 0.6, danceability: 0.5, valence: 0.7, acousticness: 0.5, instrumentalness: 0.1 },
  lofi:       { energy: 0.3, danceability: 0.5, valence: 0.5, acousticness: 0.4, instrumentalness: 0.7 },
  synthwave:  { energy: 0.7, danceability: 0.7, valence: 0.6, acousticness: 0.05, instrumentalness: 0.6 },
  grunge:     { energy: 0.8, danceability: 0.4, valence: 0.3, acousticness: 0.2, instrumentalness: 0.2 },
  emo:        { energy: 0.7, danceability: 0.45, valence: 0.3, acousticness: 0.25, instrumentalness: 0.15 },
  ska:        { energy: 0.8, danceability: 0.8, valence: 0.7, acousticness: 0.2, instrumentalness: 0.15 },
  disco:      { energy: 0.8, danceability: 0.9, valence: 0.8, acousticness: 0.15, instrumentalness: 0.2 },
};

export function computeVibeFromGenres(artists: SpotifyArtist[]): AudioFeatures {
  const allGenres = artists.flatMap((a) => a.genres);

  if (allGenres.length === 0) {
    return {
      energy: 0.5,
      danceability: 0.5,
      valence: 0.5,
      acousticness: 0.5,
      instrumentalness: 0.5,
    };
  }

  const scores: AudioFeatures = {
    energy: 0,
    danceability: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
  };
  let matchCount = 0;

  for (const genre of allGenres) {
    const lower = genre.toLowerCase();
    for (const [keyword, vibe] of Object.entries(GENRE_VIBE_MAP)) {
      if (lower.includes(keyword)) {
        scores.energy += vibe.energy;
        scores.danceability += vibe.danceability;
        scores.valence += vibe.valence;
        scores.acousticness += vibe.acousticness;
        scores.instrumentalness += vibe.instrumentalness;
        matchCount++;
        break; // one match per genre string
      }
    }
  }

  if (matchCount === 0) {
    return {
      energy: 0.5,
      danceability: 0.5,
      valence: 0.5,
      acousticness: 0.5,
      instrumentalness: 0.5,
    };
  }

  return {
    energy: scores.energy / matchCount,
    danceability: scores.danceability / matchCount,
    valence: scores.valence / matchCount,
    acousticness: scores.acousticness / matchCount,
    instrumentalness: scores.instrumentalness / matchCount,
  };
}
