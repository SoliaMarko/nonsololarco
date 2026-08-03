import { HTMLAttributes } from 'react';

import { LOGO_COLORS, MARK_SIZE, WORDMARK_SCALE } from '@/src/lib/constants/ui/logo.const';
import { Locale } from '@/src/lib/types/common.types';
import { LogoSize, LogoTone, LogoVariant } from '@/src/lib/types/ui/logo.types';
import { cn } from '@/src/utils/cn';

import { LockupSvg } from './svgs/Lockup';
import { MarkSvg } from './svgs/Mark';
import { WordmarkSvg } from './svgs/Wordmark';

export interface LogoProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  /**
   * Locale for subtitle text in lockup variant.
   * @default 'en'
   */
  locale?: Locale;
  /** Size of the logo. @default 'md' */
  size?: LogoSize;
  /** Color tone. Use `on-brand` on the emerald hero background. @default 'default' */
  tone?: LogoTone;
  /** Visual variant of the logo. @default 'wordmark' */
  variant?: LogoVariant;
}

/**
 * Arco brand logo — three variants: mark (icon only), wordmark, lockup (with subtitle).
 * Colors adapt to dark/light theme automatically via CSS variables — no JS theme detection needed.
 *
 * @example
 * <Logo variant="mark" size="md" />
 * <Logo variant="wordmark" size="lg" />
 * <Logo variant="lockup" size="md" locale="ua" />
 */
function Logo({
  className,
  locale = 'en',
  size = 'md',
  tone = 'default',
  variant = 'wordmark',
  ...rest
}: LogoProps) {
  const colors = LOGO_COLORS[tone];

  return (
    <div
      className={cn('inline-flex items-center', className)}
      role="img"
      aria-label="nonsololarco"
      {...rest}
    >
      {variant === 'mark' ? <MarkSvg size={MARK_SIZE[size]} colors={colors} /> : null}
      {variant === 'wordmark' ? <WordmarkSvg scale={WORDMARK_SCALE[size]} colors={colors} /> : null}
      {variant === 'lockup' ? (
        <LockupSvg scale={WORDMARK_SCALE[size]} locale={locale} colors={colors} />
      ) : null}
    </div>
  );
}

export default Logo;
