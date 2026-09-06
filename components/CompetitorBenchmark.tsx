import { Binoculars, ExternalLink, HelpCircle } from "lucide-react";
import data from "@/data/social-mock-data.json";

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

export default function CompetitorBenchmark() {
  const { verified, unverifiedButRealCompetitors } = data.competitorBenchmark as any;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Binoculars size={22} className="text-[#D42B3F]" /> Competitor &amp; Industry Benchmark
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Ranked by real, verified Instagram follower counts (Aug 2026 research pass).
        </p>
      </div>

      {/* ---- Verified ranked list ---- */}
      <div className="space-y-3">
        {verified.map((c: any) => (
          <a
            key={c.firm}
            href={c.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 bg-[#151517] border border-white/10 hover:border-[#D42B3F]/50 rounded-xl p-4 transition-colors"
          >
            <div className="text-2xl font-extrabold text-gray-600 w-8">#{c.rank}</div>
            <div className="flex-1">
              <div className="font-bold text-sm flex items-center gap-1.5">
                {c.firm}
                <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5 flex items-center gap-0.5">
                  VERIFIED <ExternalLink size={7} />
                </span>
              </div>
              <div className="text-xs text-gray-500">{c.platform} &middot; {c.handle}</div>
              <div className="text-[11px] text-gray-400 mt-1 leading-relaxed">{c.sourceNote}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-extrabold text-lg text-[#D42B3F]">{fmt(c.followers)}</div>
              <div className="text-[9px] text-gray-500">FOLLOWERS</div>
            </div>
          </a>
        ))}
      </div>

      {/* ---- Honest unverified list ---- */}
      <div>
        <div className="flex items-center gap-2 mb-2 mt-6">
          <HelpCircle size={14} className="text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Confirmed Real Competitors &mdash; Numbers Not Yet Verified
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {unverifiedButRealCompetitors.map((c: any) => (
            <div key={c.firm} className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
              <div className="font-bold text-sm flex items-center gap-1.5">
                {c.firm}
                <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5">
                  UNVERIFIED
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">{c.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[10px] text-gray-600 italic">
        Only Instagram was researched for the verified list above &mdash; other platforms and
        competitors likely rank differently. Treat this as a first pass, not a complete benchmark.
      </div>
    </div>
  );
}
