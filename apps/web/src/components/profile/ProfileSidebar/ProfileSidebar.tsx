import { MOCK_SIDEBAR } from '@/src/data/profile/sidebar.mock';
import { cn } from '@/src/lib/ui/utils/cn';

import InstrumentChip from '../../shared/InstrumentChip';
import SectionHeader from '../shared/SectionHeader';
import AchievementBadge from './AchievementBadge';
import BandRow from './BandRow';

interface ProfileSidebarProps {
  className?: string;
}

export default function ProfileSidebar({ className }: ProfileSidebarProps) {
  const { instruments, bands, achievements } = MOCK_SIDEBAR;

  return (
    <div className={cn('flex flex-col gap-6 p-6', className)}>
      {/* Instruments */}
      <section>
        <SectionHeader className="mbe-3" title="Instruments" />
        <div className="flex flex-wrap gap-2">
          {instruments.map((instrument) => (
            <InstrumentChip key={instrument.kind} instrument={instrument} />
          ))}
        </div>
      </section>

      {/* Bands */}
      {bands.length > 0 ? (
        <section>
          <SectionHeader className="mbe-3" title="Bands" />
          <div className="flex flex-col gap-4">
            {bands.map((band) => (
              <BandRow key={band.id} band={band} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Achievements */}
      {achievements.length > 0 ? (
        <section>
          <SectionHeader className="mbe-3" title="Achievements" />
          <div className="flex flex-wrap gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
