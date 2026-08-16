'use client';

import { ElementType, HTMLAttributes } from 'react';

import { VariantProps } from 'class-variance-authority';

import { CheckCircleIcon, CloseCircleIcon } from '@/src/icons/base';
import { toastVariants } from '@/src/lib/variants/toast.variants';
import { cn } from '@/src/utils/cn';

const DEFAULT_ICON: Record<string, ElementType> = {
  error: CloseCircleIcon,
  info: CheckCircleIcon,
  success: CheckCircleIcon,
};

const ICON_COLOR: Record<string, string> = {
  error: 'text-danger-contrast',
  info: 'text-fg-secondary',
  success: 'text-emerald-light',
};

type ToastVariantProps = VariantProps<typeof toastVariants>;

export interface ToastProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    ToastVariantProps {
  message: string;
  className?: string;
  icon?: ElementType | null;
}

/**
 * Retro-styled toast notification for confirmations, errors and info flashes.
 *
 * Renders as a status region (`role="status"`, `aria-live="polite"`) so screen
 * readers announce it without interrupting the current task.
 *
 * The parent controls visibility and positioning — this component is the
 * visual box only. Pass `icon={null}` to suppress the default icon.
 *
 * @example
 * // Success (default)
 * {toast && <Toast message={toast} />}
 *
 * // Error
 * <Toast message="Failed to save" variant="error" />
 *
 * // No icon
 * <Toast message="Copied" icon={null} />
 */
export default function Toast({
  className,
  icon,
  message,
  variant = 'success',
  ...rest
}: ToastProps) {
  const resolvedVariant = variant ?? 'success';
  const Icon = icon === null ? null : (icon ?? DEFAULT_ICON[resolvedVariant] ?? null);

  return (
    <div
      aria-live="polite"
      className={cn(toastVariants({ variant }), className)}
      role="status"
      {...rest}
    >
      {Icon ? <Icon size={17} className={ICON_COLOR[resolvedVariant]} aria-hidden="true" /> : null}
      {message}
    </div>
  );
}
