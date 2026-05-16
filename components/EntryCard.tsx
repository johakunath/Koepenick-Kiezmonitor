"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { Entry, Tag } from "@/lib/types";
import { slugify } from "@/lib/slug";
import { TAG_LABELS } from "@/lib/types";
import RelevanceWaves from "@/components/RelevanceWaves";

const TAG_ACCENT: Partial<Record<Tag, string>> = {
  wahl:          "var(--brick)",
  politik:       "var(--brick)",
  verkehr:       "var(--water-mid)",
  infrastruktur: "var(--water-mid)",
  verwaltung:    "var(--ink-soft)",
  sicherheit:    "#a05020",
  veranstaltung: "var(--forest)",
  sonstiges:     "var(--sand)",
};

function timeAgo(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const hours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "gerade eben";
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days > 1 ? "en" : ""}`;
}

function formatEventDate(iso?: string): string | null {
  if (!iso) return null;

  return new Date(iso).toLocaleString("de-DE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface EntryCardProps {
  entry: Entry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  const eventDate = formatEventDate(entry.event_start_at);
  const detailHref = `/eintrag/${entry.slug ?? slugify(entry.title)}`;
  const accentColor = TAG_ACCENT[entry.tags[0]] ?? "var(--border)";

  return (
    <article
      className="relative p-6 transition-all duration-150 hover:-translate-y-px"
      style={{
        borderRadius: 12,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: `3px solid ${accentColor}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--water-mid)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 16px -8px rgba(31, 78, 107, 0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {entry.is_mock && (
        <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-700">
          Demo
        </span>
      )}

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {entry.tags.map((tag: Tag) => (
          <span
            key={tag}
            className="rounded-full px-2 py-0.5"
            style={{
              color: "var(--water-deep)",
              background: "rgba(31, 78, 107, 0.07)",
              border: "1px solid rgba(31, 78, 107, 0.14)",
              fontSize: "10.5px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {TAG_LABELS[tag]}
          </span>
        ))}
      </div>

      <h2
        className="text-xl leading-snug mb-2"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
        }}
      >
        <Link href={detailHref} className="hover:underline">
          {entry.title}
        </Link>
      </h2>

      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink-soft)" }}>
        {entry.ai_summary}
      </p>

      {eventDate && (
        <div
          className="flex flex-wrap items-center gap-3 text-xs mb-4 px-3 py-2 rounded"
          style={{
            background: "rgba(74, 107, 58, 0.08)",
            border: "1px solid rgba(74, 107, 58, 0.18)",
            color: "var(--forest)",
          }}
        >
          <span className="flex items-center gap-1">
            <CalendarDays size={12} />
            {eventDate}
          </span>
          {entry.venue && <span>{entry.venue}</span>}
        </div>
      )}

      {entry.pdf_excerpt && entry.document_type === "pdf" && (
        <div
          className="text-xs mb-4 px-3 py-2 rounded leading-relaxed"
          style={{
            background: "rgba(31, 78, 107, 0.06)",
            border: "1px solid rgba(31, 78, 107, 0.14)",
            color: "var(--ink-soft)",
            fontStyle: "italic",
          }}
        >
          <span style={{ color: "var(--water-deep)", fontStyle: "normal", fontWeight: 500 }}>
            Auszug S. {entry.pdf_page}:{" "}
          </span>
          {entry.pdf_excerpt}
        </div>
      )}

      <div
        className="flex items-center justify-between gap-3 pt-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--ink-soft)" }}>
          <RelevanceWaves score={entry.local_relevance_score} />
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {entry.location}
          </span>
          <span>{timeAgo(entry.published_at)}</span>
        </div>
        <a
          href={entry.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: "var(--water-mid)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--water-deep)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--water-mid)")
          }
        >
          {entry.source}
          <ArrowUpRight size={12} />
        </a>
      </div>

    </article>
  );
}
