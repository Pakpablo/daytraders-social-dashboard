import { Hash, Quote, Sparkles } from "lucide-react";
import data from "@/data/social-mock-data.json";

export default function MarketingIdeas() {
  const ideas = data.marketingChannelIdeas as any[];

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Hash size={18} className="text-[#D42B3F]" />
        <h1 className="text-2xl font-extrabold">marketing-ideas</h1>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Real ideas raised in the team's marketing channel, credited to whoever brought them up.
      </p>

      <div className="space-y-4">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-[#151517] border border-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-bold text-base">{idea.title}</h3>
              <div className="flex gap-1 shrink-0">
                {idea.submittedBy.map((name: string) => (
                  <span key={name} className="text-[9px] font-bold text-[#D42B3F] bg-[#D42B3F]/10 rounded-full px-2 py-1">
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <Quote size={13} className="text-gray-600 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300 italic leading-relaxed">{idea.quote}</p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-2">{idea.context}</p>

            <span className="inline-block text-[9px] font-semibold text-gray-500 bg-white/5 rounded px-2 py-0.5">
              Source: {idea.source}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-600">
        <Sparkles size={11} className="text-amber-400" />
        Ideas here that have matching AI-generated content drafts are marked "From #marketing-ideas" in the Content Idea Generator below.
      </div>
    </div>
  );
}
