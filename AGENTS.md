# AGENTS.md — Codex Working Agreement

> Read this file fully before doing anything. Then read CLAUDE.md, then PRD.md.

---

## Project in 3 Sentences

Köpenick Kiezradar is a hyperlocal monitoring tool for Berlin-Köpenick, built by two neighbors without programming experience. It aggregates public announcements, summarizes them via Claude API, and displays them in a mobile-friendly feed. Full briefing in `PRD.md`.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Package manager | pnpm |
| Hosting | Vercel |
| Data | JSON files in `/data/` (git-committed) |
| AI enrichment | Claude API (`claude-sonnet-4-5`) |
| Cron | GitHub Actions (Iteration 2+) |

---

## Setup

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build check
```

---

## Repository Layout

```
/app                    Next.js App Router pages
  layout.tsx            Root layout, fonts, metadata
  page.tsx              Feed (/)
  woche/page.tsx        Weekly overview (/woche)
/components             UI components (domain-sorted, not type-sorted)
  EntryCard.tsx
  TagFilter.tsx
  Header.tsx
  DisclaimerBanner.tsx
  WeeklyView.tsx
  Footer.tsx
/lib
  types.ts              Entry interface, Tag type, constants
/data
  entries.json          Mock data now; real data in Iteration 2+
/prototype
  koepenick-radar-v0.jsx   Design reference only — do not modify
/scripts                Ingestion script (Iteration 2)
/.github/workflows      Daily cron (Iteration 2)
```

---

## Data Model

```typescript
interface Entry {
  id: string;
  source: string;
  source_url: string;
  title: string;
  published_at: string;       // ISO 8601
  ingested_at: string;        // ISO 8601
  ai_summary: string;         // 1–3 sentences
  tags: Tag[];                // see Tag type in lib/types.ts
  location: string;
  local_relevance_score: number;      // 0–1
  political_relevance_score: number;  // 0–1
  election_relevant: boolean;
  election_topic?: string;
  ai_reasoning: string;
  is_mock?: boolean;
}

type Tag = "verkehr" | "sicherheit" | "verwaltung" | "politik" | "infrastruktur" | "sonstiges";
```

---

## Design System

CSS variables defined in `app/globals.css`:

```
--bg: #f4ede0          (page background)
--bg-card: #faf6ec     (card background)
--water-deep: #1f4e6b  (primary accent, headers, active states)
--water-mid: #3a7396   (links, secondary accent)
--water-light: #c9dde6 (subtle fills)
--forest: #4a6b3a      (stats accent)
--ink: #1a2933         (primary text)
--ink-soft: #4a5a64    (secondary text, captions)
--brick: #9c4a2e       (election badge only)
--border: #e0d6c2      (card borders, dividers)
```

Fonts: `var(--font-fraunces)` for headings, `var(--font-inter-tight)` for body.
Use CSS variables, not hardcoded hex. Use Tailwind classes where possible.

---

## Coding Rules

- TypeScript strict — no `any`
- Functional React components only, no classes
- `kebab-case` for file names, `PascalCase` for component names
- Tailwind for layout/spacing, CSS variables for colors
- No inline styles except where Tailwind can't express a CSS variable value
- `async/await`, not `.then()` chains
- No unnecessary dependencies — check if a need is already covered first
- Server components by default; add `"use client"` only when needed (state, events)

---

## What NOT to Touch Without Discussion

- `PRD.md` — product decisions only via PR with discussion
- `README.md` disclaimer section — keep it, always
- `prototype/koepenick-radar-v0.jsx` — read-only design reference
- `.github/workflows/daily-ingest.yml` — critical path, change carefully (Iteration 2+)

## Current Iteration

**Iteration 1** — clickable prototype with mock data. No real data import yet.
See `PRD.md §11 Roadmap` for what's next.

---

## Anti-Goals

- No login / accounts
- No newsletter / email
- No map view
- No search (later)
- No app store app
- No partisan political judgement
- No database yet (JSON files are fine until 500+ entries)
