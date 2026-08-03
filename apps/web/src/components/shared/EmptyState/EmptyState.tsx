import VinylRecord from '@/src/illustrations/vinyl/VinylRecord';
import { cn } from '@/src/utils/cn';

import Heading from '../../typography/Heading';
import Text from '../../typography/Text';

export interface EmptyStateProps {
  className?: string;
  description?: string;
  title?: string;
}

export default function EmptyState({
  className,
  description = 'This section is still in the studio. Check back soon.',
  title = 'Coming soon',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'plb-16 pli-4 flex min-h-full flex-1 flex-col items-center justify-center gap-6',
        className,
      )}
    >
      <div className="relative">
        <VinylRecord size={80} color="olive" />
        <div className="pli-2 plb-0.5 text-fg-tertiary absolute -inset-e-3 -bottom-2 rotate-6 rounded-sm border-2 border-dashed border-current">
          <span className="text-[10px] font-bold tracking-widest uppercase">idle</span>
        </div>
      </div>

      <div className="text-center">
        <Heading tag="h2" className="text-fg-primary text-lg font-bold tracking-tight uppercase">
          {title}
        </Heading>
        <Text className="text-fg-tertiary mbs-2 text-sm">{description}</Text>
      </div>
    </div>
  );
}
