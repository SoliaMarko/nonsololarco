import { LogoColors } from '@/src/lib/types/ui/logo.types';

export function MarkSvg({ colors, size }: { colors: LogoColors; size: number }) {
  const rx = Math.round(size * 0.22);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx={rx} fill="var(--color-base)" />
      <path
        d="M10 42 C18 22, 28 22, 38 42 C42 50, 46 50, 50 42"
        fill="none"
        stroke={colors.squiggle}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="28" cy="14" r="4.5" fill={colors.dot} />
    </svg>
  );
}
