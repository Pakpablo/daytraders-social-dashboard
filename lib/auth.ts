import { SignJWT, jwtVerify } from "jose";
import { kv } from "@vercel/kv";

/**
 * AUTH SETUP
 * ==========
 * 1. Set SESSION_SECRET in your Vercel env vars — any long random string
 *    (e.g. run: openssl rand -base64 32)
 * 2. Set AUTH_USERS in your Vercel env vars, format:
 *    username1:bcryptHash1:Full Name 1,username2:bcryptHash2:Full Name 2
 *    Generate each bcryptHash by running scripts/hash-password.mjs locally
 *    with the real password — passwords are never stored in plaintext,
 *    and nobody (including Claude) ever sees or invents them.
 * 3. Add the Vercel KV integration to this project (Storage tab in the
 *    Vercel dashboard -> Create Database -> KV) — this is where login
 *    history is stored. Vercel wires the required env vars automatically
 *    once connected.
 */

const SESSION_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET ?? "");
const SESSION_COOKIE = "dt_session";
const SESSION_TTL_HOURS = 12;

export interface SessionPayload {
  username: string;
  name: string;
  iat: number;
}

function parseUsers(): { username: string; hash: string; name: string }[] {
  const raw = process.env.AUTH_USERS ?? "";
  return raw
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [username, hash, name] = entry.split(":");
      return { username, hash, name: name ?? username };
    });
}

export function findUser(username: string) {
  return parseUsers().find((u) => u.username === username);
}

export async function createSessionToken(payload: { username: string; name: string }): Promise<string> {
  return new SignJWT({ username: payload.username, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_HOURS}h`)
    .sign(SESSION_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null; // expired, tampered, or missing
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/**
 * Pulls the real client IP on Vercel. x-forwarded-for can contain a list
 * ("client, proxy1, proxy2") — the first entry is the real client.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export interface LoginLogEntry {
  username: string;
  name: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
}

const LOG_KEY = "login_log";
const MAX_LOG_ENTRIES = 2000; // keep the log from growing unbounded

export async function recordLogin(entry: LoginLogEntry) {
  await kv.lpush(LOG_KEY, JSON.stringify(entry));
  await kv.ltrim(LOG_KEY, 0, MAX_LOG_ENTRIES - 1);
}

export async function getLoginLog(limit = 200): Promise<LoginLogEntry[]> {
  const raw = await kv.lrange(LOG_KEY, 0, limit - 1);
  return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
}
