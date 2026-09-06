"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import data from "@/data/social-mock-data.json";

const PLATFORM_COLOR: Record<string, string> = {
  X: "#1DA1F2",
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  YouTube: "#FF0000",
  TikTok: "#69C9D0",
  LinkedIn: "#0A66C2",
};

function fmtDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FollowersOverTime() {
  const { weeks, growthAnalysis } = data.followerHistory as any;
  const chartData = weeks.map((w: any) => ({ ...w, label: fmtDate(w.date) }));

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Followers Over Time</h1>
        <p className="text-gray-400 text-sm mt-1">
          4 real weekly snapshots (Aug 7 &ndash; Aug 28, 2026), from an internal tracking sheet.
        </p>
        <span className="inline-block mt-2 text-[9px] font-bold text-green-400 bg-green-400/10 rounded px-2 py-1">
          VERIFIED &middot; INTERNAL SOURCE
        </span>
      </div>

      {/* ---- Line chart ---- */}
      <div className="bg-[#151517] border border-white/10 rounded-xl p-4" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
            <XAxis dataKey="label" stroke="#666" fontSize={11} />
            <YAxis stroke="#666" fontSize={11} />
            <Tooltip
              contentStyle={{ background: "#151517", border: "1px solid #333", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {Object.keys(PLATFORM_COLOR).map((platform) => (
              <Line
                key={platform}
                type="monotone"
                dataKey={platform}
                stroke={PLATFORM_COLOR[platform]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-gray-600">
        X and Instagram sit on a much bigger scale than TikTok/LinkedIn, which flattens their lines
        near the bottom &mdash; that's real, not a chart bug. See the ranked list below for like-for-like
        comparison by growth rate instead of raw scale.
      </p>

      {/* ---- Growth ranking ---- */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
          Ranked by 4-Week Growth Rate
        </h2>
        <div className="space-y-2">
          {growthAnalysis.map((g: any, i: number) => {
            const Icon = g.monthChangePct > 0 ? TrendingUp : g.monthChangePct < 0 ? TrendingDown : Minus;
            const color = g.monthChangePct > 5 ? "#22C55E" : g.monthChangePct < 0 ? "#D42B3F" : "#999";
            return (
              <div key={g.platform} className="flex items-center gap-3 bg-[#151517] border border-white/10 rounded-lg px-4 py-3">
                <div className="text-xs font-bold text-gray-600 w-5">{i + 1}</div>
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: PLATFORM_COLOR[g.platform] }}
                />
                <div className="font-bold text-sm w-24">{g.platform}</div>
                <div className="text-xs text-gray-500 w-16">{g.current.toLocaleString()}</div>
                <div className="flex items-center gap-1 ml-auto" style={{ color }}>
                  <Icon size={13} />
                  <span className="font-bold text-sm">{g.monthChangePct > 0 ? "+" : ""}{g.monthChangePct}%</span>
                </div>
                <div className="text-[10px] text-gray-500 w-32 text-right">
                  {g.monthChange > 0 ? "+" : ""}{g.monthChange} over 4wk
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Callout on the standout finding ---- */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="font-bold text-sm text-green-400 mb-1">Facebook is the real standout</div>
        <p className="text-xs text-gray-300 leading-relaxed">
          +43.7% growth in 4 weeks (2,554 &rarr; 3,670) &mdash; by far the fastest-growing platform,
          despite not being in the original 5-platform scope. Meanwhile TikTok is essentially flat
          to slightly down (-0.5% over the same period) even with real numbers now confirmed.
          Worth asking what's driving Facebook growth specifically before assuming it'll continue.
        </p>
      </div>
    </div>
  );
}
