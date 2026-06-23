import { ReactNode, cloneElement, isValidElement, useId } from 'react';

import {
  CIRCUMFERENCE,
  COLOR_CONFIG,
} from '@/src/lib/constants/illustrations/achievement-badge.const';
import { AchievementBadgeColor } from '@/src/lib/types/illustrations/achievement-badge.types';
import { cn } from '@/src/lib/ui/utils/cn';

export interface AchievementBadgeProps {
  className?: string;
  color?: AchievementBadgeColor;
  count?: string;
  /** Icon as JSX element — size is auto-injected based on badge size */
  icon: ReactNode;
  /** Override auto-calculated icon size (default: size × 0.42) */
  iconSize?: number;
  label: string | [string, string?];
  levitate?: boolean;
  levitateDelay?: number;
  locked?: boolean;
  progress?: number;
  size?: number;
}

export default function AchievementBadge({
  className,
  color = 'green',
  count,
  icon,
  iconSize,
  label,
  levitate,
  levitateDelay,
  locked = false,
  progress = 1,
  size = 80,
}: AchievementBadgeProps) {
  const id = useId().replace(/:/g, '_');
  const colorConfig = COLOR_CONFIG[color];
  const arc = Math.max(0, Math.min(progress, 1)) * CIRCUMFERENCE;
  const resolvedIconSize = iconSize ?? Math.round(size * 0.32);

  const scaledIcon = isValidElement(icon)
    ? cloneElement(icon as React.ReactElement<{ size?: number }>, { size: resolvedIconSize })
    : icon;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          animation: levitate
            ? `levitate 4.8s ease-in-out ${levitateDelay ?? 0}s infinite`
            : undefined,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          style={{
            display: 'block',
            overflow: 'visible',
            filter: [
              'drop-shadow(0 5px 9px rgba(20,18,13,0.12))',
              colorConfig.glow !== 'transparent' ? `drop-shadow(0 0 14px ${colorConfig.glow})` : '',
            ]
              .filter(Boolean)
              .join(' '),
          }}
          role="img"
          aria-labelledby={`${id}-label`}
        >
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="1.5"
            opacity="0.16"
          />
          <circle
            cx="60"
            cy="60"
            r="49"
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="1.5"
            opacity="0.28"
          />
          <circle
            cx="60"
            cy="60"
            r="43"
            fill={colorConfig.discFill}
            stroke={colorConfig.discStroke}
            strokeWidth="1"
          />
          <circle
            cx="60"
            cy="60"
            r="43"
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${CIRCUMFERENCE}`}
            transform="rotate(-90 60 60)"
          />
          <circle
            cx="60"
            cy="60"
            r="34"
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="1"
            opacity="0.22"
          />
          <path
            d="M38 46 A43 43 0 0 1 80 30"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: colorConfig.iconStroke }}
        >
          {scaledIcon}
        </div>

        {count ? (
          <div
            className="absolute -top-1 -right-1 flex items-center justify-center rounded-full"
            style={{
              minWidth: 28,
              height: 28,
              padding: '0 6px',
              background: '#1c1b17',
              color: '#f4f1e8',
              border: '2.5px solid #f4f1e8',
              fontSize: 11,
              fontWeight: 800,
              fontFamily: 'monospace',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            }}
          >
            {count}
          </div>
        ) : null}

        {locked ? (
          <div
            className="absolute right-0 bottom-0 flex items-center justify-center rounded-full"
            style={{
              width: 26,
              height: 26,
              background: '#26241c',
              border: '2px solid #f4f1e8',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cfc9b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </div>
        ) : null}
      </div>

      <div
        id={`${id}-label`}
        className="text-center"
        style={{ lineHeight: 1.3, fontFamily: 'monospace' }}
      >
        <div className="text-fg-tertiary text-[11px] font-black tracking-widest uppercase">
          {typeof label === 'string' ? label : label[0]}
        </div>
        {typeof label !== 'string' && label[1] ? (
          <div className="text-fg-tertiary text-[11px] font-black tracking-widest uppercase">
            {label[1]}
          </div>
        ) : null}
      </div>
    </div>
  );
}
