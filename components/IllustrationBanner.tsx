export default function IllustrationBanner() {
  return (
    <svg
      width="100%"
      viewBox="0 0 1200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", opacity: 0.85 }}
    >
      <g stroke="#143d56" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">

        {/* horizon / waterline */}
        <path d="M40 82 C180 72, 300 92, 440 82 S700 72, 860 82 S1080 92, 1160 80" opacity="0.28" />

        {/* Reeds left */}
        <g transform="translate(120 12)">
          <path d="M0 78 C6 52 -4 38 4 12" />
          <path d="M18 78 C24 54 14 36 22 8" />
          <path d="M36 78 C42 50 30 32 40 10" />
          <ellipse cx="4" cy="10" rx="3" ry="9" fill="#143d56" fillOpacity="0.08" />
          <ellipse cx="22" cy="7" rx="3" ry="10" fill="#143d56" fillOpacity="0.08" />
          <ellipse cx="40" cy="9" rx="3" ry="9" fill="#143d56" fillOpacity="0.08" />
        </g>

        {/* Heron */}
        <g transform="translate(230 16)">
          <path d="M28 64 L22 98" />
          <path d="M40 64 L46 98" />
          <path d="M20 56 C20 38 50 36 54 54 C58 72 24 76 20 56Z" />
          <path d="M50 50 C70 36 62 22 82 12" />
          <path d="M82 12 C88 9 94 12 91 17 C87 20 81 18 82 12Z" />
          <path d="M91 15 L112 8" />
          <path d="M28 56 C36 46 45 45 53 54" opacity="0.45" />
        </g>

        {/* Waves */}
        <g transform="translate(430 42)">
          <path d="M0 30 C44 16 88 44 132 30 S220 16 264 30" />
          <path d="M0 44 C44 30 88 58 132 44 S220 30 264 44" opacity="0.55" />
          <path d="M0 58 C44 44 88 72 132 58 S220 44 264 58" opacity="0.32" />
        </g>

        {/* Schloss Köpenick */}
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
  );
}
