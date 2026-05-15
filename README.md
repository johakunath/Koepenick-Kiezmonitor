# Köpenick Kiezradar

> Hyperlokales Monitoring-Tool für Berlin-Köpenick. Aggregiert öffentliche Meldungen, Termine und Dokumente aus öffentlichen Quellen, fasst sie per KI zusammen und macht lokale Relevanz sichtbar.

## Status

🟡 **Experimentelles Privatprojekt zweier Nachbarn.** Vibe-coded mit Claude Code / Codex.

Stand 16.05.2026: Die App ist live auf Vercel unter https://koepenick-kiezradar.vercel.app/. `main` enthält Feed, Wochenüberblick, Karte, Admin-Trigger, RSS-Feed, echte Archivdaten, Ingestion-Status, erste Quellenpipeline und neue Radar-Struktur mit Themen, Orten, Terminen, Quellen und internen Detailseiten. PR #14 ergänzt robuste Mehrfach-Tags pro Eintrag.

## Disclaimer

Dieses Tool ist ein privates Lern- und Experimentierprojekt. Es ist **nicht** zur offiziellen oder allgemeinen Verwendung gedacht. Alle Inhalte können KI-generiert, unvollständig oder falsch sein. Maßgeblich sind ausschließlich die jeweils verlinkten Originalquellen.

Das Tool verlinkt auf öffentlich zugängliche Informationen und stellt keine eigenständige journalistische Leistung dar. Für die Inhalte verlinkter Seiten übernehmen wir keine Verantwortung.

## Quick Start

```bash
pnpm install
pnpm dev
pnpm build
pnpm test:parsers
```

## Daten neu ziehen

```bash
pnpm ingest:dry        # Live-Quellen testen, ohne KI und ohne entries.json zu schreiben
GEMINI_API_KEY=xxx pnpm ingest
pnpm weekly-digest
```

`pnpm ingest` nutzt `GEMINI_API_KEY` für Enrichment. In Produktion läuft der Import über `.github/workflows/daily-ingest.yml` und committet nur, wenn sich Daten ändern.

Das Gemini-Enrichment soll pro Eintrag 1-5 Tags vergeben. Zusätzlich normalisiert die App Tags beim Lesen: Quelle, Veranstaltungsdatum, Wahlbezug und Textsignale können weitere Tags ergänzen. Dadurch kann ein Eintrag z. B. zugleich `verwaltung` und `veranstaltung` sein.

## Datenhaltung

Vorerst keine Datenbank:

- `data/entries.json` hält den aktiven Feed.
- `data/archive/YYYY-MM.json` hält Monatsarchive.
- `data/weekly/YYYY-Www.json` hält Wochenfazits.
- `data/topics.json`, `data/districts.json`, `data/sources.json`, `data/meetings.json`, `data/documents.json` liefern die Radar-Navigation.
- `data/ingest-status.json` zeigt den letzten Quellenlauf.

Einträge nutzen `tags: Tag[]` als Mehrfach-Tags. Ein altes einzelnes `tag`-Feld wird nur noch als Legacy-Fallback akzeptiert und beim Lesen in `tags` überführt.

Eine Datenbank kommt erst bei größerem Archiv, echter Volltextsuche, Admin-Korrektur-UI oder langsamen Builds in Frage.

## Aufbau

```text
/app                    Next.js App Router, Seiten und API-Route
/components             UI-Komponenten
/data                   JSON-Daten, Archiv, Wochenfazits, Quellenmetadaten
/lib                    Typen, Datenzugriff, Geo-Helfer
/scripts                Ingestion, Wochen-Digest, Parser-Smoke-Tests
/.github/workflows      Daily- und Weekly-Automation
```

## Wichtige Routen

- `/` Feed mit Tag-/Ortsfilter und Search-Lite
- `/eintrag/[slug]` interne Detailseiten
- `/themen`, `/thema/[slug]`
- `/orte`
- `/termine`, `/termin/[slug]`
- `/karte`
- `/woche`
- `/quellen`
- `/admin`
- `/feed.xml`

## Datenquellen

- Polizei Berlin Meldungen: https://www.berlin.de/polizei/polizeimeldungen/
- Berlin.de Veranstaltungskalender Treptow-Köpenick: https://www.berlin.de/land/kalender/index.php?c=13&suchmaske=
- Bezirksamt Treptow-Köpenick Pressemitteilungen
- BVV / politische Dokumente als experimentelle Quelle
- VIZ Berlin und Amtsblatt sind vorbereitet, aber aktuell fehleranfällig und werden defensiv behandelt.

## Nächster Datenqualitäts-Schritt

Mehrfach-Tags lösen noch keine Duplikate. Wenn dieselbe reale Meldung aus zwei Quellen kommt, z. B. Bezirksamt + Veranstaltungskalender, soll ein nächster PR kanonische Einträge, `duplicate_of`/`canonical_id` und mehrere Quellenlinks pro Detailseite einführen.

## Lizenz

Privater, nicht öffentlich nutzbarer Code. Kein Re-use erlaubt.
