"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { AudioFeatures } from "@/lib/spotify";
import GlassCard from "./GlassCard";

interface AudioRadarProps {
  features: AudioFeatures;
  delay?: number;
}

const LABELS: Record<string, string> = {
  energy: "Energy",
  danceability: "Dance",
  valence: "Mood",
  acousticness: "Acoustic",
  instrumentalness: "Instrumental",
};

export default function AudioRadar({ features, delay = 0 }: AudioRadarProps) {
  const data = Object.entries(features).map(([key, value]) => ({
    subject: LABELS[key] || key,
    value: Math.round(value * 100),
    fullMark: 100,
  }));

  return (
    <GlassCard colSpan={2} delay={delay} className="md:col-span-2">
      <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-1">
        Vibe Radar
      </h3>
      <p className="text-xs text-white/40 mb-4">Your audio personality based on top tracks</p>
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1db954" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6b21a8" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Vibe"
              dataKey="value"
              stroke="#1db954"
              fill="url(#radarGradient)"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {data.map((d) => (
          <div key={d.subject} className="flex items-center gap-1.5">
            <span className="text-xs text-white/50">{d.subject}</span>
            <span className="text-xs font-mono text-spotify-green font-semibold">{d.value}%</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
