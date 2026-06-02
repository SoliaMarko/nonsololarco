'use client';

import Heading from '@/src/components/typography/Heading';
import Button from '@/src/components/ui/Button';
import {
  ArrowRightSolidIcon,
  ChatOutlineIcon,
  ChatSolidIcon,
  CheckSolidIcon,
  CloseSolidIcon,
  HomeOutlineIcon,
  HomeSolidIcon,
  MoonOutlineIcon,
  PlusSolidIcon,
  ProfileOutlineIcon,
  ProfileSolidIcon,
  SearchOutlineIcon,
  SearchSolidIcon,
  ShareOutlineIcon,
  ShareSolidIcon,
  SunOutlineIcon,
} from '@/src/icons/base';
import ArrowLeftSolidIcon from '@/src/icons/base/ArrowLeftSolidIcon';
import { BouquetIcon, FireIcon, MusicPlantIcon, PianoKeysIcon } from '@/src/icons/colorful';
import {
  EighthRestIcon,
  HalfRestIcon,
  OnlineIcon,
  QuarterRestIcon,
  WholeRestIcon,
} from '@/src/icons/status';

export default function Home() {
  return (
    <div className="bg-card h-[50vh] rounded-md p-4">
      <div className="flex flex-col gap-2">
        <Button variant="outline">Primary</Button>

        <Heading tag="h1" color="highlight">
          NonSoloLarco
        </Heading>

        <div className="flex gap-2">
          <Button variant="primary" size="xl">
            <SunOutlineIcon size="24" />
          </Button>
          <Button variant="outline" size="xl">
            <MoonOutlineIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <HomeOutlineIcon size="24" />
          </Button>
          <Button variant="destructive" size="xl">
            <HomeSolidIcon size="24" />
          </Button>
          <Button variant="outline" size="xl">
            <SearchOutlineIcon size="24" />
          </Button>
          <Button variant="secondary" size="xl">
            <SearchSolidIcon size="24" />
          </Button>
          <Button variant="outline" size="xl">
            <FireIcon size="24" />
          </Button>
          <Button variant="outline" size="xl">
            <MusicPlantIcon size="24" />
          </Button>
          <Button variant="outline" size="xl">
            <OnlineIcon size="24" />
          </Button>
          <Button variant="secondary" size="xl">
            <BouquetIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <ChatOutlineIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <ChatSolidIcon className="text-inherit" size="24" />
          </Button>
          <Button variant="secondary" size="xl">
            <ChatSolidIcon
              className="text-card [--icon-content-color:var(--color-danger)]"
              size="24"
            />
          </Button>
          <Button variant="ghost" size="xl">
            <ProfileOutlineIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <ProfileSolidIcon size="24" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="xl">
            <ShareOutlineIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <ShareSolidIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <ArrowRightSolidIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <ArrowLeftSolidIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <CloseSolidIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <PlusSolidIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <CheckSolidIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <PianoKeysIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <QuarterRestIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <EighthRestIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <HalfRestIcon size="24" />
          </Button>
          <Button variant="ghost" size="xl">
            <WholeRestIcon size="24" />
          </Button>
        </div>
        <div className="flex gap-2"></div>
        <div className="flex gap-2"></div>
      </div>
    </div>
  );
}
