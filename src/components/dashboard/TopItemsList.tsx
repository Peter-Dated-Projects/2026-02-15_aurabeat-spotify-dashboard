"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SpotifyTrack, SpotifyArtist } from "@/lib/spotify";
import GlassCard from "./GlassCard";
import { Music, Mic2 } from "lucide-react";

interface TopItemsListProps {
  title: string;
  items: SpotifyTrack[] | SpotifyArtist[];
  type: "tracks" | "artists";
  delay?: number;
}

function isTrack(item: SpotifyTrack | SpotifyArtist): item is SpotifyTrack {
  return "album" in item;
}

export default function TopItemsList({ title, items, type, delay = 0 }: TopItemsListProps) {
  const Icon = type === "tracks" ? Music : Mic2;

  return (
    <GlassCard colSpan={2} delay={delay} className="md:col-span-2 lg:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-spotify-green" />
        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => {
          const imageUrl = isTrack(item) ? item.album.images[0]?.url : item.images[0]?.url;
          const subtitle = isTrack(item)
            ? item.artists.map((a) => a.name).join(", ")
            : item.genres?.slice(0, 2).join(", ") || "Artist";

          return (
            <motion.a
              key={item.id}
              href={item.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              layoutId={`${type}-${item.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + index * 0.08, duration: 0.35 }}
              className="flex items-center gap-3 p-2 -mx-2 rounded-xl
                         hover:bg-white/[0.06] transition-colors duration-200
                         group cursor-pointer"
            >
              <span className="text-xs font-mono text-white/30 w-5 text-right shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/5">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white/20" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/90 truncate group-hover:text-spotify-green transition-colors">
                  {item.name}
                </p>
                <p className="text-xs text-white/40 truncate">{subtitle}</p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </GlassCard>
  );
}
