import { Binoculars, ExternalLink, HelpCircle, ClipboardCheck } from "lucide-react";
import data from "@/data/social-mock-data.json";

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}

const RATING_STYLE: Record<string, { bg: string; color: string }> = {
  Optimized: { bg: "#dcfce7", color: "#166534" },
  Emerging: { bg: "#fef3c7", color: "#92400e" },
  Opportunity: { bg: "#fee2e2", color: "#991b1b" },
};

export default function CompetitorBenchmark() {
  const { verified, unverifiedButRealCompetitors, abiScorecard } = data.competitorBenchmark as any;
  const ratingStyle = RATING_STYLE[abiScorecard.exampleFinding.rating] ?? RATING_STYLE.Emerging;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Binoculars size={22} className="text-[#D42B3F]" /> Competitors &amp; Positioning
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          How we compare on social reach, and how our own homepage benchmarks against best-practice standards.
        </p>
      </div>

      {/* ================= PART 1: Social follower benchmark ================= */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Social Follower Benchmark</h2>
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

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={14} className="text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Confirmed Real Competitors &mdash; Numbers Not Yet Verified
            </h3>
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

        <div className="text-[10px] text-gray-600 italic mt-3">
          Only Instagram was researched for the verified list above &mdash; other platforms and
          competitors likely rank differently. Treat this as a first pass, not a complete benchmark.
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* ================= PART 2: Abi's homepage audit (positioning, not social) ================= */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ClipboardCheck size={16} className="text-[#D42B3F]" />
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Homepage Positioning Audit
          </h2>
          <span className="text-[8px] font-bold text-[#D42B3F] border border-[#D42B3F] rounded px-1.5 py-0.5">
            {abiScorecard.owner.toUpperCase()}
          </span>
        </div>
        <p className="text-[10px] text-gray-600 mb-4 leading-relaxed">{abiScorecard._readme}</p>

        <div className="bg-[#151517] border border-white/10 rounded-xl p-4 mb-3">
          <div className="text-xs font-bold text-gray-300 mb-1">Methodology</div>
          <p className="text-xs text-gray-400 leading-relaxed">{abiScorecard.methodology}</p>
        </div>

        <div className="bg-[#151517] border border-white/10 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-gray-300 flex-1">Example Finding: {abiScorecard.exampleFinding.area}</span>
            <span
              className="text-[9px] font-bold rounded px-2 py-0.5"
              style={{ background: ratingStyle.bg, color: ratingStyle.color }}
            >
              {abiScorecard.exampleFinding.rating.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-2">{abiScorecard.exampleFinding.finding}</p>
          <p className="text-xs text-gray-300 leading-relaxed">
            <span className="font-bold text-gray-500 uppercase text-[9px] tracking-wide">Recommendation: </span>
            {abiScorecard.exampleFinding.recommendation}
          </p>
        </div>

        <div className="bg-[#D42B3F]/10 border border-[#D42B3F]/30 rounded-xl p-4">
          <div className="text-xs font-bold text-[#D42B3F] mb-1">Proposal</div>
          <p className="text-xs text-gray-300 leading-relaxed">{abiScorecard.proposal}</p>
        </div>
      </div>
    </div>
  );
}
