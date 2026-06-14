import { MOCK_PROFILE } from '@/src/data/profile.mock';
import DownloadIcon from '@/src/icons/base/DownloadIcon';
import EditIcon from '@/src/icons/base/EditIcon';
import LocationPinIcon from '@/src/icons/base/LocationPinIcon';
import MicrophoneIcon from '@/src/icons/base/MicrophoneIcon';
import UploadIcon from '@/src/icons/base/UploadIcon';
import { ProfileTag } from '@/src/lib/types/profile.types';

import Text from '../../typography/Text';
import Avatar from '../../ui/Avatar';
import Button from '../../ui/Button';

const TAG_ICON: Record<ProfileTag['icon'], React.ElementType> = {
  microphone: MicrophoneIcon,
  location: LocationPinIcon,
  instrument: MicrophoneIcon,
  genre: MicrophoneIcon,
};

export default function ProfileHero() {
  const profile = MOCK_PROFILE;

  return (
    <div className="bg-accent-dark-green bg-dots plb-8 pli-9 flex min-h-80 w-full flex-col items-center justify-center gap-6 text-white md:flex-row md:justify-between">
      <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:justify-start">
        <Avatar
          className="border-emerald-light text-accent-dark-green size-21 border-4 text-3xl shadow-[6px_6px_0px_0px_var(--color-primary-dark)] md:size-42 md:text-6xl"
          style={{ background: 'radial-gradient(circle at 30% 30%, #f5f0e8, #d8ede6)' }}
          initials={profile.initials}
        />
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Text className="text-yellow-main">MUSICIAN PROFILE · PORTFOLIO</Text>
          <Text className="text-primary-light text-3xl md:text-5xl">{profile.name}</Text>

          <div className="flex flex-row gap-3">
            {profile.tags.map((tag) => {
              const Icon = TAG_ICON[tag.icon];
              return (
                <div
                  key={tag.labels.join()}
                  className="border-emerald-light pli-2 flex flex-row items-center gap-1 border-2 border-solid"
                >
                  <Icon size={16} />
                  <div>{tag.labels.join(' · ')}</div>
                </div>
              );
            })}

            <Text
              className="text-emerald-light hover-fade hidden sm:block"
              style={{ animation: 'text-glow 0.8s ease-out 0.3s both' }}
            >
              on nonsololarco since {profile.memberSince}
            </Text>
          </div>

          <Text
            className="text-emerald-light hover-fade sm:hidden"
            style={{ animation: 'text-glow 0.8s ease-out 0.3s both' }}
          >
            on nonsololarco since {profile.memberSince}
          </Text>
        </div>
      </div>

      <div className="flex min-w-45 flex-row gap-4 md:flex-col">
        <Button
          className="plb-1 md:plb-3 bg-yellow-main text-primary-dark border-primary-dark -translate-x-0.5 -translate-y-0.5 justify-start rounded-none shadow-[2px_2px_0px_0px_var(--color-primary-dark)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_var(--color-primary-dark)] active:-translate-x-0.5 active:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--color-primary-dark)]"
          variant="press"
        >
          <div className="flex flex-row items-center gap-2">
            <DownloadIcon className="text-primary-dark" size={16} />
            <Text className="text-primary-dark text-sm sm:text-[1rem]">Export portfolio</Text>
          </div>
        </Button>

        <Button
          className="plb-1 md:plb-3 bg-primary-light text-primary-dark border-primary-dark -translate-x-0.5 -translate-y-0.5 justify-start rounded-none shadow-[2px_2px_0px_0px_var(--color-primary-dark)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_var(--color-primary-dark)] active:-translate-x-0.5 active:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--color-primary-dark)]"
          variant="press"
        >
          <div className="flex flex-row items-center gap-2">
            <UploadIcon className="text-primary-dark" size={16} />
            <Text className="text-primary-dark hidden capitalize sm:block">Share</Text>
          </div>
        </Button>

        <Button
          className="plb-1 md:plb-3 bg-primary-light text-primary-dark border-primary-dark -translate-x-0.5 -translate-y-0.5 justify-start rounded-none shadow-[2px_2px_0px_0px_var(--color-primary-dark)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_var(--color-primary-dark)] active:-translate-x-0.5 active:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--color-primary-dark)]"
          variant="press"
        >
          <div className="flex flex-row items-center gap-2">
            <EditIcon className="text-primary-dark" size={16} />
            <Text className="text-primary-dark hidden capitalize sm:block">Edit</Text>
          </div>
        </Button>
      </div>
    </div>
  );
}
