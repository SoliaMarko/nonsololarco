import Spinner, { SpinnerProps } from '@/src/components/ui/Spinner';
import { cn } from '@/src/utils/cn';

export interface PageLoaderProps {
  className?: string;
  /** Accessible loading label announced to screen readers. */
  label?: string;
  /** Spinner size. @default 'xl' */
  size?: SpinnerProps['size'];
}

/**
 * Full-height centered loading state for page-level async gates
 * (auth checks, initial data fetches) where there is no content to show yet.
 */
export default function PageLoader({ className, label, size = 'xl' }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'mli-auto flex min-h-dvh flex-1 flex-col items-center justify-center',
        className,
      )}
    >
      <Spinner size={size} label={label} />
    </div>
  );
}
