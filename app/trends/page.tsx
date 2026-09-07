import TrendRadar from "@/components/TrendRadar";
import ContentIdeaGenerator from "@/components/ContentIdeaGenerator";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 space-y-10">
      <TrendRadar />
      <div className="border-t border-white/10" />
      <ContentIdeaGenerator />
    </div>
  );
}
