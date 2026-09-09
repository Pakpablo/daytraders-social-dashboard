import {
  Instagram, Youtube, Linkedin, Twitter, Music2, Facebook, MessagesSquare,
  Eye, Flame, ExternalLink, Trophy, Users2,
} from "lucide-react";
import data from "@/data/social-mock-data.json";

// NOTE: lucide-react has no official TikTok/X/Discord brand glyph in most
// versions. Music2 stands in for TikTok, Twitter for X, MessagesSquare for
// Discord below — swap for real brand SVGs if you have licensed assets.
const PLATFORM_ICON: Record<string, any> = {
  Instagram, X: Twitter, YouTube: Youtube, TikTok: Music2, LinkedIn: Linkedin, Facebook, Discord: MessagesSquare,
};

function fmt(n: number | null) {
  if (n == null) return "—";
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
          DayTraders.com &middot; {channels.map((ch) => ch.platform).join(", ")}
        </p>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Total Reach" value={fmt(overviewStats.totalReach.value)} verified={overviewStats.totalReach.verified} />
        <StatCard
          icon={Users2}
          label={`Verified Followers (All ${channels.length})`}
          value={fmt(overviewStats.combinedVerifiedFollowers.value)}
          verified={overviewStats.combinedVerifiedFollowers.verified}
        />
        <StatCard
          icon={Trophy}
          label="Best Verified Platform"
          value={overviewStats.bestVerifiedPlatform.platform}
          sub={`${fmt(overviewStats.bestVerifiedPlatform.followers)} followers`}
          verified={overviewStats.bestVerifiedPlatform.verified}
        />
        <StatCard
          icon={Flame}
          label="Top Post (Real)"
          value={overviewStats.topPostOfWeek.platform}
          sub={`${fmt(overviewStats.topPostOfWeek.views)} views`}
          verified={overviewStats.topPostOfWeek.verified}
          sourceUrl={overviewStats.topPostOfWeek.sourceUrl}
        />
      </div>

      {/* ================= PER-CHANNEL ANALYSIS ================= */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">Channels at a Glance</h2>
        <div className="bg-[#151517] border border-white/10 rounded-xl divide-y divide-white/5">
          {[...channels].sort((a, b) => b.followers - a.followers).map((ch) => {
            const Icon = PLATFORM_ICON[ch.platform];
            return (
              <div key={ch.platform} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-[#D42B3F]/15 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-[#D42B3F]" />
                </div>
                <div className="w-24 shrink-0">
                  <div className="font-bold text-sm">{ch.platform}</div>
                </div>
                <div className="text-xs text-gray-500 flex-1 truncate hidden sm:block">{ch.handle}</div>
                <div className="text-right">
                  <span className="font-extrabold text-sm">{fmt(ch.followers)}</span>
                  <span className="text-[10px] text-gray-500 ml-1">followers</span>
                </div>
                {(ch as any)._asOf && (
                  <div className="text-[8px] text-gray-600 w-20 text-right hidden md:block">*as of {(ch as any)._asOf}</div>
                )}
                {(ch as any)._verified ? (
                  <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5 shrink-0">VERIFIED</span>
                ) : (
                  <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5 shrink-0">EST.</span>
                )}
                {(ch as any).url ? (
                  <a
                    href={(ch as any).url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0"
                    title={`Open ${ch.platform}`}
                  >
                    <ExternalLink size={12} className="text-gray-400" />
                  </a>
                ) : (
                  <div className="w-7 h-7 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-600 mt-2">
          Full breakdown (engagement, following, strengths &amp; improvements) lives on the Social Media page.
        </p>
      </div>

      {/* ================= LIVE FEED ================= */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
          Best Performing Post (Verified)
        </h2>

        {/* ---- Single hero: highest real engagement found ---- */}
        {(() => {
          const best = [...liveFeedTopPosts].sort((a: any, b: any) => (b.metrics.views ?? 0) - (a.metrics.views ?? 0))[0];
          const Icon = PLATFORM_ICON[best.platform];
          return (
            <a
              href={best._source?.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-[#151517] border border-[#D42B3F]/40 rounded-xl p-5 mb-4 hover:border-[#D42B3F] transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-[#D42B3F]" />
                <span className="text-xs font-bold text-gray-300">{best.platform}</span>
                <span className="text-[10px] text-gray-600">{best.handle}</span>
                <span className="ml-auto text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5 flex items-center gap-0.5">
                  VERIFIED <ExternalLink size={7} />
                </span>
              </div>
              <p className="text-base font-semibold mb-4 leading-snug">{best.caption}</p>
              <div className="flex items-end gap-6">
                <div>
                  <div className="text-3xl font-extrabold text-[#D42B3F]">{fmt(best.metrics.views)}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Views</div>
                </div>
                <div className="text-xs text-gray-600 pb-1">
                  Likes / replies / reposts not shown &mdash; X doesn't surface those numbers for
                  this account in a way public search can read, so rather than guess, it's left out.
                </div>
              </div>
            </a>
          );
        })()}

        {/* ---- Other verified examples, for comparison ---- */}
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
          Other Verified Examples (Jul 2026)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...liveFeedTopPosts]
            .sort((a: any, b: any) => (b.metrics.views ?? 0) - (a.metrics.views ?? 0))
            .slice(1)
            .map((post: any, i) => {
              const Icon = PLATFORM_ICON[post.platform];
              return (
                <a
                  key={i}
                  href={post._source?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#151517] border border-white/10 hover:border-white/25 rounded-xl p-4 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={13} className="text-gray-400" />
                    <span className="text-[11px] font-bold text-gray-400">{post.platform}</span>
                    <span className="ml-auto font-extrabold text-sm text-gray-300">{fmt(post.metrics.views)} views</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-snug">{post.caption}</p>
                </a>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub, verified, sourceUrl,
}: { icon: any; label: string; value: string; sub?: string; verified?: boolean; sourceUrl?: string }) {
  return (
    <div className="bg-[#151517] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon size={16} className="text-[#D42B3F]" />
        {verified ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[8px] font-bold text-green-400 bg-green-400/10 hover:bg-green-400/20 rounded px-1.5 py-0.5 flex items-center gap-0.5"
          >
            VERIFIED
          </a>
        ) : (
          <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5">
            PLACEHOLDER
          </span>
        )}
      </div>
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{label}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}
