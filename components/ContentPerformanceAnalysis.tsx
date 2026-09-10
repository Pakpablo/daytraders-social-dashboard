import { TrendingUp, TrendingDown, Lightbulb, ExternalLink, AlertCircle, BarChart3, Layers } from "lucide-react";
import data from "@/data/social-mock-data.json";

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

export default function ContentPerformanceAnalysis() {
  const a = data.contentPerformanceAnalysis as any;
  const sorted = [...a.allPosts].sort((x: any, y: any) => y.views - x.views);
  const maxViews = sorted[0].views;

  // Group the new multi-platform posts by their post group (same content, cross-posted)
  const groups: Record<string, any[]> = {};
  a.multiPlatformPosts.forEach((p: any) => {
    (groups[p.postGroup] ??= []).push(p);
  });
  const groupList = Object.values(groups).sort(
    (g1: any, g2: any) => Math.max(...g2.map((p: any) => p.reach)) - Math.max(...g1.map((p: any) => p.reach))
  );

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Content Performance Analysis</h1>
        <p className="text-gray-400 text-sm mt-1">
          {a.allPosts.length} posts from public X search (Jul 2026) + {a.multiPlatformPosts.length} rows across
          6 platforms from the internal Weekly Content Performance sheet (Aug 29&ndash;Sep 7, 2026).
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

      {/* ---- Category breakdown (new, real, from internal sheet) ---- */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers size={16} className="text-blue-400" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">By Content Category</h2>
        </div>
        <div className="space-y-1.5">
          {a.categoryBreakdown.map((c: any, i: number) => (
            <div key={i} className="flex items-center gap-3 bg-[#151517] border border-white/10 rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="text-xs font-semibold truncate">{c.category}</span>
                {c.adsRun && (
                  <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5 shrink-0">
                    ADS RUN
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 shrink-0">{c.count} posts</span>
              <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0 hidden sm:block">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(4, (c.avgReach / a.categoryBreakdown[0].avgReach) * 100)}%`, background: c.adsRun ? "#f59e0b" : "#3b82f6" }}
                />
              </div>
              <div className="text-xs font-bold text-gray-300 w-16 text-right shrink-0">{fmt(c.avgReach)} avg</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Platform breakdown (new, real) ---- */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} className="text-purple-400" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">By Platform</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {a.platformBreakdown.map((p: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold">{fmt(p.avgReach)}</div>
              <div className="text-[10px] text-gray-500">{p.platform} &middot; avg reach &middot; {p.count} posts</div>
            </div>
          ))}
        </div>
      </div>

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

      {/* ---- Multi-platform posts, grouped by post, cross-platform comparison ---- */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300 mb-3">
          Recent Posts, Cross-Platform (Aug 29&ndash;Sep 7)
        </h2>
        <div className="space-y-3">
          {groupList.map((group: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-gray-500">{group[0].date}</span>
                <span className="text-[9px] font-semibold text-gray-500 bg-white/5 rounded px-2 py-0.5">{group[0].category}</span>
                {group[0].adsRun && (
                  <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5">ADS RUN</span>
                )}
              </div>
              <p className="text-xs text-gray-300 mb-3 leading-relaxed">{group[0].overview}</p>
              <div className="flex flex-wrap gap-2">
                {group.map((p: any, j: number) => (
                  <a
                    key={j}
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-lg px-2.5 py-1.5 text-[10px]"
                  >
                    <span className="font-bold">{p.platform}</span>
                    <span className="text-gray-400">{fmt(p.reach)} reach</span>
                    <span className="text-gray-500">&middot; {p.likes}&#9825; {p.comments}&#128172;</span>
                    <ExternalLink size={9} className="text-gray-600" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Older X-only posts, ranked ---- */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300 mb-3">
          Earlier Posts Found via Public Search (Jul 2026, X only)
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
