"use client";

import GlassCard from "./GlassCard";
import { Heart, ListMusic } from "lucide-react";

interface LibrarySnapshotProps {
  likedSongs: number;
  totalPlaylists: number;
  delay?: number;
}

export default function LibrarySnapshot({
  likedSongs,
  totalPlaylists,
  delay = 0,
}: LibrarySnapshotProps) {
  return (
    <>
      <GlassCard delay={delay}>
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            Liked Songs
          </h3>
        </div>
        <p className="text-4xl font-mono font-bold text-white tracking-tight">
          {likedSongs.toLocaleString()}
        </p>
        <p className="text-xs text-white/30 mt-1">tracks in your library</p>
      </GlassCard>
      <GlassCard delay={delay + 0.1}>
        <div className="flex items-center gap-2 mb-3">
          <ListMusic className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Playlists</h3>
        </div>
        <p className="text-4xl font-mono font-bold text-white tracking-tight">
          {totalPlaylists.toLocaleString()}
        </p>
        <p className="text-xs text-white/30 mt-1">curated collections</p>
      </GlassCard>
    </>
  );
}
