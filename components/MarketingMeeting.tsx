"use client";

import { Star } from "lucide-react";
import data from "@/data/social-mock-data.json";

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

export default function MarketingMeeting() {
  const m = data.marketingMeeting as any;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-6">
      {/* ---- Header with real logo ---- */}
      <div className="flex items-center gap-3">
        <img
          src={m.logoUrl}
          alt="DayTraders logo"
          className="h-10 w-auto"
          onError={(e) => {
            // If the external asset ever moves, fail gracefully instead of a broken image icon
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div>
          <h1 className="text-2xl font-extrabold">Marketing Meeting Recap</h1>
          <p className="text-gray-400 text-sm">{m.date} &middot; Internal weekly newsletter</p>
        </div>
      </div>

      {/* ---- Sections ---- */}
      <div className="space-y-3">
        {m.sections.map((s: any) => (
          <div key={s.num} className="bg-[#151517] border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-white text-[#0B0B0D] text-[10px] font-bold flex items-center justify-center shrink-0">
                {s.num}
              </div>
              <div className="font-bold text-sm flex-1">{s.title}</div>
              <span className="text-[9px] font-bold text-[#D42B3F] border border-[#D42B3F] rounded px-2 py-0.5 shrink-0">
                {s.owner.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pl-7">{s.body}</p>
          </div>
        ))}
      </div>

      {/* ---- Best post ---- */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star size={16} className="text-green-400" />
          <div className="font-bold text-sm text-green-400 flex-1">Best Post This Week (Verified)</div>
          <span className="text-[9px] font-bold text-green-400 border border-green-500/40 rounded px-2 py-0.5">
            {m.bestPost.platform}
          </span>
        </div>
        <p className="text-xs text-gray-200 leading-relaxed">
          <b>&ldquo;{m.bestPost.caption}&rdquo;</b> &mdash; <b>{fmt(m.bestPost.views)} views</b>. {m.bestPost.note}
        </p>
      </div>

      {/* ---- Talking points ---- */}
      <div>
        <h2 className="text-sm font-bold text-[#D42B3F] mb-3">Talking Points for Tomorrow</h2>
        <div className="space-y-2">
          {m.talkingPoints.map((tp: string, i: number) => (
            <div key={i} className="flex gap-3 bg-[#D42B3F]/10 border-l-2 border-[#D42B3F] rounded px-3 py-2.5">
              <div className="text-[#D42B3F] font-bold text-sm shrink-0">{i + 1}</div>
              <div className="text-xs text-gray-200 leading-relaxed">{tp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
