"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ListMusic } from "lucide-react";
import GlassCard from "./GlassCard";
import { SpotifyPlaylist } from "@/lib/spotify";

interface PlaylistsListProps {
  playlists: SpotifyPlaylist[];
  delay?: number;
}

export default function PlaylistsList({ playlists, delay = 0 }: PlaylistsListProps) {
  return (
    <GlassCard colSpan={4} delay={delay} className="md:col-span-2 lg:col-span-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            Your Playlists
          </h3>
        </div>
        <span className="text-xs text-white/30 font-mono">
          {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="overflow-y-auto max-h-[340px] -mx-2 px-2 space-y-1 scrollbar-thin">
        {playlists.map((playlist, index) => {
          const imageUrl = playlist.images?.[0]?.url;

          return (
            <motion.a
              key={playlist.id}
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + Math.min(index * 0.03, 0.6), duration: 0.3 }}
              className="flex items-center gap-3 p-2 rounded-xl
                         hover:bg-white/[0.06] transition-colors duration-200
                         group cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={playlist.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                    <ListMusic className="w-4 h-4 text-white/30" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/90 truncate group-hover:text-purple-400 transition-colors">
                  {playlist.name}
                </p>
                <p className="text-xs text-white/40">
                  {playlist.tracks.total} track{playlist.tracks.total !== 1 ? "s" : ""}
                </p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </GlassCard>
  );
}
