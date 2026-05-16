import Link from "next/link";
import RadarNav from "@/components/RadarNav";

interface HeaderProps {
  count: number;
  electionCount?: number;
}

function daysToElection(): number {
  const election = new Date("2026-09-20T00:00:00+02:00");
  return Math.max(0, Math.ceil((election.getTime() - Date.now()) / 86400000));
}

function WaveLogo() {
  return (
    <svg width="22" height="18" viewBox="0 0 28 24" fill="none" aria-hidden="true">
      <path d="M2 14 Q 7 9 12 14 T 22 14 T 30 14" stroke="var(--water-deep)" strokeWidth="1.8" fill="none" />
      <path d="M2 19 Q 7 14 12 19 T 22 19 T 30 19" stroke="var(--water-mid)" strokeWidth="1.8" fill="none" opacity="0.55" />
    </svg>
  );
}

export default function Header({ count, electionCount = 0 }: HeaderProps) {
  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
  const days = daysToElection();

  return (
    <header className="px-5 pt-5 pb-2" style={{ position: "relative", overflow: "hidden" }}>

      {/* Illustration watermark — castle end of the banner, faint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "62%",
          opacity: 0.065,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <svg
          height="100%"
          viewBox="0 0 1200 120"
          preserveAspectRatio="xMaxYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#143d56" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 82 C180 72, 300 92, 440 82 S700 72, 860 82 S1080 92, 1160 80" opacity="0.28" />
            <g transform="translate(120 12)">
              <path d="M0 78 C6 52 -4 38 4 12" />
              <path d="M18 78 C24 54 14 36 22 8" />
              <path d="M36 78 C42 50 30 32 40 10" />
              <ellipse cx="4" cy="10" rx="3" ry="9" fill="#143d56" fillOpacity="0.08" />
              <ellipse cx="22" cy="7" rx="3" ry="10" fill="#143d56" fillOpacity="0.08" />
              <ellipse cx="40" cy="9" rx="3" ry="9" fill="#143d56" fillOpacity="0.08" />
            </g>
            <g transform="translate(230 16)">
              <path d="M28 64 L22 98" />
              <path d="M40 64 L46 98" />
              <path d="M20 56 C20 38 50 36 54 54 C58 72 24 76 20 56Z" />
              <path d="M50 50 C70 36 62 22 82 12" />
              <path d="M82 12 C88 9 94 12 91 17 C87 20 81 18 82 12Z" />
              <path d="M91 15 L112 8" />
            </g>
            <g transform="translate(430 42)">
              <path d="M0 30 C44 16 88 44 132 30 S220 16 264 30" />
              <path d="M0 44 C44 30 88 58 132 44 S220 30 264 44" opacity="0.55" />
              <path d="M0 58 C44 44 88 72 132 58 S220 44 264 58" opacity="0.32" />
            </g>
            <g transform="translate(790 16)">
              <line x1="-20" y1="82" x2="310" y2="82" opacity="0.22" />
              <rect x="20" y="42" width="240" height="40" />
              <path d="M8 42 L48 24 L232 24 L272 42" />
              <line x1="48" y1="24" x2="232" y2="24" />
              <rect x="102" y="36" width="76" height="46" />
              <path d="M102 36 C104 24 176 24 178 36" />
              <rect x="132" y="62" width="16" height="20" rx="1.5" />
              <line x1="66" y1="24" x2="66" y2="15" />
              <line x1="104" y1="24" x2="104" y2="15" />
              <line x1="176" y1="24" x2="176" y2="15" />
              <line x1="214" y1="24" x2="214" y2="15" />
              <g opacity="0.75">
                <rect x="44" y="52" width="8" height="8" />
                <rect x="68" y="52" width="8" height="8" />
                <rect x="44" y="66" width="8" height="8" />
                <rect x="68" y="66" width="8" height="8" />
                <rect x="204" y="52" width="8" height="8" />
                <rect x="228" y="52" width="8" height="8" />
                <rect x="204" y="66" width="8" height="8" />
                <rect x="228" y="66" width="8" height="8" />
                <rect x="120" y="48" width="8" height="8" />
                <rect x="152" y="48" width="8" height="8" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div className="max-w-2xl lg:max-w-4xl mx-auto" style={{ position: "relative" }}>

        {/* Title row */}
        <div className="flex items-baseline justify-between gap-4 mb-1">
          <Link href="/" className="flex items-baseline gap-2 min-w-0">
            <WaveLogo />
            <h1
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 600,
                fontSize: "1.45rem",
                letterSpacing: "-0.02em",
                color: "var(--water-deep)",
                lineHeight: 1.1,
              }}
            >
              Köpenick Kiezradar
            </h1>
          </Link>

          <div className="shrink-0 text-right" style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
            <span>{today} · {count} Einträge</span>
            {electionCount > 0 && (
              <span style={{ color: "var(--brick)", display: "block" }}>
                {days} T. bis Wahl · {electionCount} wahlrel.
              </span>
            )}
            <a
              href="/admin"
              className="opacity-0 hover:opacity-30 transition-opacity"
              aria-hidden="true"
              tabIndex={-1}
              style={{ fontSize: 10 }}
            >
              admin
            </a>
          </div>
        </div>

        <RadarNav />
      </div>
    </header>
  );
}
