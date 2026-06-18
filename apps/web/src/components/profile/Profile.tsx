import { MOCK_PROFILE, MOCK_PROFILE_MOMENTS } from '@/src/data/profile/profile.mock';

import ProfileHero from './ProfileHero';
import ProfileMoments from './ProfileMoments';
import ProfileRepertoire from './ProfileRepertoire';
import ProfileSidebar from './ProfileSidebar/ProfileSidebar';
import ProfileStats from './ProfileStats';

export default function Profile() {
  const profile = MOCK_PROFILE;
  const profileMoments = MOCK_PROFILE_MOMENTS;

  return (
    <>
      <ProfileHero profile={profile} />
      <ProfileStats profile={profile} />
      <div className="flex w-full flex-col-reverse md:flex-row md:items-start">
        <div className="border-border-primary bg-base flex flex-5 flex-col border-solid md:border-r-2">
          <ProfileMoments moments={profileMoments} />
          <ProfileRepertoire profileId={profile.id} />
        </div>
        <ProfileSidebar className="bg-base border-border-primary flex-2 border-b-2 md:order-last md:w-64 md:border-none md:bg-inherit" />
      </div>
    </>
  );
}
