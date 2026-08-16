import { useTranslations } from 'next-intl';

import { Band } from '@/src/lib/types/profile/profile.types';

import SectionHeader from '../../shared/SectionHeader';
import BandRow from './BandRow';

interface BandsSectionProps {
  bands: Band[];
}

export default function BandsSection({ bands }: BandsSectionProps) {
  const t = useTranslations('pages');

  return (
    <section>
      <SectionHeader className="mbe-4 sm:mbe-4" title={t('profile.bandsSection')} />
      <div className="flex flex-col">
        {bands.map((band, index) => (
          <BandRow key={band.id} band={band} isLastItem={bands.length === index + 1} />
        ))}
      </div>
    </section>
  );
}
