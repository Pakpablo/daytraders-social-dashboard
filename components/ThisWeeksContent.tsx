import { CalendarDays, ExternalLink } from "lucide-react";
import data from "@/data/social-mock-data.json";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Approved: { bg: "#dcfce7", color: "#166534" },
  "Under Review": { bg: "#fef3c7", color: "#92400e" },
  Unlisted: { bg: "#f1f1f1", color: "#666" },
};

const CATEGORY_COLOR: Record<string, string> = {
  "Bulk Pricing Promo": "#D42B3F",
  "Company News": "#2563EB",
  Humorous: "#EA580C",
  "Education / Promo": "#D42B3F",
  Inspirational: "#7C3AED",
  "Education / Engagement": "#059669",
};

export default function ThisWeeksContent() {
  const { weekOf, summary, posts } = data.thisWeeksContent as any;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <CalendarDays size={22} className="text-[#D42B3F]" /> This Week's Content
        </h1>
        <p className="text-gray-400 text-sm mt-1">Week of {weekOf} &middot; short version &mdash; full copy and assets live in the content doc</p>
      </div>

      {/* ---- Short summary ---- */}
      <div className="bg-[#151517] border border-[#D42B3F]/30 rounded-xl p-4">
        <div className="text-[10px] font-bold uppercase tracking-wide text-[#D42B3F] mb-2">Summary</div>
        <p className="text-sm text-gray-200 leading-relaxed">{summary}</p>
      </div>

      {/* ---- Day-by-day list ---- */}
      <div className="space-y-2">
        {posts.map((p: any, i: number) => {
          const statusStyle = STATUS_STYLE[p.status] ?? STATUS_STYLE.Unlisted;
          const catColor = CATEGORY_COLOR[p.category] ?? "#999";
          return (
            <div key={i} className="bg-[#151517] border border-white/10 rounded-lg p-3.5">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="font-bold text-sm w-28 shrink-0">{p.day}</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-wide rounded px-2 py-0.5"
                  style={{ background: `${catColor}20`, color: catColor }}
                >
                  {p.category}
                </span>
                <span className="text-[10px] text-gray-500">{p.format}</span>
                <span
                  className="ml-auto text-[9px] font-bold rounded px-2 py-0.5"
                  style={{ background: statusStyle.bg, color: statusStyle.color }}
                >
                  {p.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{p.gist}</p>
              {(p.designer || p.reviewer) && (
                <div className="text-[10px] text-gray-600 mt-2">
                  {p.designer && <>Designer: {p.designer}</>}
                  {p.designer && p.reviewer && " · "}
                  {p.reviewer && <>Reviewer: {p.reviewer}</>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-gray-600 flex items-center gap-1">
        <ExternalLink size={10} /> Full captions, hashtags, and creative assets live in the team's Weekly Content Calendar doc, not duplicated here.
      </div>
    </div>
  );
}
