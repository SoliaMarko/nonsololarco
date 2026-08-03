import { LOGO_SUBTITLE } from '@/src/lib/constants/ui/logo.const';
import { Locale } from '@/src/lib/types/common.types';
import { LogoColors } from '@/src/lib/types/ui/logo.types';

export function LockupSvg({
  colors,
  locale,
  scale,
}: {
  colors: LogoColors;
  locale: Locale;
  scale: number;
}) {
  const width = Math.round(200 * scale);
  const height = Math.round(56 * scale);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 56"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ userSelect: 'none' }}
    >
      <g transform="translate(0, 14)">
        <path
          d="M4 34 C10 18, 18 18, 26 34 C29 40, 32 40, 35 34"
          fill="none"
          stroke={colors.squiggle}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="12" r="3.5" fill={colors.dot} />
      </g>
      <text fontFamily="Georgia,serif" fontSize="22" fill={colors.muted} y="34" x="50">
        non
      </text>
      <text fontFamily="Georgia,serif" fontSize="22" fill={colors.primary} y="34" x="91">
        so
      </text>
      <ellipse
        cx="117"
        cy="32"
        rx="4.5"
        ry="3.2"
        fill={colors.note}
        transform="rotate(-15,115,32)"
      />
      <line
        x1="120.7"
        y1="30.5"
        x2="120.7"
        y2="9"
        stroke={colors.note}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <text fontFamily="Georgia,serif" fontSize="22" fill={colors.primary} y="34" x="123">
        o
      </text>
      <ellipse
        cx="140"
        cy="32"
        rx="4.5"
        ry="3.2"
        fill={colors.note}
        transform="rotate(-15,140,32)"
      />
      <line
        x1="143.7"
        y1="30.5"
        x2="143.7"
        y2="16"
        stroke={colors.note}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="121.2"
        y1="9"
        x2="128.2"
        y2="11.3"
        stroke={colors.note}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <line
        x1="136.2"
        y1="14"
        x2="143.2"
        y2="16.3"
        stroke={colors.note}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <text fontFamily="Georgia,serif" fontSize="22" fill={colors.muted} y="34" x="148">
        arco
      </text>
      <text
        fontFamily="Arial,sans-serif"
        fontSize="10"
        fill={colors.subtitle}
        letterSpacing="2.5"
        y="53"
        x="51"
      >
        {LOGO_SUBTITLE[locale]}
      </text>
    </svg>
  );
}
