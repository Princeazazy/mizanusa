/**
 * Static, dependency-free brand visual used whenever the 3D balance cannot run
 * (no WebGL, context loss, or a three.js failure at mount). Pure SVG + CSS so it
 * can never throw — the marketing pages must never depend on WebGL succeeding.
 */
export const BalancePoster = ({ className }: { className?: string }) => (
  <div
    className={`relative flex items-center justify-center ${className ?? ""}`}
    aria-hidden="true"
  >
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2"
      style={{
        background:
          "radial-gradient(closest-side, hsl(252 70% 62% / 0.13), hsl(252 70% 62% / 0.04) 34%, transparent 58%)",
        filter: "blur(28px)",
      }}
    />
    <svg
      viewBox="0 0 320 260"
      role="presentation"
      className="relative h-full w-full max-h-full"
      style={{ filter: "drop-shadow(0 18px 34px rgba(0,0,0,0.55))" }}
    >
      <defs>
        <linearGradient id="mzGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0dcae" />
          <stop offset="55%" stopColor="#d8b978" />
          <stop offset="100%" stopColor="#9a7f47" />
        </linearGradient>
        <linearGradient id="mzObsidian" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b202b" />
          <stop offset="100%" stopColor="#070910" />
        </linearGradient>
      </defs>

      {/* plinth */}
      <ellipse cx="160" cy="228" rx="74" ry="13" fill="url(#mzObsidian)" />
      <ellipse
        cx="160"
        cy="226"
        rx="56"
        ry="9"
        fill="none"
        stroke="#2ee6c5"
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      {/* column */}
      <path d="M150 226 L154 78 L166 78 L170 226 Z" fill="url(#mzObsidian)" />
      <rect x="158" y="80" width="4" height="140" fill="#2ee6c5" opacity="0.28" />
      {/* beam */}
      <rect x="44" y="70" width="232" height="6" rx="3" fill="url(#mzObsidian)" />
      <rect x="44" y="72" width="232" height="1.4" fill="#2ee6c5" opacity="0.75" />
      <circle cx="46" cy="73" r="5" fill="url(#mzGold)" />
      <circle cx="274" cy="73" r="5" fill="url(#mzGold)" />
      <circle cx="160" cy="73" r="8" fill="url(#mzGold)" />
      {/* hangers */}
      <path d="M46 78 L46 120" stroke="url(#mzGold)" strokeWidth="1.4" />
      <path d="M274 78 L274 120" stroke="url(#mzGold)" strokeWidth="1.4" />
      {/* pans */}
      <ellipse cx="46" cy="126" rx="46" ry="10" fill="url(#mzObsidian)" />
      <ellipse cx="46" cy="126" rx="46" ry="10" fill="none" stroke="url(#mzGold)" strokeWidth="1.6" />
      <ellipse cx="274" cy="126" rx="46" ry="10" fill="url(#mzObsidian)" />
      <ellipse cx="274" cy="126" rx="46" ry="10" fill="none" stroke="url(#mzGold)" strokeWidth="1.6" />
      {/* cash bundles */}
      <g>
        <rect x="24" y="110" width="44" height="8" rx="1.5" fill="#6f8375" />
        <rect x="27" y="102" width="40" height="8" rx="1.5" fill="#7d9382" />
        <rect x="31" y="94" width="34" height="8" rx="1.5" fill="#6f8375" />
        <rect x="43" y="94" width="5" height="24" fill="url(#mzGold)" opacity="0.85" />
      </g>
      {/* ledgers */}
      <g>
        <rect x="252" y="110" width="44" height="9" rx="1.5" fill="#0d1016" />
        <rect x="255" y="101" width="38" height="9" rx="1.5" fill="#141924" />
        <rect x="258" y="93" width="32" height="8" rx="1.5" fill="#0d1016" />
        <rect x="252" y="113" width="44" height="1.2" fill="url(#mzGold)" opacity="0.8" />
        <rect x="255" y="104" width="38" height="1.2" fill="#2ee6c5" opacity="0.5" />
      </g>
    </svg>
  </div>
);

export default BalancePoster;
