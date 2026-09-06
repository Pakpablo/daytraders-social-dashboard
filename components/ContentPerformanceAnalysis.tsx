import { TrendingUp, TrendingDown, Lightbulb, AlertCircle } from "lucide-react";
import data from "@/data/social-mock-data.json";

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

export default function ContentPerformanceAnalysis() {
  const a = data.contentPerformanceAnalysis as any;
  const sorted = [...a.allPosts].sort((x: any, y: any) => y.views - x.views);
  const maxViews = sorted[0].views;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Content Performance Analysis</h1>
        <p className="text-gray-400 text-sm mt-1">
          Built from {a.allPosts.length} real posts found on X. Instagram &amp; TikTok post-level
          data wasn't findable this pass &mdash; see the note at the bottom.
        </p>
      </div>

      {/* ---- What worked best ---- */}
      <Section
        icon={TrendingUp}
        color="#22C55E"
        title="What's Worked Best"
        items={a.whatWorkedBest}
      />

      {/* ---- What worked least ---- */}
      <Section
        icon={TrendingDown}
        color="#D42B3F"
        title="What's Worked Least"
        items={a.whatWorkedLeast}
      />

      {/* ---- Recommendations ---- */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">Suggestions</h2>
        </div>
        <div className="space-y-2">
          {a.recommendations.map((r: string, i: number) => (
            <div key={i} className="flex gap-3 bg-[#151517] border border-white/10 rounded-lg p-3">
              <div className="text-amber-400 font-bold text-sm shrink-0">{i + 1}</div>
              <div className="text-sm text-gray-300 leading-relaxed">{r}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- All 12 posts, ranked ---- */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300 mb-3">
          Every Post Found, Ranked by Views
        </h2>
        <div className="space-y-1.5">
          {sorted.map((post: any, i: number) => (
            <div key={i} className="flex items-center gap-3 bg-[#151517] border border-white/10 rounded-lg px-3 py-2">
              <div className="text-xs font-bold text-gray-600 w-5">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{post.caption}</div>
                <div className="text-[10px] text-gray-500">{post.type} &middot; {post.date}</div>
              </div>
              <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5 shrink-0 hidden md:inline-block">
                VERIFIED
              </span>
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0 hidden sm:block">
                <div
                  className="h-full bg-[#D42B3F] rounded-full"
                  style={{ width: `${Math.max(4, (post.views / maxViews) * 100)}%` }}
                />
              </div>
              <div className="text-xs font-bold text-gray-300 w-14 text-right shrink-0">{fmt(post.views)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Honest gap note ---- */}
      <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 leading-relaxed">
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        {a._readme}
      </div>
    </div>
  );
}

function Section({
  icon: Icon, color, title, items,
}: { icon: any; color: string; title: string; items: { pattern: string; evidence: string; why: string }[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} style={{ color }} />
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">{title}</h2>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-[#151517] border rounded-xl p-4" style={{ borderColor: `${color}33` }}>
            <div className="font-bold text-sm mb-2" style={{ color }}>{item.pattern}</div>
            <div className="text-xs text-gray-300 mb-2 leading-relaxed">
              <span className="font-bold text-gray-500 uppercase text-[9px] tracking-wide">Evidence: </span>
              {item.evidence}
            </div>
            <div className="text-xs text-gray-400 leading-relaxed">
              <span className="font-bold text-gray-500 uppercase text-[9px] tracking-wide">Why: </span>
              {item.why}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
