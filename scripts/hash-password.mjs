#!/usr/bin/env node
// Generates the value to use for one AUTH_USERS entry's hash field. Run
// locally — never paste a real password into chat or commit it anywhere.
//
// Usage: node scripts/hash-password.mjs <password>
// Then build the AUTH_USERS entry yourself: username:<output>:Full Name
//
// The output is base64-encoded bcrypt, not the raw "$2a$12$..." hash.
// Next.js's env loader (dotenv-expand) treats a literal "$2a"/"$12" in an
// env var as a shell-style variable reference and silently blanks it out,
// which corrupts a raw bcrypt hash. Base64 has no "$" in its alphabet, so
// it survives that parsing untouched — lib/auth.ts decodes it back before
// comparing.

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const encoded = Buffer.from(hash).toString("base64");
console.log(encoded);
