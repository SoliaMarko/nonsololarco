import { useTranslations } from 'next-intl';

import InstrumentChip from '@/src/components/shared/InstrumentChip';
import { Instrument } from '@/src/lib/types/profile/profile.types';

import SectionHeader from '../../shared/SectionHeader';

interface InstrumentsSectionProps {
  instruments: Instrument[];
}

export default function InstrumentsSection({ instruments }: InstrumentsSectionProps) {
  const t = useTranslations('pages');

  return (
    <section>
      <SectionHeader className="mbe-4 sm:mbe-4" title={t('profile.instrumentsSection')} />
      <div className="flex flex-wrap gap-2">
        {instruments.map((instrument) => (
          <InstrumentChip key={instrument.kind} instrument={instrument} />
        ))}
      </div>
    </section>
  );
}
