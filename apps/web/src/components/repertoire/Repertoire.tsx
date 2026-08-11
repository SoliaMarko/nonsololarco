import { useTranslations } from 'next-intl';

import { Band, RepertoireStats } from '@nonsololarco/types';

import Text from '@/src/components/typography/Text';
import Button from '@/src/components/ui/Button';
import { PlusSolidIcon } from '@/src/icons/base';

import NoDataCard from '../shared/NoDataCard';
import RepertoireFilterBar from './RepertoireFilterBar';
import RepertoireHeader from './RepertoireHeader';
import TracksTable from './TracksTable';

export interface RepertoireProps {
  bands: Band[];
  isEmpty: boolean;
  stats: RepertoireStats;
}

export default function Repertoire({ bands, isEmpty, stats }: RepertoireProps) {
  const t = useTranslations('pages');

  if (isEmpty) {
    return (
      <div className="pli-4 flex grow items-center justify-center">
        <NoDataCard
          className="w-full max-w-md"
          title={t('repertoire.emptyTitle')}
          description={t('repertoire.emptyDescription')}
          action={
            <Button variant="retro-primary" className="bg-emerald-main">
              <span className="text-primary-light flex items-center gap-2">
                <PlusSolidIcon size={16} />
                <Text tag="span" className="text-sm font-medium text-inherit uppercase">
                  {t('repertoire.newTrackButton')}
                </Text>
              </span>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <RepertoireHeader bands={bands} stats={stats} onAIToggle={() => {}} />
      <RepertoireFilterBar />
      <TracksTable />
    </>
  );
}
