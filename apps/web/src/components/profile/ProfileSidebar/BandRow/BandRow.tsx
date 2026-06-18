import Text from '@/src/components/typography/Text';
import { Band } from '@/src/lib/types/profile/profile.types';
import { cn } from '@/src/lib/ui/utils/cn';

interface BandRowProps {
  band: Band;
  className?: string;
}

export default function BandRow({ band, className }: BandRowProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* vinyl avatar placeholder */}
      <div className="bg-fg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <div className="bg-accent-yellow h-3 w-3 rounded-full" />
      </div>
      <div className="flex flex-col">
        <Text className="text-fg-primary font-black">{band.name}</Text>
        <Text className="text-fg-tertiary text-sm">
          {band.role}
          {band.since ? ` · since ${band.since}` : null}
        </Text>
      </div>
    </div>
  );
}
