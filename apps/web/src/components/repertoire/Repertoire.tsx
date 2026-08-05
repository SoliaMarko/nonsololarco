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
  if (isEmpty) {
    return (
      <div className="pli-4 flex grow items-center justify-center">
        <NoDataCard
          className="w-full max-w-md"
          title="Repertoire is empty"
          description="Add your first song — and it will appear in your setlist."
          action={
            <Button variant="retro-primary" className="bg-emerald-main">
              <span className="text-primary-light flex items-center gap-2">
                <PlusSolidIcon size={16} />
                <Text tag="span" className="text-sm font-medium text-inherit uppercase">New Track</Text>
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
