import { TrendingUp, TrendingDown, Lightbulb, ExternalLink, AlertCircle, BarChart3, Layers } from "lucide-react";
import data from "@/data/social-mock-data.json";

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

const PLATFORM_COLOR: Record<string, string> = {
  X: "#1DA1F2",
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  YouTube: "#FF0000",
  TikTok: "#69C9D0",
  LinkedIn: "#0A66C2",
};

export default function ContentPerformanceAnalysis() {
  const a = data.contentPerformanceAnalysis as any;
  const p = data.realPlatformAnalytics as any;
  const sorted = [...a.allPosts].sort((x: any, y: any) => y.views - x.views);
  const maxViews = sorted[0].views;

  // Group the multi-platform posts by post group (same content, cross-posted) for side-by-side comparison
  const groups: Record<string, any[]> = {};
  a.multiPlatformPosts.forEach((post: any) => {
    (groups[post.postGroup] ??= []).push(post);
  });
  const groupList = Object.values(groups).sort(
    (g1: any, g2: any) => Math.max(...(g2 as any[]).map((post: any) => post.reach)) - Math.max(...(g1 as any[]).map((post: any) => post.reach))
  );

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Content Performance Analysis</h1>
        <p className="text-gray-400 text-sm mt-1">
          {a.allPosts.length} posts from public X search (Jul 2026) + {a.multiPlatformPosts.length} rows across
          6 platforms from the internal Weekly Content Performance sheet (Aug 29&ndash;Sep 7, 2026) + real native
          platform analytics below (Sep 14, 2026).
        </p>
      </div>

      {/* ---- Native platform analytics (real, from each platform's own dashboard) ---- */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} className="text-green-400" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">Native Platform Analytics (Real)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlatformCard
            name="Facebook"
            period={p.facebook.period}
            rows={[
              ["Views", p.facebook.views],
              ["Viewers", p.facebook.viewers],
              ["Net Follows", p.facebook.netFollows],
              ["Visits", p.facebook.visits],
              ["Interactions", p.facebook.contentInteractions],
              ["Link Clicks", p.facebook.linkClicks],
            ]}
          />
          <PlatformCard
            name="Instagram"
            period={p.instagram.period}
            rows={[
              ["Views", p.instagram.views],
              ["Reach", p.instagram.reach],
              ["Follows", p.instagram.follows],
              ["Interactions", p.instagram.contentInteractions],
              ["Conversations", p.instagram.conversationsStarted],
            ]}
          />
          <div className="bg-[#151517] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-sm">X</div>
              <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5">VERIFIED</span>
            </div>
            <div className="text-[10px] text-gray-500 mb-2">Two windows shown (platform doesn't offer 28d)</div>
            <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">{p.x.period7d.range}</div>
            <StatRow label="Impressions" stat={p.x.period7d.impressions} />
            <StatRow label="Engagement Rate" stat={p.x.period7d.engagementRatePct} suffix="%" />
            <StatRow label="New Follows" stat={p.x.period7d.newFollows} />
            <div className="text-[9px] font-bold text-gray-500 uppercase mt-2 mb-1">{p.x.period3m.range}</div>
            <StatRow label="Impressions" stat={p.x.period3m.impressions} />
            <StatRow label="New Follows" stat={p.x.period3m.newFollows} />
          </div>
        </div>
        <p className="text-[10px] text-gray-600 mt-2">{data.realPlatformAnalytics._readme}</p>
      </div>

      {/* ---- Real recent posts (Facebook + matched Instagram engagement) ---- */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300 mb-3">
          Real Recent Posts (Facebook views/reach + matched Instagram engagement)
        </h2>
        <div className="space-y-1.5">
          {[...data.realRecentPosts.posts].sort((x: any, y: any) => y.views - x.views).map((post: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold text-gray-600 w-5">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{post.title}</div>
                  <div className="text-[10px] text-gray-500">{post.format} &middot; {post.date}</div>
                </div>
                <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5 shrink-0">VERIFIED</span>
                <div className="text-xs font-bold text-gray-300 w-20 text-right shrink-0">{fmt(post.views)} views</div>
                <div className="text-xs text-gray-500 w-20 text-right shrink-0">{fmt(post.reach)} reach</div>
              </div>
              {post.instagramEngagement && (
                <div className="text-[10px] text-gray-500 mt-1 ml-8">
                  IG: {fmt(post.instagramEngagement.shares)} shares &middot; {post.instagramEngagement.likes} likes &middot;
                  {" "}{post.instagramEngagement.comments} comments &middot; {post.instagramEngagement.reposts} reposts
                </div>
              )}
            </div>
          ))}
        </div>
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
          {a.platformBreakdown.map((platform: any, i: number) => (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-extrabold">{fmt(platform.avgReach)}</div>
              <div className="text-[10px] text-gray-500">{platform.platform} &middot; avg reach &middot; {platform.count} posts</div>
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

      {/* ---- Multi-platform posts, grouped by post, visual cross-platform comparison ---- */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300 mb-1">
          Recent Posts, Cross-Platform (Aug 29&ndash;Sep 7)
        </h2>
        <p className="text-[10px] text-gray-600 mb-3">
          Bars are scaled within each post so the longest bar is always that post's best-performing platform &mdash; not comparable across different posts.
        </p>
        <div className="space-y-3">
          {groupList.map((group: any, i: number) => {
            const maxReach = Math.max(...group.map((post: any) => post.reach));
            const winner = group.find((post: any) => post.reach === maxReach);
            return (
              <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-500">{group[0].date}</span>
                  <span className="text-[9px] font-semibold text-gray-500 bg-white/5 rounded px-2 py-0.5">{group[0].category}</span>
                  {group[0].adsRun && (
                    <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5">ADS RUN</span>
                  )}
                </div>
                <p className="text-xs text-gray-300 mb-3 leading-relaxed">{group[0].overview}</p>
                <div className="space-y-1.5">
                  {[...group].sort((x: any, y: any) => y.reach - x.reach).map((post: any, j: number) => {
                    const color = PLATFORM_COLOR[post.platform] ?? "#888";
                    const isWinner = post === winner && group.length > 1;
                    return (
                      <a
                        key={j}
                        href={post.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-1.5 py-1 -mx-1.5 group"
                      >
                        <span className="text-xs font-bold w-16 shrink-0 flex items-center gap-1" style={{ color }}>
                          {post.platform}
                          {isWinner && <span title="Best performer for this post">&#127942;</span>}
                        </span>
                        <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden">
                          <div
                            className="h-full rounded"
                            style={{ width: `${Math.max(4, (post.reach / maxReach) * 100)}%`, background: color }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-300 w-16 text-right shrink-0">{fmt(post.reach)}</span>
                        <span className="text-[10px] text-gray-500 w-20 text-right shrink-0">{post.likes}&#9825; {post.comments}&#128172;</span>
                        <ExternalLink size={9} className="text-gray-600 shrink-0 opacity-0 group-hover:opacity-100" />
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
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

function changeColor(pct: number) {
  return pct >= 0 ? "text-green-400" : "text-[#D42B3F]";
}

function StatRow({ label, stat, suffix = "" }: { label: string; stat: { value: number; changePct: number }; suffix?: string }) {
  return (
    <div className="flex items-center justify-between text-xs mb-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold">
        {fmt(stat.value)}{suffix}{" "}
        <span className={`text-[10px] font-normal ${changeColor(stat.changePct)}`}>
          {stat.changePct > 0 ? "+" : ""}{stat.changePct}%
        </span>
      </span>
    </div>
  );
}

function PlatformCard({ name, period, rows }: { name: string; period: string; rows: [string, { value: number; changePct: number }][] }) {
  return (
    <div className="bg-[#151517] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="font-bold text-sm">{name}</div>
        <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5">VERIFIED</span>
      </div>
      <div className="text-[10px] text-gray-500 mb-2">{period}</div>
      {rows.map(([label, stat]) => (
        <StatRow key={label} label={label} stat={stat} />
      ))}
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
