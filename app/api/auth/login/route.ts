import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUser, createSessionToken, recordLogin, getClientIp, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const ip = getClientIp(req.headers);
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const user = username ? findUser(username) : undefined;
  const validPassword = user ? await bcrypt.compare(password ?? "", user.hash) : false;

  // Log every attempt, success or failure — that's the point of an access log.
  await recordLogin({
    username: username ?? "(blank)",
    name: user?.name ?? username ?? "(unknown)",
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    success: Boolean(user && validPassword),
  });

  if (!user || !validPassword) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const token = await createSessionToken({ username: user.username, name: user.name });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours, matches SESSION_TTL_HOURS in lib/auth.ts
  });
  return res;
}
