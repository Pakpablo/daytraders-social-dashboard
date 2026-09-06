# DayTraders Social Dashboard

Internal dashboard for DayTraders.com's social channels — Instagram, X, YouTube, TikTok, LinkedIn — covering channel performance, a weekly trend radar, an AI content-idea generator, and a competitor benchmark.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react. No backend yet — data is static JSON read at build time.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Data

`data/social-mock-data.json` is **placeholder data for UI development only** — see its `_readme` field. To go live, replace it with data pulled from:

- Meta Graph API (Instagram)
- X API v2
- YouTube Data API v3
- TikTok for Business API
- LinkedIn Marketing API

The `competitorBenchmark` section names real public prop-firm brands worth tracking, but the example posts under them are illustrative templates, not verified reporting — swap in a real social-listening tool (e.g. Sprout Social, Brandwatch, Social Blade) for real competitor data.

## Pages

- `/overview` — stat cards, per-channel breakdown, live feed of top-performing posts
- `/trends` — active/emerging trends and trending formats
- `/ideas` — AI content idea generator (currently static mock ideas)
- `/competitors` — competitor and industry benchmark

## Deploy

Zero-config on [Vercel](https://vercel.com/new) — connect the repo and deploy, or run `vercel` from this directory.
