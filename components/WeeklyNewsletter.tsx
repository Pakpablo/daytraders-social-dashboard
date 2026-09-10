import { PartyPopper, Coffee, TrendingUp, ShieldAlert, CheckSquare, Ticket, Pin, RefreshCw } from "lucide-react";
import data from "@/data/social-mock-data.json";

export default function WeeklyNewsletter() {
  const n = data.weeklyNewsletter as any;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 md:p-10 max-w-5xl mx-auto">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#D42B3F]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
          <span className="font-extrabold tracking-wide">DAY<span className="text-[#D42B3F]">TRADERS</span></span>
        </div>
        <div className="text-xs text-gray-500">
          INTERNAL &middot; {n.dateRange} &middot; <span className="text-[#D42B3F] font-bold">{n.draftLabel}</span>
        </div>
      </div>
      <div className="h-px bg-white/10 mb-6" />

      <div className="text-[10px] font-bold text-[#D42B3F] tracking-wide mb-1">{n.audience}</div>
      <h1 className="text-3xl font-extrabold mb-2">Weekly Team Briefing</h1>
      <p className="text-gray-400 text-sm mb-6">{n.subtitle}</p>

      {/* ---- Header stats ---- */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 mb-8 bg-[#151517] border border-white/10 rounded-xl p-5">
        {n.headerStats.map((s: any, i: number) => (
          <div key={i} className={`flex-1 ${i > 0 ? "md:border-l border-white/10 md:pl-6" : ""}`}>
            <div className="text-xl font-extrabold">{s.value}</div>
            <div className="text-[11px] text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ---- Row: Shoutout + HeyTaco ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Section num="01" icon={PartyPopper} title="Weekly Shoutout">
          <ul className="space-y-1.5">
            {n.weeklyShoutout.map((s: any, i: number) => (
              <li key={i} className="text-xs text-gray-300 flex gap-2">
                <span className="text-[#D42B3F]">&#9632;</span>
                <span><b>{s.name}</b> &mdash; {s.team} &mdash; {s.reason}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section num="02" icon={Coffee} title="HeyTaco — Top 3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1.5">Received</div>
              {n.heyTaco.received.map((p: any, i: number) => (
                <div key={i} className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>{p.name}</span>
                  <span className="font-mono bg-white/5 rounded px-1.5">{p.count}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1.5">Given</div>
              {n.heyTaco.given.map((p: any, i: number) => (
                <div key={i} className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>{p.name}</span>
                  <span className="font-mono bg-white/5 rounded px-1.5">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* ---- Marketing (full width, red-tinted) ---- */}
      <div className="mb-4">
        <div className="bg-[#1a0f11] border border-[#D42B3F]/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded bg-[#D42B3F] text-white text-[10px] font-bold flex items-center justify-center">03</span>
            <TrendingUp size={14} className="text-[#D42B3F]" />
            <h3 className="font-bold text-sm">Marketing</h3>
          </div>
          <p className="text-[11px] text-gray-500 mb-4">{n.marketing.intro}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <div className="text-xs font-bold text-amber-400 mb-1.5">&#127942; Top Post</div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {n.marketing.topPost.split("Swap in")[0]}
                <i className="text-gray-500">Swap in{n.marketing.topPost.split("Swap in")[1]}</i>
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-200 mb-1.5">&#127919; Current Giveaways</div>
              <ul className="space-y-1">
                {n.marketing.currentGiveaways.map((g: string, i: number) => (
                  <li key={i} className="text-xs text-gray-300">&#9632; {g}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-200 mb-1.5">&#128197; Coming Up</div>
              <ul className="space-y-1">
                {n.marketing.comingUp.map((c: string, i: number) => (
                  <li key={i} className="text-xs text-gray-300">&#9632; {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Row: Support Radar + Core Rules ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Section num="04" icon={ShieldAlert} title="Support & Backend Radar">
          <ul className="space-y-1.5">
            {n.supportBackendRadar.map((item: string, i: number) => (
              <li key={i} className="text-xs text-gray-300">&#9632; {item}</li>
            ))}
          </ul>
        </Section>

        <Section num="05" icon={CheckSquare} title="Core Rules Checklist">
          <ul className="space-y-1.5">
            {n.coreRulesChecklist.map((item: string, i: number) => (
              <li key={i} className="text-xs text-gray-300">&#9632; {item}</li>
            ))}
          </ul>
        </Section>
      </div>

      {/* ---- Row: Recurring Ticket + Reminders ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Section num="06" icon={Ticket} title="Recurring Ticket of the Week">
          <p className="text-xs text-gray-300">
            <b>{n.recurringTicket.title}</b> &mdash; {n.recurringTicket.description}
          </p>
        </Section>

        <Section num="07" icon={Pin} title="Reminders">
          <ul className="space-y-1.5">
            {n.reminders.map((item: string, i: number) => (
              <li key={i} className="text-xs text-gray-300">&#9632; {item}</li>
            ))}
          </ul>
        </Section>
      </div>

      {/* ---- Footer CTA ---- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-6">
        <div>
          <div className="font-bold text-sm flex items-center gap-1.5">
            <RefreshCw size={13} className="text-[#D42B3F]" /> {n.callToAction.prompt}
          </div>
          <p className="text-xs text-gray-500 mt-1">{n.callToAction.instruction}</p>
        </div>
        <button className="bg-[#D42B3F] hover:bg-[#b8202f] rounded-lg px-5 py-3 text-center transition-colors">
          <div className="font-extrabold text-sm">{n.callToAction.buttonText}</div>
          <div className="text-[10px] text-white/80">{n.callToAction.buttonSubtext}</div>
        </button>
      </div>
    </div>
  );
}

function Section({ num, icon: Icon, title, children }: { num: string; icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#151517] border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-5 h-5 rounded bg-[#D42B3F] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{num}</span>
        <Icon size={14} className="text-[#D42B3F]" />
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}
