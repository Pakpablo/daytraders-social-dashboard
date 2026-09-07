"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/overview", label: "Overview" },
  { href: "/this-week", label: "This Week" },
  { href: "/followers", label: "Growth" },
  { href: "/performance", label: "Performance" },
  { href: "/trends", label: "Trend Radar" },
  { href: "/ideas", label: "Content Ideas" },
  { href: "/competitors", label: "Competitors" },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 bg-[#0B0B0D]">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "border-[#D42B3F] text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
