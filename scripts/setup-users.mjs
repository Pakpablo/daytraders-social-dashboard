#!/usr/bin/env node
/**
 * Run this locally. It asks you for each person's name + password, one at
 * a time, then prints TWO lines at the end - copy both into Vercel.
 * Nothing here gets sent anywhere except printed to your own screen.
 *
 * Usage: node scripts/setup-users.mjs
 *
 * NOTE: the AUTH_USERS value below is base64-encoded per user (not the raw
 * bcrypt hash). Next.js's env loader (dotenv-expand) treats a literal
 * "$2a$12$..." in an env var as a shell-style variable reference and
 * silently blanks it to an empty string, which would corrupt a raw hash.
 * Base64 has no "$" in its alphabet, so it survives untouched -- lib/auth.ts
 * decodes it back before comparing.
 */
import bcrypt from "bcryptjs";
import crypto from "crypto";
import readline from "readline";

const USERNAMES = [
  "pablo", "khayen", "rassel", "rakib", "martin",
  "rafa", "abi", "dj", "leo", "sebastian",
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

async function main() {
  console.log("\nFor each username, enter the person's full name and a password.");
  console.log("(Typing is hidden for nothing here - passwords WILL show on screen as you type,");
  console.log("so make sure nobody's looking over your shoulder / screen-sharing right now.)\n");

  const entries = [];
  for (const username of USERNAMES) {
    console.log(`--- ${username} ---`);
    const name = await ask(`  Full name for "${username}": `);
    const password = await ask(`  Password for "${username}": `);
    const hash = bcrypt.hashSync(password, 10);
    const encodedHash = Buffer.from(hash).toString("base64");
    entries.push(`${username}:${encodedHash}:${name}`);
    console.log("");
  }

  rl.close();

  const authUsers = entries.join(",");
  const sessionSecret = crypto.randomBytes(32).toString("base64");

  console.log("\n============================================================");
  console.log("DONE. Copy these two lines into Vercel:");
  console.log("Project -> Settings -> Environment Variables -> Add New");
  console.log("============================================================\n");
  console.log("Name: SESSION_SECRET");
  console.log("Value:");
  console.log(sessionSecret);
  console.log("\n------------------------------------------------------------\n");
  console.log("Name: AUTH_USERS");
  console.log("Value:");
  console.log(authUsers);
  console.log("\n============================================================");
  console.log("After adding both, redeploy the project for them to take effect.");
}

main();
