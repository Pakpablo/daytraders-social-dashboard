"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  Radar, Star, TrendingUp, TrendingDown, AlertTriangle, MessageSquareQuote, Target,
  Lightbulb, Film, Megaphone, Share2, Video, ChevronDown, ChevronUp, ShieldAlert,
} from "lucide-react";
import data from "@/data/social-mock-data.json";

const AWARENESS_COLOR: Record<number, string> = {
  1: "#666", 2: "#3B82F6", 3: "#F59E0B", 4: "#EA580C", 5: "#D42B3F",
};

export default function DailyIntelligenceReport() {
  const r = data.dailyIntelligenceReport as any;
  const [expandedReel, setExpandedReel] = useState<number | null>(null);

  // Competitor ad-count chart data - only ones with a real number (skip "not surfacing")
  const adCountData = r.competitorMoves
    .map((c: any) => ({ name: c.competitor, count: parseInt(c.activeAds) || 0 }))
    .filter((c: any) => c.count > 0)
    .sort((a: any, b: any) => b.count - a.count);

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-8 max-w-5xl mx-auto">
      {/* ---- Header ---- */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Radar size={20} className="text-[#D42B3F]" />
          <h1 className="text-2xl font-extrabold">Daily Intelligence Report</h1>
        </div>
        <p className="text-gray-400 text-sm">
          VoC + Competitor Intel &mdash; Futures Prop-Firm Landscape &middot; by <span className="text-gray-300 font-semibold">Abi</span>
        </p>
        <p className="text-[11px] text-gray-600 mt-1">{r.reportDate} &middot; {r.preparedNote}</p>
      </div>

      {/* ---- KPI header stats ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {r.headerStats.map((s: any, i: number) => (
          <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-4">
            {s.tag && (
              <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5">{s.tag}</span>
            )}
            <div className="text-xl font-extrabold mt-1">{s.value}</div>
            <div className="text-[10px] text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ============ PART 1D: AWARENESS MAP (chart) ============ */}
      <div>
        <SectionTitle icon={Target} title="Awareness Map — Today's Captures" />
        <div className="bg-[#151517] border border-white/10 rounded-xl p-4">
          <div className="space-y-2.5">
            {r.awarenessMap.map((a: any) => {
              const shift = a.sharePrev != null ? a.shareToday - a.sharePrev : null;
              return (
                <div key={a.stage}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold w-32 shrink-0" style={{ color: AWARENESS_COLOR[a.stage] }}>
                      {a.stage}. {a.label}
                    </span>
                    <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                      <div className="h-full rounded flex items-center justify-end pr-2" style={{ width: `${a.shareToday * 2}%`, background: AWARENESS_COLOR[a.stage] }}>
                        <span className="text-[10px] font-bold text-white">{a.shareToday}%</span>
                      </div>
                    </div>
                    {shift != null && (
                      <span className={`text-[10px] font-bold w-16 text-right shrink-0 flex items-center gap-0.5 justify-end ${shift > 0 ? "text-[#D42B3F]" : "text-blue-400"}`}>
                        {shift > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {shift > 0 ? "+" : ""}{shift}pt
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 ml-[8.75rem] leading-relaxed">{a.description}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-300 bg-[#D42B3F]/10 border border-[#D42B3F]/30 rounded-lg p-3 mt-4 leading-relaxed">
            {r.awarenessShift}
          </p>
        </div>
      </div>

      {/* ============ PART 1A: COMPETITOR AD COUNTS (chart) ============ */}
      <div>
        <SectionTitle icon={Megaphone} title="Active Meta Ads by Competitor" />
        <div className="bg-[#151517] border border-white/10 rounded-xl p-4" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adCountData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
              <XAxis type="number" stroke="#666" fontSize={10} />
              <YAxis type="category" dataKey="name" stroke="#999" fontSize={10} width={110} />
              <Tooltip contentStyle={{ background: "#0B0B0D", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#D42B3F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-gray-600 mt-2">Audited live in Meta Ad Library (US, active ads only). Firms not surfacing on keyword search excluded from this chart.</p>
      </div>

      {/* ============ Full competitor moves table ============ */}
      <div>
        <SectionTitle icon={Radar} title="Competitor Moves — Full Detail" />
        <div className="space-y-2">
          {r.competitorMoves.map((c: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">{c.competitor}</span>
                <span className="text-[10px] text-gray-500">{c.activeAds}</span>
              </div>
              <p className="text-[11px] text-amber-400/90 mb-1">{c.change}</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">{c.pushing}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ PART 1B: META WINNER ADS ============ */}
      <div>
        <SectionTitle icon={Star} title="Meta Winner Ads — Longest-Running / Scaled" />
        <div className="space-y-3">
          {r.metaWinnerAds.map((ad: any, i: number) => (
            <div
              key={i}
              className={`bg-[#151517] border rounded-xl p-4 ${ad.isBreaking ? "border-[#D42B3F]" : "border-white/10"}`}
            >
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <div>
                  <span className="font-bold text-sm">{ad.competitor}</span>
                  <span className="text-gray-500 text-xs"> &mdash; {ad.tagline}</span>
                </div>
                {ad.isBreaking && (
                  <span className="text-[8px] font-bold text-white bg-[#D42B3F] rounded px-2 py-0.5 flex items-center gap-1">
                    <AlertTriangle size={9} /> BREAKING
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-600 mb-2">Active since {ad.activeSince} &middot; Library ID {ad.libraryId}</p>
              <p className="text-xs text-gray-200 italic mb-2 leading-relaxed">&ldquo;{ad.adCopy}&rdquo;</p>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-2">{ad.analysis}</p>
              {ad.breakingUpdate && (
                <p className="text-[11px] text-[#D42B3F] bg-[#D42B3F]/10 border border-[#D42B3F]/30 rounded-lg p-2.5 leading-relaxed">
                  {ad.breakingUpdate}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============ PART 1C: CUSTOMER LANGUAGE ============ */}
      <div>
        <SectionTitle icon={MessageSquareQuote} title="Customer Language (Verbatim)" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {r.customerQuotes.map((q: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-3.5">
              <span
                className="text-[8px] font-bold rounded px-1.5 py-0.5"
                style={{ color: AWARENESS_COLOR[q.awarenessStage], background: `${AWARENESS_COLOR[q.awarenessStage]}20` }}
              >
                {q.awarenessStage} {q.awarenessLabel}
              </span>
              <p className="text-xs text-gray-200 italic mt-2 mb-2 leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
              <p className="text-[10px] text-gray-600">&mdash; {q.source}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-300 bg-white/5 rounded-lg p-3 mt-3 leading-relaxed">{r.denialStorySpreading}</p>
      </div>

      {/* ============ PART 1E: COMPETITOR EMAIL LOG ============ */}
      <div>
        <SectionTitle icon={Share2} title="Competitor Email Log" />
        <div className="space-y-2">
          {r.competitorEmails.map((e: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">{e.sender}</span>
                <span className="text-[10px] text-gray-600">{e.arrived}</span>
              </div>
              <p className="text-xs text-gray-300 mb-1">{e.subject}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{e.hook}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ PART 2: THE BIG PATTERNS ============ */}
      <div>
        <SectionTitle icon={Lightbulb} title="The Big Patterns" color="#F59E0B" />
        <div className="space-y-2">
          {r.bigPatterns.map((p: string, i: number) => (
            <div key={i} className="flex gap-3 bg-[#151517] border border-white/10 rounded-lg p-3">
              <div className="text-amber-400 font-bold text-sm shrink-0">{i + 1}</div>
              <p className="text-xs text-gray-300 leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ PART 3: THE GAPS ============ */}
      <div>
        <SectionTitle icon={ShieldAlert} title="The Gaps" />
        <div className="space-y-2">
          {r.gaps.map((g: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-3.5 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">Competitor does</div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{g.competitorMove}</p>
              </div>
              <div>
                <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">DayTraders status</div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{g.dtStatus}</p>
              </div>
              <div>
                <div className="text-[9px] font-bold text-green-400 uppercase mb-1">Recommended move</div>
                <p className="text-[11px] text-gray-200 leading-relaxed">{g.recommendedMove}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ PART 4: THE MOVES ============ */}
      <div>
        <SectionTitle icon={Target} title="The Moves" color="#22C55E" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MoveGroup icon={Megaphone} title="Paid Ads" items={r.moves.paidAds} />
          <MoveGroup icon={Share2} title="Social Ads" items={r.moves.socialAds} />
          <MoveGroup icon={MessageSquareQuote} title="Organic Posting" items={r.moves.organicPosting} />
          <MoveGroup icon={Video} title="Videos to Produce" items={r.moves.videos} />
        </div>
      </div>

      {/* ============ PART 5: READY ASSETS ============ */}
      <div>
        <SectionTitle icon={Film} title="Ready-to-Produce Assets" color="#7C3AED" />
        <div className="space-y-2 mb-4">
          {r.readyAssets.reels.map((reel: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedReel(expandedReel === i ? null : i)}
                className="w-full flex items-center justify-between p-3.5 text-left"
              >
                <span className="font-bold text-sm">{reel.title}</span>
                {expandedReel === i ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
              </button>
              {expandedReel === i && (
                <div className="px-3.5 pb-3.5">
                  <pre className="text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed font-sans bg-white/5 rounded-lg p-3">{reel.script}</pre>
                  {reel.note && <p className="text-[10px] text-gray-500 mt-2 italic">{reel.note}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="bg-[#151517] border border-white/10 rounded-xl p-4">
          <div className="text-xs font-bold text-gray-300 mb-2">Ad Headline Bank</div>
          <div className="space-y-1.5">
            {r.readyAssets.adHeadlines.map((h: string, i: number) => (
              <p key={i} className="text-xs text-gray-300 italic">{h}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ============ COVERAGE FLAGS / SOURCES ============ */}
      <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-[11px] text-amber-300 leading-relaxed">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        <div>
          <p className="mb-2">{r.coverageFlags}</p>
          <p className="mb-2">{r.reissueNote}</p>
          <p className="text-amber-400/70">Sources: {r.sources}</p>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, color = "#D42B3F" }: { icon: any; title: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} style={{ color }} />
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">{title}</h2>
    </div>
  );
}

function MoveGroup({ icon: Icon, title, items }: { icon: any; title: string; items: string[] }) {
  return (
    <div className="bg-[#151517] border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={13} className="text-green-400" />
        <span className="font-bold text-xs uppercase tracking-wide text-gray-300">{title}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 text-[11px] text-gray-300 leading-relaxed">
            <span className="text-green-400 shrink-0">&#9632;</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
