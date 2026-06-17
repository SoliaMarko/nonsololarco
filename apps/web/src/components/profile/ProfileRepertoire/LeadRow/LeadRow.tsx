import Link from 'next/link';

import Text from '@/src/components/typography/Text';
import { LeadTrack } from '@/src/lib/types/repertoire/repertoire.types';
import { cn } from '@/src/lib/ui/utils/cn';

interface LeadRowProps {
  hasMoreLeads?: boolean;
  track: LeadTrack;
}

export default function LeadRow({ hasMoreLeads, track }: LeadRowProps) {
  return (
    <Link
      href={`/repertoire/${track.id}`}
      className={cn(
        'plb-4 flex items-center gap-4',
        'border-fg-primary/10 border-b',
        'hover:bg-fg-primary/5 transition-colors duration-150',
        '-mli-2 pli-2 rounded-sm',
        { 'last:border-b-0': !hasMoreLeads },
      )}
    >
      <Text className="text-fg-secondary w-5 text-right font-black tabular-nums">
        {track.order}
      </Text>
      <Text className="text-fg-primary flex-1 font-semibold">{track.title}</Text>
      <Text className="text-fg-tertiary text-sm tabular-nums">
        {track.musicalKey} · {track.bpm} BPM
      </Text>
    </Link>
  );
}
