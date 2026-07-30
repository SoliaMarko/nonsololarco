'use client';

import { useSearchParams } from 'next/navigation';

import { Band, RepertoireStats } from '@nonsololarco/types';

import { cn } from '@/src/utils/cn';

import Breadcrumb from '../../shared/Breadcrumb';
import Heading from '../../typography/Heading';
import Text from '../../typography/Text';
import ActionButtons from './ActionButtons';
import BandStats from './BandStats';
import BandTabs from './BandTabs';

export interface RepertoireHeaderProps {
  bands: Band[];
  className?: string;
  // TODO: implement soon
  isAIOpen?: boolean;
  onAIToggle?: () => void;
  stats: RepertoireStats;
}

export default function RepertoireHeader({
  bands,
  stats,
  // onAIToggle,
  // isAIOpen = false,
  className,
}: RepertoireHeaderProps) {
  const searchParams = useSearchParams();

  const activeBandId = searchParams.get('band') ?? bands[0]?.id;
  const activeBand = bands.find((band) => band.id === activeBandId) ?? bands[0];

  return (
    <div className={cn('border-border-primary border-b', className)}>
      <Breadcrumb />

      <div className="xs:hidden plb-4 bg-base border-border-primary border-b">
        <Heading
          className="text-fg-primary text-center text-lg leading-none font-bold tracking-tight uppercase"
          tag="h1"
        >
          {activeBand?.name}
        </Heading>
      </div>

      <BandTabs bands={bands} />

      {/* up to sm screens */}
      <div className="pli-4 plb-3 bg-contrast bg-dots-subtle xs:flex-row flex flex-col items-center justify-between gap-4 md:hidden">
        <BandStats bands={bands} stats={stats} />
        <ActionButtons />
      </div>

      {/* md and large screens */}
      <div className="pli-6 plb-5 bg-yellow-main bg-dots-subtle hidden items-center justify-between gap-4 md:flex">
        <div>
          <div className="mbe-1 tracking-widest">
            <Text className="text-danger-deep text-xs font-medium uppercase">Band repertoire</Text>
          </div>
          <Heading
            className="text-primary-dark text-3xl leading-none font-bold tracking-tight uppercase"
            tag="h1"
          >
            {activeBand?.name}
          </Heading>
        </div>

        <BandStats bands={bands} stats={stats} />
        <ActionButtons />
      </div>
    </div>
  );
}
