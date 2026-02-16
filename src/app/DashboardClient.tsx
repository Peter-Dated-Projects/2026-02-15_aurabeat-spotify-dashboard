"use client";

import { motion } from "framer-motion";
import { LogOut, Music } from "lucide-react";
import BentoGrid from "@/components/dashboard/BentoGrid";
import NowPlaying from "@/components/dashboard/NowPlaying";
import TopItemsList from "@/components/dashboard/TopItemsList";
import AudioRadar from "@/components/dashboard/AudioRadar";
import LibrarySnapshot from "@/components/dashboard/LibrarySnapshot";
import MeshBackground from "@/components/MeshBackground";
import { SpotifyTrack, SpotifyArtist, AudioFeatures } from "@/lib/spotify";

interface DashboardClientProps {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  audioFeatures: AudioFeatures;
  likedSongs: number;
  totalPlaylists: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function DashboardClient({
  topTracks,
  topArtists,
  audioFeatures,
  likedSongs,
  totalPlaylists,
  user,
}: DashboardClientProps) {
  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <div className="relative min-h-screen">
      <MeshBackground />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-spotify-green to-emerald-600 flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AuraBeat</h1>
          </div>

          <div className="flex items-center gap-4">
            {user?.name && (
              <span className="text-sm text-white/40 hidden sm:block">{user.name}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                         bg-white/[0.06] border border-white/[0.1]
                         text-white/50 hover:text-white/80 hover:bg-white/[0.1]
                         transition-all duration-200 text-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </motion.header>

        {/* Dashboard Grid */}
        <BentoGrid>
          {/* Now Playing - Full width */}
          <NowPlaying delay={0.1} />

          {/* Top Tracks */}
          <TopItemsList title="Top Tracks" items={topTracks} type="tracks" delay={0.2} />

          {/* Top Artists */}
          <TopItemsList title="Top Artists" items={topArtists} type="artists" delay={0.3} />

          {/* Audio Radar */}
          <AudioRadar features={audioFeatures} delay={0.4} />

          {/* Library Snapshot */}
          <LibrarySnapshot likedSongs={likedSongs} totalPlaylists={totalPlaylists} delay={0.5} />
        </BentoGrid>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center py-8 text-xs text-white/20"
        >
          AuraBeat · Powered by Spotify Web API · Not affiliated with Spotify AB
        </motion.footer>
      </div>
    </div>
  );
}
