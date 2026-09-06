import {
  Instagram, Youtube, Linkedin, Twitter, Music2,
  Eye, TrendingUp, Users, Flame, ThumbsUp, MessageCircle, Share2,
} from "lucide-react";
import data from "@/data/social-mock-data.json";

// NOTE: lucide-react has no official TikTok/X brand glyph in most versions.
// Music2 stands in for TikTok and Twitter stands in for X below —
// swap for real brand SVGs if you have licensed assets.
const PLATFORM_ICON: Record<string, any> = {
  Instagram, X: Twitter, YouTube: Youtube, TikTok: Music2, LinkedIn: Linkedin,
};

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

export default function DashboardOverview() {
  const { overviewStats, channels, liveFeedTopPosts } = data;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Social Audit &amp; Live Feed</h1>
        <p className="text-gray-400 text-sm mt-1">
          DayTraders.com &middot; Instagram, X, YouTube, TikTok, LinkedIn
        </p>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Total Reach" value={fmt(overviewStats.totalReach)} />
        <StatCard icon={TrendingUp} label="Engagement Rate" value={`${overviewStats.engagementRate}%`} />
        <StatCard icon={Users} label="Net Follower Growth (7d)" value={`+${fmt(overviewStats.netFollowerGrowth7d)}`} />
        <StatCard icon={Flame} label="Top Post (Week)" value={overviewStats.topPostOfWeek.platform} sub={`${fmt(overviewStats.topPostOfWeek.likes)} likes`} />
      </div>

      {/* ================= PER-CHANNEL ANALYSIS ================= */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">Channel Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((ch) => {
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
                      {(ch as any)._verified ? (
                        <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5">REAL</span>
                      ) : (
                        <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5">EST.</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{ch.handle}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-extrabold text-sm">{fmt(ch.followers)}</div>
                    <div className="text-[10px] text-gray-500">followers</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                  <div className="bg-white/5 rounded-lg py-2">
                    <div className="font-bold text-sm">{ch.engagementRate !== null ? `${ch.engagementRate}%` : "—"}</div>
                    <div className="text-[9px] text-gray-500">ENGAGEMENT</div>
                  </div>
                  <div className="bg-white/5 rounded-lg py-2">
                    <div className="font-bold text-sm">{ch.postsLast30d}</div>
                    <div className="text-[9px] text-gray-500">POSTS / 30D</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {ch.strengths.map((s, i) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-300">
                      <span className="text-green-400">+</span> {s}
                    </div>
                  ))}
                  {ch.improvements.map((s, i) => (
                    <div key={i} className="flex gap-2 text-xs text-gray-400">
                      <span className="text-[#D42B3F]">&#8594;</span> {s}
                    </div>
                  ))}
                </div>

                {(ch as any)._sourceNote && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-gray-600 italic leading-relaxed">
                    {(ch as any)._sourceNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= LIVE FEED ================= */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
          Live Feed &mdash; Top 3 Performing Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveFeedTopPosts.map((post, i) => {
            const Icon = PLATFORM_ICON[post.platform];
            return (
              <div key={i} className="bg-[#151517] border border-white/10 rounded-xl p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-[#D42B3F]" />
                  <span className="text-xs font-bold text-gray-400">{post.platform}</span>
                </div>
                <p className="text-sm font-semibold mb-3 leading-snug">{post.caption}</p>

                <div className="flex gap-3 text-[11px] text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Eye size={12} />{fmt(post.metrics.views)}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={12} />{fmt(post.metrics.likes)}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} />{fmt(post.metrics.comments)}</span>
                  <span className="flex items-center gap-1"><Share2 size={12} />{fmt(post.metrics.shares)}</span>
                </div>

                <div className="mt-auto space-y-1.5 border-t border-white/10 pt-3">
                  <MiniRow label="Hook" value={post.whyItWorked.hookType} />
                  <MiniRow label="Visual" value={post.whyItWorked.visualStyle} />
                  <MiniRow label="CTA" value={post.whyItWorked.cta} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[#151517] border border-white/10 rounded-xl p-4">
      <Icon size={16} className="text-[#D42B3F] mb-2" />
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{label}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[11px]">
      <span className="text-[#D42B3F] font-bold uppercase text-[9px] tracking-wide">{label}: </span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}
