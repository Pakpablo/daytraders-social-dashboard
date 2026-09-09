import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavTabs from "@/components/NavTabs";
import UserBadge from "@/components/UserBadge";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DayTraders Social Dashboard",
  description:
    "Social audit, trend radar, content ideas, and competitor benchmark for DayTraders.com's social channels.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-[#0B0B0D] antialiased`}
    >
      <body className="bg-[#0B0B0D] text-white">
        <NavTabs>
          <UserBadge />
        </NavTabs>
        {children}
      </body>
    </html>
  );
}
