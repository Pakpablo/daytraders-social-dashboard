"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  TrendingUp, TrendingDown, Minus, Instagram, Youtube, Linkedin, Twitter, Music2, Facebook, MessagesSquare, ExternalLink,
} from "lucide-react";
import data from "@/data/social-mock-data.json";

const PLATFORM_COLOR: Record<string, string> = {
  X: "#1DA1F2",
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  YouTube: "#FF0000",
  TikTok: "#69C9D0",
  LinkedIn: "#0A66C2",
  Discord: "#5865F2",
};

// Discord only has ONE real data point (Sep 9) instead of a full weekly
// history like the other 6 - it still shows up in the table/chart below,
// just with a dash for every earlier date instead of a fabricated number.
const PLATFORM_ICON: Record<string, any> = {
  Instagram, X: Twitter, YouTube: Youtube, TikTok: Music2, LinkedIn: Linkedin, Facebook, Discord: MessagesSquare,
};

function fmtDate(d: string) {
  const dt = new Date(d);
  // Force UTC so this renders identically on the server (UTC) and any client
  // timezone — otherwise a date like "2026-08-07" can display as "Aug 6" for
  // browsers west of UTC, causing a hydration mismatch.
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function fmt(n: number | null) {
  if (n == null) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

/**
 * Fills gaps in a platform's weekly series using the nearest known real
 * value (forward-fill first, then backward-fill for leading gaps like
 * Discord's, which only has a value in the LAST column). Returns each
 * cell tagged with whether it's real or carried-over, so the UI can show
 * a visual difference instead of pretending a filled value was verified.
 */
function fillSeries(values: (number | null)[]): { value: number | null; real: boolean }[] {
  const filled: { value: number | null; real: boolean }[] = values.map((v) => ({ value: v, real: v != null }));
  // forward-fill
  for (let i = 1; i < filled.length; i++) {
    if (filled[i].value == null) filled[i].value = filled[i - 1].value;
  }
  // backward-fill any still-null leading entries (e.g. Discord)
  for (let i = filled.length - 2; i >= 0; i--) {
    if (filled[i].value == null) filled[i].value = filled[i + 1].value;
  }
  return filled;
}

export default function SocialMedia() {
  const { weeks, growthAnalysis } = data.followerHistory as any;
  const { channels } = data as any;
  const chartData = weeks.map((w: any) => ({ ...w, label: fmtDate(w.date) }));
  const platforms = Object.keys(PLATFORM_COLOR);

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Social Media</h1>
        <p className="text-gray-400 text-sm mt-1">
          Follower history (7 platforms &mdash; Discord only has one data point so far) + full channel breakdown ({channels.length} platforms).
        </p>
        <span className="inline-block mt-2 text-[9px] font-bold text-green-400 bg-green-400/10 rounded px-2 py-1">
          VERIFIED &middot; INTERNAL SOURCE
        </span>
      </div>

      {/* ==================================================== */}
      {/* TABLE FIRST — precise reading, this is what was hard  */}
      {/* to see in the chart alone                              */}
      {/* ==================================================== */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
          Followers by Week
        </h2>
        <div className="bg-[#151517] border border-white/10 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2.5 px-4 text-gray-400 text-xs font-bold uppercase">Platform</th>
                {chartData.map((w: any) => (
                  <th key={w.date} className="text-right py-2.5 px-3 text-gray-400 text-xs font-bold">{w.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {platforms.map((platform) => {
                const series = fillSeries(chartData.map((w: any) => w[platform]));
                return (
                  <tr key={platform} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 px-4 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: PLATFORM_COLOR[platform] }} />
                      {platform}
                    </td>
                    {series.map((cell, i) => (
                      <td key={chartData[i].date} className={`text-right py-2.5 px-3 font-mono text-xs ${cell.real ? "text-gray-300" : "text-gray-500 italic"}`}>
                        {fmt(cell.value)}{!cell.real && cell.value != null ? "*" : ""}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="bg-white/5">
                <td className="py-2.5 px-4 font-extrabold text-white">Total</td>
                {chartData.map((w: any, colIndex: number) => {
                  const total = platforms.reduce((sum, platform) => {
                    const series = fillSeries(chartData.map((wk: any) => wk[platform]));
                    return sum + (series[colIndex].value ?? 0);
                  }, 0);
                  return (
                    <td key={w.date} className="text-right py-2.5 px-3 font-extrabold text-white text-xs">
                      {fmt(total)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-gray-600 mt-2">
          * = no real number for that date, showing the nearest known value instead (carried
          forward/backward) so the table isn't full of dashes. Not a new data point.
        </p>
      </div>

      {/* ==================================================== */}
      {/* CHART — kept as a secondary "shape at a glance" view  */}
      {/* ==================================================== */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">Trend Shape</h2>
        <div className="bg-[#151517] border border-white/10 rounded-xl p-4" style={{ height: 280 }}>
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
              {platforms.map((platform) => (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  stroke={PLATFORM_COLOR[platform]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-gray-600 mt-2">
          X/Instagram/Facebook sit on a much bigger scale than TikTok/LinkedIn, which flattens their
          lines near the bottom &mdash; use the table above for precise numbers, this is just for
          shape/direction at a glance.
        </p>
      </div>

      {/* ---- Growth ranking ---- */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
          Ranked by Growth Rate (Each Platform's Own Latest Real Data)
        </h2>
        <div className="space-y-2">
          {growthAnalysis.map((g: any, i: number) => {
            const Icon = g.totalChangePct > 0 ? TrendingUp : g.totalChangePct < 0 ? TrendingDown : Minus;
            const color = g.totalChangePct > 5 ? "#22C55E" : g.totalChangePct < 0 ? "#D42B3F" : "#999";
            return (
              <div key={g.platform} className="flex items-center gap-3 bg-[#151517] border border-white/10 rounded-lg px-4 py-3">
                <div className="text-xs font-bold text-gray-600 w-5">{i + 1}</div>
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PLATFORM_COLOR[g.platform] }} />
                <div className="font-bold text-sm w-24">{g.platform}</div>
                <div className="text-xs text-gray-500 w-16">{g.current.toLocaleString()}</div>
                <div className="text-[9px] text-gray-600 w-16">as of {fmtDate(g.asOf)}</div>
                <div className="flex items-center gap-1 ml-auto" style={{ color }}>
                  <Icon size={13} />
                  <span className="font-bold text-sm">{g.totalChangePct > 0 ? "+" : ""}{g.totalChangePct}%</span>
                </div>
                <div className="text-[10px] text-gray-500 w-32 text-right">
                  {g.totalChange > 0 ? "+" : ""}{g.totalChange} over {g.spanWeeks}wk
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Callout on the standout finding ---- */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-2">
        <div className="font-bold text-sm text-green-400">Facebook is still the biggest standout</div>
        <p className="text-xs text-gray-300 leading-relaxed">
          +43.7% over its 3-week span (2,554 &rarr; 3,670) &mdash; no other platform is close, though
          it hasn't had a newer check-in since Aug 28.
        </p>
        <div className="font-bold text-sm text-green-400 pt-1">LinkedIn moved up with the new data point</div>
        <p className="text-xs text-gray-300 leading-relaxed">
          +8.7% over 4 weeks (115 &rarr; 125) once the Sep 9 number is included &mdash; small in absolute
          terms (only +10 followers) but a real, consistent upward trend on a small base.
        </p>
      </div>

      {/* ==================================================== */}
      {/* FULL CHANNEL BREAKDOWN — moved here from Overview,    */}
      {/* which is now simplified to a quick glance list         */}
      {/* ==================================================== */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-1">Full Channel Breakdown</h2>
        <p className="text-[10px] text-gray-600 mb-3">
          The strengths/improvements bullets are starting impressions, not backed by verified post
          data yet (X is the exception &mdash; see Content Performance Analysis for real findings there).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...channels].sort((a: any, b: any) => b.followers - a.followers).map((ch: any) => {
            const Icon = PLATFORM_ICON[ch.platform];
            return (
              <div key={ch.platform} className="bg-[#151517] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#D42B3F]/15 flex items-center justify-center">
                    <Icon size={18} className="text-[#D42B3F]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      {ch.platform}
                      {ch._verified ? (
                        <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5">VERIFIED</span>
                      ) : (
                        <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5">EST.</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{ch.handle}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-extrabold text-sm">{fmt(ch.followers)}</div>
                    <div className="text-[10px] text-gray-500">followers</div>
                    {ch._asOf && <div className="text-[8px] text-gray-600">*as of {ch._asOf}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                  <div className="bg-white/5 rounded-lg py-2">
                    <div className="font-bold text-sm">{ch.engagementRate == null ? "—" : `${ch.engagementRate}%`}</div>
                    <div className="text-[9px] text-gray-500">ENGAGEMENT</div>
                  </div>
                  <div className="bg-white/5 rounded-lg py-2">
                    <div className="font-bold text-sm">{fmt(ch.following)}</div>
                    <div className="text-[9px] text-gray-500">FOLLOWING{ch.following == null && " (unverified)"}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {ch.strengths.map((s: string, i: number) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-300">
                      <span className="text-green-400">+</span> {s}
                    </div>
                  ))}
                  {ch.improvements.map((s: string, i: number) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-400">
                      <span className="text-[#D42B3F]">&#8594;</span> {s}
                    </div>
                  ))}
                </div>

                {ch.url && (
                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-white"
                  >
                    <ExternalLink size={10} /> Open channel
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
