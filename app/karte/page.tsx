"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useMemo } from "react";
import type { Tag } from "@/lib/types";
import { TAG_LABELS, ALL_TAGS } from "@/lib/types";
import entriesData from "@/data/entries.json";
import type { Entry } from "@/lib/types";

const KiezMap = dynamic(() => import("@/components/KiezMap"), { ssr: false });

const allEntries = entriesData as Entry[];
const hasRealData = allEntries.some((e) => !e.is_mock);
const entries = hasRealData ? allEntries.filter((e) => !e.is_mock) : allEntries;
const mappable = entries.filter((e) => e.lat != null && e.lng != null);

export default function KartePage() {
  const [activeTags, setActiveTags] = useState<Tag[]>([]);

  const toggle = (tag: Tag) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const filtered = useMemo(
    () =>
      mappable.filter(
        (e) => activeTags.length === 0 || e.tags.some((t) => activeTags.includes(t))
      ),
    [activeTags]
  );

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--bg)" }}>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-baseline gap-3">
          <Link href="/" className="text-xs" style={{ color: "var(--water-mid)" }}>
            ← Feed
          </Link>
          <h1
            className="text-lg"
            style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, color: "var(--water-deep)" }}
          >
            Karte
          </h1>
          <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
            {filtered.length} Einträge mit Koordinaten
          </span>
        </div>
        <Link href="/woche" className="text-xs" style={{ color: "var(--water-mid)" }}>
          Diese Woche →
        </Link>
      </div>

      {/* Tag filter */}
      <div className="px-5 py-2 shrink-0 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex gap-2 overflow-x-auto flex-1 min-w-0 pb-1" style={{ scrollbarWidth: "none" }}>
          {ALL_TAGS.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className="px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all duration-100"
                style={
                  active
                    ? { background: "var(--water-deep)", border: "1px solid var(--water-deep)", color: "var(--bg)" }
                    : { background: "transparent", border: "1px solid var(--border)", color: "var(--ink-soft)" }
                }
              >
                {TAG_LABELS[tag]}
              </button>
            );
          })}
        </div>
        {activeTags.length > 0 && (
          <button
            onClick={() => setActiveTags([])}
            className="text-xs px-2 py-1 rounded shrink-0"
            style={{ color: "var(--ink-soft)", opacity: 0.7 }}
          >
            ✕ zurücksetzen
          </button>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 p-4">
        {filtered.length === 0 ? (
          <div
            className="h-full flex flex-col items-center justify-center gap-3 rounded-xl"
            style={{ border: "1px dashed var(--border)", color: "var(--ink-soft)" }}
          >
            <p className="text-sm">
              {mappable.length === 0
                ? "Noch keine Einträge mit Koordinaten — wird beim nächsten Ingest befüllt."
                : "Keine Einträge mit diesen Filtern auf der Karte."}
            </p>
            {mappable.length === 0 && (
              <Link href="/admin" className="text-xs" style={{ color: "var(--water-mid)" }}>
                Ingest starten →
              </Link>
            )}
          </div>
        ) : (
          <KiezMap entries={filtered} />
        )}
      </div>
    </div>
  );
}
