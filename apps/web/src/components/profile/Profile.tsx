import { MOCK_PROFILE } from '@/src/data/profile.mock';

import ProfileHero from './ProfileHero';
import ProfileStats from './ProfileStats';

export default function Profile() {
  const profile = MOCK_PROFILE;

  return (
    <>
      <ProfileHero profile={profile} />
      <ProfileStats profile={profile} />
    </>
  );
}
