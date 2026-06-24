import { MOCK_SIDEBAR } from '@/src/data/profile/sidebar.mock';
import { cn } from '@/src/lib/ui/utils/cn';

import AchievementsSection from './AchievementsSection';
import BandsSection from './BandsSection';
import InstrumentsSection from './InstrumentsSection/InstrumentsSection';

interface ProfileSidebarProps {
  className?: string;
}

export default function ProfileSidebar({ className }: ProfileSidebarProps) {
  const { instruments, bands, achievements } = MOCK_SIDEBAR;

  return (
    <div className={cn('flex flex-col gap-6 p-6', className)}>
      {/* Instruments */}
      <InstrumentsSection instruments={instruments} />

      {/* Bands */}
      {bands.length > 0 ? <BandsSection bands={bands} /> : null}

      {/* Achievements */}
      {achievements.length > 0 ? <AchievementsSection achievements={achievements} /> : null}
    </div>
  );
}
