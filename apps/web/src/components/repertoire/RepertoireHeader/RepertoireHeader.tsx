'use client';

import { useTranslations } from 'next-intl';

import { Band, RepertoireStats } from '@nonsololarco/types';

import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { cn } from '@/src/utils/cn';

import Breadcrumb from '../../shared/Breadcrumb';
import Heading from '../../typography/Heading';
import Text from '../../typography/Text';
import ActionButtons from './ActionButtons';
import BandStats from './BandStats';
import BandTabs from './BandTabs';

export interface RepertoireHeaderProps {
  bands: Band[];
  stats: RepertoireStats;
  className?: string;
  // TODO: implement soon
  isAIOpen?: boolean;
  onAIToggle?: () => void;
}

export default function RepertoireHeader({
  bands,
  stats,
  // onAIToggle,
  // isAIOpen = false,
  className,
}: RepertoireHeaderProps) {
  const { activeBand } = useActiveBand();
  const t = useTranslations('pages');

  const isSpecificBandSelected = activeBand?.id && activeBand?.id !== 'solo';

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
        <BandStats stats={stats} />
        <ActionButtons />
      </div>

      {/* md and large screens */}
      <div className="pli-6 plb-5 bg-yellow-main bg-dots-subtle hidden items-center justify-between gap-4 md:flex">
        <div>
          <div className="mbe-1 tracking-widest">
            <Text className="text-danger-deep text-xs font-medium uppercase">
              {isSpecificBandSelected ? t('repertoire.bandRepertoire') : t('repertoire.title')}
            </Text>
          </div>
          <Heading
            className="text-primary-dark text-3xl leading-none font-bold tracking-tight uppercase"
            tag="h1"
          >
            {activeBand?.name}
          </Heading>
        </div>

        <BandStats stats={stats} />
        <ActionButtons />
      </div>
    </div>
  );
}
