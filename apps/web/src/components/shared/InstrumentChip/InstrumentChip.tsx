import Text from '@/src/components/typography/Text';
import { Instrument } from '@/src/lib/types/profile/profile.types';
import { cn } from '@/src/lib/ui/utils/cn';

interface InstrumentChipProps {
  className?: string;
  instrument: Instrument;
}

// TODO:
export default function InstrumentChip({ className, instrument }: InstrumentChipProps) {
  return (
    <div
      className={cn(
        'border-fg-tertiary bg-bg-card pli-3 plb-2 inline-flex items-center gap-2 rounded-sm border',
        className,
      )}
    >
      <div className="bg-fg-secondary/10 h-6 w-6 shrink-0 rounded-sm" />
      <Text className="text-fg-primary font-medium">{instrument.label}</Text>
    </div>
  );
}
