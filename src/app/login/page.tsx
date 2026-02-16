"use client";

import { motion } from "framer-motion";
import { Music } from "lucide-react";
import MeshBackground from "@/components/MeshBackground";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/api/auth/login?callbackUrl=/";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <MeshBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 p-12 rounded-3xl
                   bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1]
                   max-w-md w-full mx-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-spotify-green to-emerald-600 flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">AuraBeat</h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-white/50 text-sm leading-relaxed"
        >
          Discover your sonic identity. Explore your top tracks, artists, and vibe profile with a
          beautifully crafted analytics dashboard.
        </motion.p>

        {/* Sign In Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm
                     bg-spotify-green text-black
                     hover:bg-spotify-green-light
                     transition-colors duration-200
                     flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599- 1.559.3z" />
          </svg>
          Continue with Spotify
        </motion.button>

        <p className="text-[10px] text-white/25 text-center">
          We only read your listening data. No playlists are modified.
        </p>
      </motion.div>
    </div>
  );
}
