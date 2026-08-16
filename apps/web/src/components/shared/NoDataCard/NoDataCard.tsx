import { ReactNode } from 'react';

import VinylRecord from '@/src/illustrations/vinyl/VinylRecord';
import { cn } from '@/src/utils/cn';

import Heading from '../../typography/Heading';
import Text from '../../typography/Text';

export interface NoDataCardProps {
  description: string;
  title: string;
  /** Action button rendered at the bottom of the card */
  action?: ReactNode;
  className?: string;
  /** Icon or illustration inside the dashed circle. Defaults to VinylRecord. */
  icon?: ReactNode;
}

export default function NoDataCard({
  action,
  className,
  description,
  icon,
  title,
}: NoDataCardProps) {
  return (
    <div
      className={cn(
        'border-border-primary bg-base plb-12 pli-8 flex flex-col items-center gap-6 border-3',
        className,
      )}
    >
      <div className="border-border-primary flex size-24 items-center justify-center rounded-full border-3 border-dashed">
        {icon ?? <VinylRecord size={88} color="olive" />}
      </div>

      <div className="text-center">
        <Heading tag="h2" className="text-fg-primary text-lg font-bold tracking-tight uppercase">
          {title}
        </Heading>
        <Text className="text-fg-tertiary mbs-2 text-sm">{description}</Text>
      </div>

      {action ?? null}
    </div>
  );
}
