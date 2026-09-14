import React from 'react';

interface KarigharEmblemProps {
  className?: string;
  size?: number;
}

export const KarigharEmblem: React.FC<KarigharEmblemProps> = ({
  className = '',
  size = 120,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      className={`rounded-full shadow-xs ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Karighar Artisan Emblem"
    >
      <defs>
        <linearGradient id="emblemRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7E3A19" />
          <stop offset="100%" stopColor="#55220B" />
        </linearGradient>
        <linearGradient id="emblemLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3C6B34" />
          <stop offset="100%" stopColor="#1E3F1A" />
        </linearGradient>
      </defs>

      {/* Outer circle background */}
      <circle cx="200" cy="200" r="194" fill="#FAF6EE" stroke="#254721" strokeWidth="7" />
      <circle cx="200" cy="200" r="185" fill="none" stroke="#254721" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

      {/* Cottage Roof */}
      <path
        d="M 120 108 L 240 38 L 275 60 L 275 42 L 290 42 L 290 69 L 295 72 L 240 46 L 132 110 Z"
        fill="url(#emblemRoof)"
      />

      {/* 4 Craft Tiles Grid inside house */}
      <g transform="translate(150, 85)">
        {/* Tile 1: Terracotta Red - Lotus Motif */}
        <rect x="0" y="0" width="50" height="50" rx="4" fill="#993D22" />
        {/* Lotus */}
        <path d="M 25 10 C 20 20, 20 30, 25 40 C 30 30, 30 20, 25 10 Z" fill="#FFF2DE" />
        <path d="M 14 18 C 12 28, 18 34, 25 40 C 20 32, 17 24, 14 18 Z" fill="#FFF2DE" opacity="0.9" />
        <path d="M 36 18 C 38 28, 32 34, 25 40 C 30 32, 33 24, 36 18 Z" fill="#FFF2DE" opacity="0.9" />

        {/* Tile 2: Ochre Gold - Traditional Pot */}
        <rect x="54" y="0" width="50" height="50" rx="4" fill="#C57E24" />
        <ellipse cx="79" cy="15" rx="11" ry="3" fill="#FFF2DE" />
        <path d="M 68 15 C 65 24, 66 32, 72 38 C 75 41, 83 41, 86 38 C 92 32, 93 24, 90 15 Z" fill="#FFF2DE" />
        <path d="M 72 26 L 86 26" stroke="#C57E24" strokeWidth="2" strokeDasharray="2 2" />

        {/* Tile 3: Forest Green - Handloom Weave */}
        <rect x="0" y="54" width="50" height="50" rx="4" fill="#2D5A27" />
        {/* Weave grid */}
        <path d="M 8 62 L 42 62 M 8 72 L 42 72 M 8 82 L 42 82 M 8 92 L 42 92" stroke="#FFF2DE" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 15 56 L 15 98 M 25 56 L 25 98 M 35 56 L 35 98" stroke="#FFF2DE" strokeWidth="2" strokeDasharray="4 4" />

        {/* Tile 4: Royal Indigo - Decorated Elephant */}
        <rect x="54" y="54" width="50" height="50" rx="4" fill="#1C4B68" />
        <path d="M 62 82 C 62 72, 70 66, 82 66 C 92 66, 96 72, 96 82 L 96 95 L 91 95 L 91 88 L 82 88 L 82 95 L 77 95 L 77 88 L 71 88 L 71 95 L 66 95 L 66 82 Z" fill="#FFF2DE" />
        <path d="M 94 72 C 100 74, 102 78, 102 84 L 100 86 C 99 82, 98 78, 94 77 Z" fill="#FFF2DE" />
        <circle cx="88" cy="71" r="1.5" fill="#1C4B68" />
      </g>

      {/* Artisan Woman painting pottery */}
      <g transform="translate(36, 104)">
        {/* Saree & Silhouette */}
        <ellipse cx="60" cy="24" rx="14" ry="17" fill="#2C1B14" />
        <circle cx="48" cy="30" r="10" fill="#2C1B14" />
        <path d="M 52 35 C 56 46, 68 50, 72 58 L 65 92 L 20 92 C 18 78, 26 58, 38 48 Z" fill="#9C441E" />
        {/* Golden borders of saree */}
        <path d="M 38 52 C 48 58, 56 68, 62 82" stroke="#ECC166" strokeWidth="3" fill="none" />
        {/* Forearm and hand painting */}
        <path d="M 68 58 C 76 60, 84 66, 90 70 L 98 64" stroke="#D18754" strokeWidth="5" strokeLinecap="round" fill="none" />
        <line x1="97" y1="65" x2="105" y2="74" stroke="#254721" strokeWidth="2.5" strokeLinecap="round" />
        {/* Decorated Pot being painted */}
        <path d="M 100 70 C 94 74, 94 84, 100 90 C 105 95, 117 95, 122 90 C 128 84, 128 74, 122 70 Z" fill="#B85926" />
        <circle cx="111" cy="80" r="4" fill="#FAF6EE" />
      </g>

      {/* Craft Foliage / Green branches on Right */}
      <g transform="translate(260, 100)">
        <path d="M 10 100 C 25 70, 45 40, 60 10" stroke="#254721" strokeWidth="3" fill="none" />
        {/* Leaves */}
        <path d="M 40 45 C 50 35, 75 35, 80 48 C 70 55, 50 55, 40 45 Z" fill="url(#emblemLeaf)" />
        <path d="M 25 75 C 38 65, 60 68, 65 80 C 52 86, 35 84, 25 75 Z" fill="url(#emblemLeaf)" />
        <path d="M 52 24 C 58 10, 75 8, 78 20 C 70 28, 58 26, 52 24 Z" fill="url(#emblemLeaf)" />
      </g>

      {/* Flowing Earth Ribbon */}
      <path
        d="M 36 215 C 100 185, 260 215, 364 220 C 280 200, 120 185, 36 215 Z"
        fill="#823F1F"
      />

      {/* Brand Text Section */}
      <text
        x="200"
        y="262"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="34"
        fontWeight="bold"
        fill="#662912"
        letterSpacing="1"
      >
        Karighar
      </text>

      {/* Subtitle: A HOME FOR ARTISANS */}
      <line x1="68" y1="284" x2="108" y2="284" stroke="#8A4822" strokeWidth="1" />
      <circle cx="112" cy="284" r="2.5" fill="#8A4822" />
      <text
        x="200"
        y="288"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="11"
        fontWeight="bold"
        fill="#662912"
        letterSpacing="3"
      >
        A HOME FOR ARTISANS
      </text>
      <circle cx="288" cy="284" r="2.5" fill="#8A4822" />
      <line x1="292" y1="284" x2="332" y2="284" stroke="#8A4822" strokeWidth="1" />

      {/* 4 Pillars */}
      <text
        x="200"
        y="306"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="600"
        fill="#4A2010"
        letterSpacing="2"
      >
        CRAFT  |  CULTURE  |  COMMUNITY  |  OPPORTUNITY
      </text>

      {/* Lower Lotus */}
      <path d="M 200 320 C 195 328, 195 338, 200 348 C 205 338, 205 328, 200 320 Z" fill="#A84320" />
      <path d="M 190 328 C 188 335, 192 342, 200 348 C 196 340, 193 333, 190 328 Z" fill="#2E5526" />
      <path d="M 210 328 C 212 335, 208 342, 200 348 C 204 340, 207 333, 210 328 Z" fill="#2E5526" />

      {/* Bottom Circular Arc Text */}
      <text
        x="200"
        y="370"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="9"
        fontWeight="bold"
        fill="#264821"
        letterSpacing="2"
      >
        HANDMADE INDIA • A BRIGHTER TOMORROW
      </text>
    </svg>
  );
};
