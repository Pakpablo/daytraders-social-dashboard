import { SignJWT, jwtVerify } from "jose";
import { kv } from "@vercel/kv";

/**
 * AUTH SETUP
 * ==========
 * 1. Set SESSION_SECRET in your Vercel env vars — any long random string
 *    (e.g. run: openssl rand -base64 32)
 * 2. Set AUTH_USERS in your Vercel env vars, format:
 *    username1:base64Hash1:Full Name 1,username2:base64Hash2:Full Name 2
 *    Generate each base64Hash by running scripts/hash-password.mjs locally
 *    with the real password — passwords are never stored in plaintext,
 *    and nobody (including Claude) ever sees or invents them.
 *
 *    IMPORTANT: the script outputs the bcrypt hash BASE64-ENCODED, not the
 *    raw hash. Store the base64 form, not the raw "$2a$12$..." string —
 *    Next.js's env loader (dotenv-expand) treats a literal "$2a" / "$12" in
 *    an env var as a shell-style variable reference and silently replaces
 *    it with an empty string, which corrupts a raw bcrypt hash. Base64
 *    encoding sidesteps this entirely (no `$` in its alphabet).
 * 3. Add the Vercel KV integration to this project (Storage tab in the
 *    Vercel dashboard -> Create Database -> KV) — this is where login
 *    history is stored. Vercel wires the required env vars automatically
 *    once connected. NOTE: Vercel KV is deprecated as of late 2025 — if
 *    "KV" isn't offered under Storage anymore, look for a Redis option
 *    under Marketplace Database Providers (Upstash) instead, and confirm
 *    it sets KV_REST_API_URL / KV_REST_API_TOKEN (the vars this file's
 *    @vercel/kv client expects) — Vercel's Redis marketplace integration
 *    generally does, for @vercel/kv backward-compatibility, but verify.
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
      const [username, encodedHash, name] = entry.split(":");
      // The hash is stored base64-encoded (see AUTH SETUP above) so that a
      // raw bcrypt hash's "$2a$12$..." never touches env-var parsing.
      const hash = encodedHash ? Buffer.from(encodedHash, "base64").toString("utf-8") : "";
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
  // Best-effort audit log — never let a KV outage or missing config block
  // an otherwise-valid login. Errors here are logged, not thrown.
  try {
    await kv.lpush(LOG_KEY, JSON.stringify(entry));
    await kv.ltrim(LOG_KEY, 0, MAX_LOG_ENTRIES - 1);
  } catch (err) {
    console.error("recordLogin: failed to write to KV", err);
  }
}

export async function getLoginLog(limit = 200): Promise<LoginLogEntry[]> {
  try {
    const raw = await kv.lrange(LOG_KEY, 0, limit - 1);
    return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
  } catch (err) {
    console.error("getLoginLog: failed to read from KV", err);
    return [];
  }
}
