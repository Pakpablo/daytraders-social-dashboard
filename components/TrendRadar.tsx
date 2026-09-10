import { Radar, Sparkles, Clapperboard, Globe2, ExternalLink } from "lucide-react";
import data from "@/data/social-mock-data.json";

export default function TrendRadar() {
  const { activeTrends, emergingTrends, trendingFormatsAndAudio, beyondTrading } = data.trendRadar as any;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Weekly Trend Radar</h1>
        <p className="text-gray-400 text-sm mt-1">Macro trends across social — trading-specific and beyond, updated weekly.</p>
      </div>

      <TrendSection icon={Radar} title="Current Active Trends" items={activeTrends} color="#D42B3F" />
      <TrendSection icon={Sparkles} title="Emerging Trends to Watch" items={emergingTrends} color="#2563EB" />
      <TrendSection icon={Clapperboard} title="Trending Formats & Audio" items={trendingFormatsAndAudio} color="#059669" />
      <TrendSection icon={Globe2} title="Pop Culture Right Now — Not Trading-Related" items={beyondTrading} color="#7C3AED" />
    </div>
  );
}

function TrendSection({
  icon: Icon, title, items, color,
}: { icon: any; title: string; items: { name: string; description: string; exampleLink?: string | null }[]; color: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} style={{ color }} />
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-300">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.name} className="bg-[#151517] border rounded-xl p-4" style={{ borderColor: `${color}33` }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="font-bold text-sm" style={{ color }}>{item.name}</div>
              {item.exampleLink ? (
                <span className="text-[8px] font-bold text-green-400 bg-green-400/10 rounded px-1.5 py-0.5 shrink-0">
                  REAL EXAMPLE
                </span>
              ) : (
                <span className="text-[8px] font-bold text-amber-400 bg-amber-400/10 rounded px-1.5 py-0.5 shrink-0">
                  PATTERN, UNLINKED
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">{item.description}</p>
            {item.exampleLink && (
              <a
                href={item.exampleLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-300 hover:text-white bg-white/5 rounded px-2 py-1"
              >
                <ExternalLink size={10} /> See real example
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
