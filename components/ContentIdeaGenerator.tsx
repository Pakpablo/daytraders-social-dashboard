"use client";

import { Lightbulb, Target, Megaphone, Users2, RefreshCw, AlertTriangle, Hash, Radar, Sparkles, Clapperboard, Globe2, BarChart3 } from "lucide-react";
import { useState } from "react";
import data from "@/data/social-mock-data.json";

const OBJECTIVE_STYLE: Record<string, { color: string; icon: any }> = {
  "Direct Conversion": { color: "#D42B3F", icon: Target },
  "Brand Awareness": { color: "#2563EB", icon: Megaphone },
  "Affiliate Magnet": { color: "#059669", icon: Users2 },
};

// One entry per possible ideaSource.type - covers every place an AI-generated
// idea could have come from, so nothing ever ships unsourced.
const SOURCE_STYLE: Record<string, { icon: any; color: string; prefix: string }> = {
  "marketing-idea": { icon: Hash, color: "#D42B3F", prefix: "From #marketing-ideas" },
  "trend-active": { icon: Radar, color: "#D42B3F", prefix: "From Trend Radar (Active)" },
  "trend-emerging": { icon: Sparkles, color: "#2563EB", prefix: "From Trend Radar (Emerging)" },
  "trend-format": { icon: Clapperboard, color: "#059669", prefix: "From Trend Radar (Format)" },
  "pop-culture": { icon: Globe2, color: "#7C3AED", prefix: "From Pop Culture Trends" },
  "performance-data": { icon: BarChart3, color: "#EA580C", prefix: "From Content Performance Analysis" },
};

export default function ContentIdeaGenerator() {
  const [ideas] = useState(data.contentIdeas as any[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Lightbulb size={22} className="text-[#D42B3F]" /> AI Content Idea Generator
          </h1>
          <p className="text-gray-400 text-sm mt-1">Fresh ideas from trend + performance data — trading-niche and beyond.</p>
          <p className="text-[10px] text-gray-600 mt-2">
            These are generated suggestions, not factual claims about anything — no verified/unverified
            badges apply here the way they do elsewhere in the app.
          </p>
        </div>
        <button className="flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2">
          <RefreshCw size={13} /> Regenerate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea, i) => {
          const obj = OBJECTIVE_STYLE[idea.objective];
          const ObjIcon = obj.icon;
          return (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-5">
              {idea.ideaSource && (() => {
                const style = SOURCE_STYLE[idea.ideaSource.type];
                const SrcIcon = style.icon;
                return (
                  <div
                    className="flex items-center gap-1.5 mb-3 text-[10px] font-bold rounded-lg px-2.5 py-1.5 w-fit"
                    style={{ color: style.color, background: `${style.color}1a` }}
                  >
                    <SrcIcon size={11} />
                    {style.prefix} &mdash; {idea.ideaSource.credit ? idea.ideaSource.credit.join(" & ") : idea.ideaSource.label}
                  </div>
                );
              })()}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-base leading-snug pr-3">{idea.title}</h3>
                <span
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shrink-0"
                  style={{ background: `${obj.color}22`, color: obj.color }}
                >
                  <ObjIcon size={10} /> {idea.objective}
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                <Tag>{idea.format}</Tag>
                <Tag>{idea.platform}</Tag>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wide text-[#D42B3F]">Hook Line</div>
                  <div className="text-sm text-gray-200 italic">&ldquo;{idea.hookLine}&rdquo;</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wide text-[#D42B3F]">Key Messaging</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{idea.keyMessaging}</div>
                </div>
              </div>

              {idea.note && (
                <div className="mt-3 flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-[10px] text-amber-300 leading-relaxed">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  {idea.note}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-md px-2 py-1">
      {children}
    </span>
  );
}
