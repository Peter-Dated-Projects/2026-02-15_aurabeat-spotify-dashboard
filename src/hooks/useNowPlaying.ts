"use client";

import useSWR from "swr";
import { CurrentlyPlaying } from "@/lib/spotify";

async function fetcher(url: string): Promise<CurrentlyPlaying | null> {
  const res = await fetch(url);
  if (res.status === 204 || res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch now playing");
  return res.json();
}

export function useNowPlaying() {
  const { data, error, isLoading } = useSWR<CurrentlyPlaying | null>(
    "/api/now-playing",
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      dedupingInterval: 3000,
    }
  );

  return {
    data: data ?? null,
    error,
    isLoading,
  };
}
