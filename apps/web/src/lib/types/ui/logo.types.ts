export type LogoVariant = 'mark' | 'wordmark' | 'lockup';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color tone for the logo.
 * - `default` — theme-adaptive colors (for normal light/dark surfaces).
 * - `on-brand` — fixed light palette tuned for the emerald brand background,
 *   so text and notes stay legible and don't blend into the green.
 */
export type LogoTone = 'default' | 'on-brand';

export interface LogoColors {
  accent: string;
  dot: string;
  muted: string;
  note: string;
  primary: string;
  squiggle: string;
  subtitle: string;
}
