import { LogoColors } from '@/src/lib/types/ui/logo.types';

export function WordmarkSvg({ colors, scale }: { colors: LogoColors; scale: number }) {
  const width = Math.round(194 * scale);
  const height = Math.round(42 * scale);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 194 42"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ userSelect: 'none' }}
    >
      <path
        d="M4 34 C10 18, 18 18, 26 34 C29 40, 32 40, 35 34"
        fill="none"
        stroke={colors.squiggle}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="13" r="3.5" fill={colors.dot} />
      <text
        fontFamily="Georgia,serif"
        fontSize="22"
        fontWeight="400"
        fill={colors.muted}
        y="34"
        x="50"
      >
        non
      </text>
      <text
        fontFamily="Georgia,serif"
        fontSize="22"
        fontWeight="400"
        fill={colors.primary}
        y="34"
        x="91"
      >
        so
      </text>
      <ellipse cx="116" cy="34" rx="4.2" ry="3" fill={colors.note} transform="rotate(-12,116,34)" />
      <line
        x1="119.5"
        y1="33"
        x2="119.5"
        y2="10"
        stroke={colors.note}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        fontFamily="Georgia,serif"
        fontSize="22"
        fontWeight="400"
        fill={colors.primary}
        y="34"
        x="124"
      >
        o
      </text>
      <ellipse cx="142" cy="34" rx="4.2" ry="3" fill={colors.note} transform="rotate(-12,142,34)" />
      <line
        x1="145.5"
        y1="33"
        x2="145.5"
        y2="19"
        stroke={colors.note}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="120"
        y1="10"
        x2="145"
        y2="19"
        stroke={colors.note}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <text
        fontFamily="Georgia,serif"
        fontSize="22"
        fontWeight="400"
        fill={colors.muted}
        y="34"
        x="150"
      >
        arco
      </text>
    </svg>
  );
}
