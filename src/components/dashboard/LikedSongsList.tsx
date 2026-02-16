"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Music } from "lucide-react";
import GlassCard from "./GlassCard";
import { SavedTrack } from "@/lib/spotify";

interface LikedSongsListProps {
  songs: SavedTrack[];
  totalCount: number;
  delay?: number;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  return `${diffMonths}mo ago`;
}

export default function LikedSongsList({ songs, totalCount, delay = 0 }: LikedSongsListProps) {
  return (
    <GlassCard colSpan={2} delay={delay} className="md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            Recently Liked
          </h3>
        </div>
        <span className="text-xs text-white/30 font-mono">{totalCount.toLocaleString()} total</span>
      </div>
      <div className="space-y-1">
        {songs.map((saved, index) => {
          const track = saved.track;
          const albumArt = track.album.images[0]?.url;
          const addedDate = new Date(saved.added_at);
          const timeAgo = getTimeAgo(addedDate);

          return (
            <motion.a
              key={track.id}
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + index * 0.06, duration: 0.3 }}
              className="flex items-center gap-3 p-2 -mx-2 rounded-xl
                         hover:bg-white/[0.06] transition-colors duration-200
                         group cursor-pointer"
            >
              <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white/5">
                {albumArt ? (
                  <Image
                    src={albumArt}
                    alt={track.album.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="36px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-3.5 h-3.5 text-white/20" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/90 truncate group-hover:text-pink-400 transition-colors">
                  {track.name}
                </p>
                <p className="text-xs text-white/40 truncate">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
              <span className="text-[10px] text-white/25 shrink-0">{timeAgo}</span>
            </motion.a>
          );
        })}
      </div>
    </GlassCard>
  );
}
