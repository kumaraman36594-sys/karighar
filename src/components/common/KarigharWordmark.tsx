import React from 'react';

interface KarigharWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  align?: 'left' | 'center' | 'right';
  onClick?: () => void;
}

export const KarigharWordmark: React.FC<KarigharWordmarkProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  align = 'center',
  onClick,
}) => {
  // Height sizing
  const sizeClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const alignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <div 
      className={`inline-flex flex-col ${alignClasses[align]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <svg
        viewBox="0 0 540 135"
        className={`${sizeClasses[size]} w-auto max-w-full drop-shadow-xs select-none`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Karighar - A Home for Artisans"
      >
        <defs>
          {/* Terracotta gradient for warm ceramic feel */}
          <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7F3517" />
            <stop offset="60%" stopColor="#6C2A12" />
            <stop offset="100%" stopColor="#57200D" />
          </linearGradient>

          {/* Leaf Green gradient */}
          <linearGradient id="leafGrad" x1="0%" y1="100%" x2="70%" y2="0%">
            <stop offset="0%" stopColor="#254721" />
            <stop offset="45%" stopColor="#35612D" />
            <stop offset="100%" stopColor="#4B7E41" />
          </linearGradient>

          {/* Leaf vein gradient */}
          <linearGradient id="veinGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E381A" />
            <stop offset="100%" stopColor="#5D9251" />
          </linearGradient>

          {/* House Left Wall green-to-terracotta tint */}
          <linearGradient id="houseLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2B4D25" />
            <stop offset="35%" stopColor="#4A341E" />
            <stop offset="100%" stopColor="#6C2A12" />
          </linearGradient>
        </defs>

        {/* ─── Letter 'K' ─── */}
        <g id="letter-K">
          {/* Main vertical stem with classic organic flare at top */}
          <path
            d="M 28 32 
               C 22 30, 16 35, 15 45 
               C 14 55, 17 62, 21 68 
               L 25 106 
               C 25 112, 17 115, 13 115 
               L 13 118 
               L 47 118 
               L 47 115 
               C 42 114, 38 110, 38 105 
               L 38 48 
               C 38 41, 44 38, 48 38 
               L 48 35 
               C 42 34, 34 33, 28 32 Z"
            fill="url(#terracottaGrad)"
          />

          {/* Lower right leg of K with smooth organic sweep */}
          <path
            d="M 36 78 
               L 55 103 
               C 62 112, 73 116, 85 117 
               C 74 115, 62 107, 54 97 
               L 40 79 
               C 38 76, 36 76, 36 78 Z"
            fill="url(#terracottaGrad)"
          />
          <path
            d="M 37 77
               C 42 74, 46 76, 52 83
               L 72 108
               C 76 113, 82 116, 92 116
               C 85 115, 78 112, 72 104
               L 52 79
               C 47 73, 41 72, 37 77 Z"
            fill="url(#terracottaGrad)"
          />
          <path
            d="M 34 76
               L 58 107
               C 66 116, 78 118, 92 118
               C 80 117, 68 111, 58 99
               L 38 74
               Z"
            fill="url(#terracottaGrad)"
          />

          {/* Upper right branch: Iconic Green Leaf */}
          <path
            d="M 34 74
               C 32 68, 33 58, 38 48
               C 43 38, 51 28, 62 18
               C 67 13, 73 9, 78 7
               C 78 11, 75 18, 71 25
               C 65 37, 56 49, 47 62
               C 43 68, 39 72, 34 74 Z"
            fill="url(#leafGrad)"
          />
          {/* Leaf center vein */}
          <path
            d="M 35 73
               C 42 56, 52 40, 64 26
               C 69 20, 74 13, 78 7"
            stroke="url(#veinGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>

        {/* ─── Letter 'a' (first) ─── */}
        <g id="letter-a1" transform="translate(92, 0)">
          {/* Bowl and arch */}
          <path
            d="M 44 65
               C 44 54, 35 48, 23 48
               C 13 48, 6 53, 5 60
               L 8 61
               C 10 57, 15 52, 22 52
               C 31 52, 38 58, 38 68
               L 38 72
               C 33 68, 26 66, 19 66
               C 8 66, 2 73, 2 84
               C 2 95, 9 103, 19 103
               C 27 103, 34 98, 38 91
               L 38 98
               C 38 102, 42 103, 46 103
               L 46 101
               C 43 100, 42 98, 42 94
               L 42 65 Z
               M 38 78
               L 38 88
               C 35 94, 28 98, 22 98
               C 14 98, 9 93, 9 84
               C 9 75, 14 70, 22 70
               C 28 70, 34 73, 38 78 Z"
            fill="url(#terracottaGrad)"
          />
        </g>

        {/* ─── Letter 'r' (first) ─── */}
        <g id="letter-r1" transform="translate(150, 0)">
          <path
            d="M 8 54
               L 8 96
               C 8 101, 5 102, 2 103
               L 2 105
               L 22 105
               L 22 103
               C 18 102, 16 100, 16 95
               L 16 68
               C 20 57, 27 52, 34 52
               C 37 52, 40 54, 42 56
               L 44 50
               C 41 48, 36 47, 30 50
               C 24 53, 19 59, 16 65
               L 16 54
               C 16 50, 14 49, 9 49
               L 5 49
               L 5 51
               C 7 51, 8 52, 8 54 Z"
            fill="url(#terracottaGrad)"
          />
        </g>

        {/* ─── Letter 'i' ─── */}
        <g id="letter-i" transform="translate(196, 0)">
          {/* Dot */}
          <circle cx="12" cy="36" r="4.5" fill="url(#terracottaGrad)" />
          {/* Stem */}
          <path
            d="M 9 54
               L 9 96
               C 9 101, 6 102, 3 103
               L 3 105
               L 22 105
               L 22 103
               C 18 102, 16 100, 16 95
               L 16 55
               C 16 51, 14 50, 10 50
               L 6 50
               L 6 52
               C 8 52, 9 53, 9 54 Z"
            fill="url(#terracottaGrad)"
          />
        </g>

        {/* ─── Letter 'g' ─── */}
        <g id="letter-g" transform="translate(225, 0)">
          <path
            d="M 43 51
               C 39 49, 34 48, 28 48
               C 14 48, 4 58, 4 75
               C 4 92, 14 102, 27 102
               C 34 102, 39 99, 42 94
               L 42 104
               C 42 117, 34 124, 21 124
               C 13 124, 7 120, 6 115
               L 3 115
               C 4 123, 12 128, 23 128
               C 39 128, 48 118, 48 101
               L 48 55
               C 48 50, 46 49, 43 49
               L 43 51 Z
               M 42 63
               L 42 85
               C 39 94, 34 98, 27 98
               C 17 98, 11 90, 11 75
               C 11 60, 17 52, 27 52
               C 34 52, 39 56, 42 63 Z"
            fill="url(#terracottaGrad)"
          />
        </g>

        {/* ─── Letter 'h' (The House / Cottage Signature Element) ─── */}
        <g id="letter-h" transform="translate(282, 0)">
          {/* Left upright stem with green-terracotta tint */}
          <path
            d="M 12 32
               C 8 32, 5 35, 5 40
               L 5 42
               C 7 42, 9 43, 9 46
               L 9 96
               C 9 101, 6 102, 3 103
               L 3 105
               L 22 105
               L 22 103
               C 18 102, 16 100, 16 95
               L 16 48
               C 16 40, 14 36, 12 32 Z"
            fill="url(#houseLeftGrad)"
          />

          {/* Cottage Pitched Roof Gable + Archway + Right Wall */}
          <path
            d="M 16 62
               L 37 42
               L 58 62
               L 58 96
               C 58 101, 55 102, 52 103
               L 52 105
               L 71 105
               L 71 103
               C 67 102, 65 100, 65 95
               L 65 67
               L 37 47
               L 16 67
               Z"
            fill="url(#terracottaGrad)"
          />

          {/* Cottage Doorway Arch Inner cutout line */}
          <path
            d="M 23 68
               L 37 54
               L 51 68
               L 51 105
               L 44 105
               L 44 72
               L 37 63
               L 30 72
               L 30 105
               L 23 105
               Z"
            fill="url(#terracottaGrad)"
          />

          {/* The 4-Pane Cottage Window inside the arch */}
          {/* Top Left Pane */}
          <rect x="32" y="70" width="4" height="4" rx="0.5" fill="url(#terracottaGrad)" />
          {/* Top Right Pane */}
          <rect x="38" y="70" width="4" height="4" rx="0.5" fill="url(#terracottaGrad)" />
          {/* Bottom Left Pane */}
          <rect x="32" y="76" width="4" height="4" rx="0.5" fill="url(#terracottaGrad)" />
          {/* Bottom Right Pane */}
          <rect x="38" y="76" width="4" height="4" rx="0.5" fill="url(#terracottaGrad)" />
        </g>

        {/* ─── Letter 'a' (second) ─── */}
        <g id="letter-a2" transform="translate(362, 0)">
          <path
            d="M 44 65
               C 44 54, 35 48, 23 48
               C 13 48, 6 53, 5 60
               L 8 61
               C 10 57, 15 52, 22 52
               C 31 52, 38 58, 38 68
               L 38 72
               C 33 68, 26 66, 19 66
               C 8 66, 2 73, 2 84
               C 2 95, 9 103, 19 103
               C 27 103, 34 98, 38 91
               L 38 98
               C 38 102, 42 103, 46 103
               L 46 101
               C 43 100, 42 98, 42 94
               L 42 65 Z
               M 38 78
               L 38 88
               C 35 94, 28 98, 22 98
               C 14 98, 9 93, 9 84
               C 9 75, 14 70, 22 70
               C 28 70, 34 73, 38 78 Z"
            fill="url(#terracottaGrad)"
          />
        </g>

        {/* ─── Letter 'r' (second) ─── */}
        <g id="letter-r2" transform="translate(420, 0)">
          <path
            d="M 8 54
               L 8 96
               C 8 101, 5 102, 2 103
               L 2 105
               L 22 105
               L 22 103
               C 18 102, 16 100, 16 95
               L 16 68
               C 20 57, 27 52, 34 52
               C 37 52, 40 54, 42 56
               L 44 50
               C 41 48, 36 47, 30 50
               C 24 53, 19 59, 16 65
               L 16 54
               C 16 50, 14 49, 9 49
               L 5 49
               L 5 51
               C 7 51, 8 52, 8 54 Z"
            fill="url(#terracottaGrad)"
          />
        </g>
      </svg>

      {showTagline && (
        <div className="flex items-center gap-2 mt-1 select-none">
          <span className="h-px w-6 bg-stone-300"></span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-stone-600">
            A Home For Artisans · हुनर से बाज़ार तक
          </span>
          <span className="h-px w-6 bg-stone-300"></span>
        </div>
      )}
    </div>
  );
};
