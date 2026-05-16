// CSS/SVG-based annotated diagram of the Stretch Bed. Used until a real photo-based
// diagram lands in /public/images/parts/. Cheap to maintain, scales cleanly, accessible.

export function StretchBedSvg() {
  return (
    <svg
      viewBox="0 0 600 360"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stretch Bed annotated parts diagram"
      className="w-full h-auto"
    >
      {/* Canvas — the sleeping surface */}
      <rect
        x="80"
        y="140"
        width="440"
        height="80"
        rx="8"
        fill="#d4a373"
        stroke="#7c5e3a"
        strokeWidth="2"
      />
      {/* Canvas stitching detail */}
      <line x1="80" y1="155" x2="520" y2="155" stroke="#7c5e3a" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="80" y1="205" x2="520" y2="205" stroke="#7c5e3a" strokeWidth="1" strokeDasharray="3 3" />

      {/* Pole sleeves (visible at canvas ends) */}
      <rect x="80" y="138" width="20" height="84" fill="#a8814b" />
      <rect x="500" y="138" width="20" height="84" fill="#a8814b" />

      {/* Steel poles — sticking out each side */}
      <rect x="60" y="155" width="40" height="12" rx="6" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
      <rect x="500" y="155" width="40" height="12" rx="6" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
      <rect x="60" y="193" width="40" height="12" rx="6" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />
      <rect x="500" y="193" width="40" height="12" rx="6" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.5" />

      {/* Legs — recycled HDPE plastic */}
      <path d="M 50 167 L 50 270 L 95 290 L 95 187 Z" fill="#525b3a" stroke="#3a4128" strokeWidth="2" />
      <path d="M 505 187 L 505 290 L 550 270 L 550 167 Z" fill="#525b3a" stroke="#3a4128" strokeWidth="2" />

      {/* Leg sockets (where pole goes in) */}
      <ellipse cx="72" cy="161" rx="14" ry="6" fill="#3a4128" />
      <ellipse cx="528" cy="161" rx="14" ry="6" fill="#3a4128" />
      <ellipse cx="72" cy="199" rx="14" ry="6" fill="#3a4128" />
      <ellipse cx="528" cy="199" rx="14" ry="6" fill="#3a4128" />

      {/* End caps — ribbed black plugs */}
      <circle cx="65" cy="161" r="4" fill="#1f2937" />
      <circle cx="535" cy="161" r="4" fill="#1f2937" />
      <circle cx="65" cy="199" r="4" fill="#1f2937" />
      <circle cx="535" cy="199" r="4" fill="#1f2937" />

      {/* Ground line */}
      <line x1="20" y1="290" x2="580" y2="290" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4 4" />

      {/* Annotation lines + labels */}
      {/* 1. Canvas */}
      <line x1="300" y1="180" x2="300" y2="100" stroke="#374151" strokeWidth="1" />
      <circle cx="300" cy="180" r="3" fill="#374151" />
      <rect x="245" y="78" width="110" height="22" rx="11" fill="#fef3c7" stroke="#d97706" />
      <text x="300" y="93" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350f">
        1 · Canvas
      </text>

      {/* 2. Poles */}
      <line x1="80" y1="161" x2="80" y2="50" stroke="#374151" strokeWidth="1" />
      <circle cx="80" cy="161" r="3" fill="#374151" />
      <rect x="20" y="28" width="120" height="22" rx="11" fill="#fef3c7" stroke="#d97706" />
      <text x="80" y="43" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350f">
        2 · Steel poles ×2
      </text>

      {/* 3. Legs */}
      <line x1="72" y1="240" x2="72" y2="320" stroke="#374151" strokeWidth="1" />
      <circle cx="72" cy="240" r="3" fill="#374151" />
      <rect x="20" y="320" width="120" height="22" rx="11" fill="#fef3c7" stroke="#d97706" />
      <text x="80" y="335" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350f">
        3 · HDPE legs ×4
      </text>

      {/* 4. End caps */}
      <line x1="535" y1="161" x2="555" y2="60" stroke="#374151" strokeWidth="1" />
      <circle cx="535" cy="161" r="3" fill="#374151" />
      <rect x="480" y="38" width="115" height="22" rx="11" fill="#fef3c7" stroke="#d97706" />
      <text x="538" y="53" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350f">
        4 · End caps ×4
      </text>

      {/* Pole sleeve note */}
      <line x1="90" y1="180" x2="90" y2="320" stroke="#374151" strokeWidth="1" strokeDasharray="2 2" />
      <text x="80" y="345" textAnchor="middle" fontSize="9" fill="#6b7280" fontStyle="italic">
        canvas sleeves hold the poles
      </text>
    </svg>
  );
}
