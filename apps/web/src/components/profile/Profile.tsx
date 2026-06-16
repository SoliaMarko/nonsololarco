import { MOCK_PROFILE, MOCK_PROFILE_MOMENTS } from '@/src/data/profile.mock';

import ProfileHero from './ProfileHero';
import ProfileMoments from './ProfileMoments';
import ProfileStats from './ProfileStats';

export default function Profile() {
  const profile = MOCK_PROFILE;
  const profileMoments = MOCK_PROFILE_MOMENTS;

  return (
    <>
      <ProfileHero profile={profile} />
      <ProfileStats profile={profile} />
      <div className="flex">
        <ProfileMoments moments={profileMoments} />
      </div>
    </>
  );
}
