"use client";

import { useEffect, useRef } from "react";

/**
 * Drop this into the shared layout (alongside <UserBadge />), once, so it
 * runs on every authenticated page. It has no visible UI - it just watches
 * for activity and force-logs-out after IDLE_TIMEOUT_MS of silence.
 *
 * This is separate from the 12-hour absolute session cap in lib/auth.ts -
 * that one fires no matter what; this one fires specifically because
 * nobody's touched the page, which is the "walked away from my desk" case.
 */

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes - change this one number to adjust

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

export default function IdleTimeout() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function logoutForInactivity() {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login?reason=idle";
    }

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logoutForInactivity, IDLE_TIMEOUT_MS);
    }

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer(); // start counting as soon as the page loads

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
