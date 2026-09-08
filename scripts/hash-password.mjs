#!/usr/bin/env node
// Generates a bcrypt hash for one AUTH_USERS entry. Run locally — never
// paste a real password into chat or commit it anywhere.
//
// Usage: node scripts/hash-password.mjs <password>
// Then build the AUTH_USERS entry yourself: username:<hash>:Full Name

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(hash);
