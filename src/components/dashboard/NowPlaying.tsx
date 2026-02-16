"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Disc3, Pause, Play } from "lucide-react";
import GlassCard from "./GlassCard";
import { useNowPlaying } from "@/hooks/useNowPlaying";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function NowPlaying({ delay = 0 }: { delay?: number }) {
  const { data, isLoading } = useNowPlaying();

  if (isLoading) {
    return (
      <GlassCard colSpan={4} delay={delay} className="md:col-span-2 lg:col-span-4">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-20 h-20 rounded-xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-white/10" />
            <div className="h-3 w-32 rounded bg-white/10" />
            <div className="h-1.5 w-full rounded bg-white/10 mt-4" />
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!data || !data.item) {
    return (
      <GlassCard colSpan={4} delay={delay} className="md:col-span-2 lg:col-span-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center">
            <Disc3 className="w-8 h-8 text-white/20" />
          </div>
          <div>
            <p className="text-sm text-white/40">Nothing playing right now</p>
            <p className="text-xs text-white/25 mt-1">Play something on Spotify to see it here</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  const { item, progress_ms, is_playing } = data;
  const albumArt = item.album.images[0]?.url;
  const progress = (progress_ms / item.duration_ms) * 100;

  return (
    <GlassCard colSpan={4} delay={delay} className="md:col-span-2 lg:col-span-4 relative">
      {/* Album art glow effect */}
      {albumArt && (
        <div
          className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
          style={{
            backgroundImage: `url(${albumArt})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${is_playing ? "bg-spotify-green" : "bg-white/30"}`}
            >
              {is_playing && (
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-spotify-green animate-ping" />
              )}
            </span>
            <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
              {is_playing ? "Now Playing" : "Paused"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Album Art */}
          <motion.div
            animate={is_playing ? { rotate: 360 } : { rotate: 0 }}
            transition={
              is_playing ? { duration: 8, repeat: Infinity, ease: "linear" } : { duration: 0.5 }
            }
            className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-2xl"
          >
            {albumArt ? (
              <Image
                src={albumArt}
                alt={item.album.name}
                fill
                className="object-cover"
                sizes="80px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <Disc3 className="w-8 h-8 text-white/20" />
              </div>
            )}
          </motion.div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <a
              href={item.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <h2 className="text-lg font-semibold text-white truncate">{item.name}</h2>
            </a>
            <p className="text-sm text-white/50 truncate">
              {item.artists.map((a) => a.name).join(", ")} · {item.album.name}
            </p>

            {/* Progress Bar */}
            <div className="mt-3 space-y-1">
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-spotify-green to-spotify-green-light"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-mono text-white/30">
                  {formatTime(progress_ms)}
                </span>
                <span className="text-[10px] font-mono text-white/30">
                  {formatTime(item.duration_ms)}
                </span>
              </div>
            </div>
          </div>

          {/* Play/Pause indicator */}
          <div className="shrink-0">
            {is_playing ? (
              <Pause className="w-5 h-5 text-white/30" />
            ) : (
              <Play className="w-5 h-5 text-white/30" />
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
