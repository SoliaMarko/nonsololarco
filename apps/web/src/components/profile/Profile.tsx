import { MOCK_PROFILE, MOCK_PROFILE_MOMENTS } from '@/src/data/profile.mock';

import ProfileHero from './ProfileHero';
import ProfileMoments from './ProfileMoments';
import ProfileRepertoire from './ProfileRepertoire';
import ProfileStats from './ProfileStats';

export default function Profile() {
  const profile = MOCK_PROFILE;
  const profileMoments = MOCK_PROFILE_MOMENTS;

  return (
    <>
      <ProfileHero profile={profile} />
      <ProfileStats profile={profile} />
      <div className="flex flex-col">
        <ProfileMoments moments={profileMoments} />
        <ProfileRepertoire profileId={profile.id} />
      </div>
    </>
  );
}
