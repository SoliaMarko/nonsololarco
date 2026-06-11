import { ReactNode, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  ArrowLeftSolidIcon,
  ArrowRightSolidIcon,
  BellIcon,
  CalendarIcon,
  ChatOutlineIcon,
  ChatSolidIcon,
  CheckSolidIcon,
  ChevronIcon,
  CloseSolidIcon,
  DisconnectOutlineIcon,
  DisconnectSolidIcon,
  DotsIcon,
  HomeOutlineIcon,
  HomeSolidIcon,
  LogOutIcon,
  MoonOutlineIcon,
  PlusSolidIcon,
  ProfileOutlineIcon,
  ProfileSolidIcon,
  RepertoireIcon,
  SearchOutlineIcon,
  SearchSolidIcon,
  SettingsOutlineIcon,
  SettingsSolidIcon,
  ShareOutlineIcon,
  ShareSolidIcon,
  SunOutlineIcon,
} from '@/src/icons/base';
import { BouquetIcon, FireIcon, MusicPlantIcon, PianoKeysIcon } from '@/src/icons/colorful';
import {
  EighthRestIcon,
  HalfRestIcon,
  OnlineIcon,
  QuarterRestIcon,
  WholeRestIcon,
} from '@/src/icons/status';
import { cn } from '@/src/lib/ui/utils/cn';

const meta: Meta = {
  title: 'Icons',
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: [16, 20, 24, 32, 48, 64],
      description: 'Icon size in px',
    },
    color: {
      control: { type: 'color' },
      description: 'Icon color (currentColor)',
    },
  },
  args: {
    size: 24,
    color: 'var(--text-primary)',
  },
};

export default meta;

interface IconCardProps {
  children: ReactNode;
  color: string;
  copiedLabel: string | null;
  copyText: string;
  label: string;
  onCopy: (label: string, copyText: string) => void;
  size: string;
}

function IconCard({ label, copyText, size, color, copiedLabel, onCopy, children }: IconCardProps) {
  const isCopied = copiedLabel === label;

  return (
    <button
      onClick={() => onCopy(label, copyText)}
      title={`Copy: ${copyText}`}
      style={{ color: isCopied ? undefined : color }}
      className={cn(
        'pli-3 h-full w-full cursor-pointer rounded-md pbs-5 pbe-3.5',
        'font-mono transition-all duration-150',
        isCopied
          ? 'border-emerald-main bg-emerald-subtle text-emerald-light border'
          : 'border-elevated bg-card hover:bg-elevated border',
      )}
    >
      <div className="flex flex-col justify-between gap-3">
        <span className="flex items-center justify-center">
          {isCopied ? <CheckSolidIcon size={size} /> : children}
        </span>
        <span
          className={cn(
            'text-label w-full text-center text-sm leading-tight break-all transition-colors duration-150',
            isCopied ? 'text-emerald-main' : 'text-fg-tertiary',
          )}
        >
          {isCopied ? 'Copied!' : label}
        </span>
      </div>
    </button>
  );
}

interface SectionProps {
  children: ReactNode;
  title: string;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mbe-8">
      <h3 className="text-label text-fg-tertiary mbe-4 font-mono font-semibold tracking-widest uppercase">
        {title}
      </h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2">{children}</div>
    </div>
  );
}

function IconGallery({ size, color }: { color: string; size: string }) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = async (label: string, copyText: string) => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(null), 1500);
    } catch {
      // clipboard not available — silently ignore in Storybook context
    }
  };

  const toJsx = (name: string, props?: string) => (props ? `<${name} ${props}/>` : `<${name} />`);

  const cardProps = { size, color, copiedLabel, onCopy: handleCopy };

  return (
    <div className="p-2">
      <Section title="Navigation">
        <IconCard label="HomeOutlineIcon" copyText={toJsx('HomeOutlineIcon')} {...cardProps}>
          <HomeOutlineIcon size={size} />
        </IconCard>
        <IconCard label="HomeSolidIcon" copyText={toJsx('HomeSolidIcon')} {...cardProps}>
          <HomeSolidIcon size={size} />
        </IconCard>
        <IconCard label="ChatOutlineIcon" copyText={toJsx('ChatOutlineIcon')} {...cardProps}>
          <ChatOutlineIcon size={size} />
        </IconCard>
        <IconCard label="ChatSolidIcon" copyText={toJsx('ChatSolidIcon')} {...cardProps}>
          <ChatSolidIcon size={size} />
        </IconCard>
        <IconCard label="ProfileOutlineIcon" copyText={toJsx('ProfileOutlineIcon')} {...cardProps}>
          <ProfileOutlineIcon size={size} />
        </IconCard>
        <IconCard label="ProfileSolidIcon" copyText={toJsx('ProfileSolidIcon')} {...cardProps}>
          <ProfileSolidIcon size={size} />
        </IconCard>
        <IconCard label="SearchOutlineIcon" copyText={toJsx('SearchOutlineIcon')} {...cardProps}>
          <SearchOutlineIcon size={size} />
        </IconCard>
        <IconCard label="SearchSolidIcon" copyText={toJsx('SearchSolidIcon')} {...cardProps}>
          <SearchSolidIcon size={size} />
        </IconCard>
        <IconCard label="RepertoireIcon" copyText={toJsx('RepertoireIcon')} {...cardProps}>
          <RepertoireIcon size={size} />
        </IconCard>
        <IconCard label="CalendarIcon" copyText={toJsx('CalendarIcon')} {...cardProps}>
          <CalendarIcon size={size} />
        </IconCard>
        <IconCard label="BellIcon" copyText={toJsx('BellIcon')} {...cardProps}>
          <BellIcon size={size} />
        </IconCard>
      </Section>

      <Section title="Actions">
        <IconCard label="PlusSolidIcon" copyText={toJsx('PlusSolidIcon')} {...cardProps}>
          <PlusSolidIcon size={size} />
        </IconCard>
        <IconCard label="CloseSolidIcon" copyText={toJsx('CloseSolidIcon')} {...cardProps}>
          <CloseSolidIcon size={size} />
        </IconCard>
        <IconCard label="CheckSolidIcon" copyText={toJsx('CheckSolidIcon')} {...cardProps}>
          <CheckSolidIcon size={size} />
        </IconCard>
        <IconCard label="ShareOutlineIcon" copyText={toJsx('ShareOutlineIcon')} {...cardProps}>
          <ShareOutlineIcon size={size} />
        </IconCard>
        <IconCard label="ShareSolidIcon" copyText={toJsx('ShareSolidIcon')} {...cardProps}>
          <ShareSolidIcon size={size} />
        </IconCard>
        <IconCard label="ArrowLeftSolidIcon" copyText={toJsx('ArrowLeftSolidIcon')} {...cardProps}>
          <ArrowLeftSolidIcon size={size} />
        </IconCard>
        <IconCard
          label="ArrowRightSolidIcon"
          copyText={toJsx('ArrowRightSolidIcon')}
          {...cardProps}
        >
          <ArrowRightSolidIcon size={size} />
        </IconCard>
      </Section>

      <Section title="Settings & Account">
        <IconCard
          label="SettingsOutlineIcon"
          copyText={toJsx('SettingsOutlineIcon')}
          {...cardProps}
        >
          <SettingsOutlineIcon size={size} />
        </IconCard>
        <IconCard label="SettingsSolidIcon" copyText={toJsx('SettingsSolidIcon')} {...cardProps}>
          <SettingsSolidIcon size={size} />
        </IconCard>
        <IconCard
          label="DisconnectOutlineIcon"
          copyText={toJsx('DisconnectOutlineIcon')}
          {...cardProps}
        >
          <DisconnectOutlineIcon size={size} />
        </IconCard>
        <IconCard
          label="DisconnectSolidIcon"
          copyText={toJsx('DisconnectSolidIcon')}
          {...cardProps}
        >
          <DisconnectSolidIcon size={size} />
        </IconCard>
        <IconCard label="LogOutIcon" copyText={toJsx('LogOutIcon')} {...cardProps}>
          <LogOutIcon size={size} />
        </IconCard>
      </Section>

      <Section title="Theme">
        <IconCard label="SunOutlineIcon" copyText={toJsx('SunOutlineIcon')} {...cardProps}>
          <SunOutlineIcon size={size} />
        </IconCard>
        <IconCard label="MoonOutlineIcon" copyText={toJsx('MoonOutlineIcon')} {...cardProps}>
          <MoonOutlineIcon size={size} />
        </IconCard>
      </Section>

      <Section title="Direction-based">
        <IconCard
          label="Chevron down"
          copyText={toJsx('ChevronIcon', 'direction="down"')}
          {...cardProps}
        >
          <ChevronIcon size={size} direction="down" />
        </IconCard>
        <IconCard
          label="Chevron up"
          copyText={toJsx('ChevronIcon', 'direction="up"')}
          {...cardProps}
        >
          <ChevronIcon size={size} direction="up" />
        </IconCard>
        <IconCard
          label="Chevron right"
          copyText={toJsx('ChevronIcon', 'direction="right"')}
          {...cardProps}
        >
          <ChevronIcon size={size} direction="right" />
        </IconCard>
        <IconCard
          label="Chevron left"
          copyText={toJsx('ChevronIcon', 'direction="left"')}
          {...cardProps}
        >
          <ChevronIcon size={size} direction="left" />
        </IconCard>
        <IconCard
          label="Dots vertical"
          copyText={toJsx('DotsIcon', 'direction="vertical"')}
          {...cardProps}
        >
          <DotsIcon size={size} direction="vertical" />
        </IconCard>
        <IconCard
          label="Dots horizontal"
          copyText={toJsx('DotsIcon', 'direction="horizontal"')}
          {...cardProps}
        >
          <DotsIcon size={size} direction="horizontal" />
        </IconCard>
      </Section>

      <Section title="Colorful">
        <IconCard label="BouquetIcon" copyText={toJsx('BouquetIcon')} {...cardProps} size="64">
          <BouquetIcon size="64" />
        </IconCard>
        <IconCard label="FireIcon" copyText={toJsx('FireIcon')} {...cardProps} size="64">
          <FireIcon size="64" />
        </IconCard>
        <IconCard
          label="MusicPlantIcon"
          copyText={toJsx('MusicPlantIcon')}
          {...cardProps}
          size="64"
        >
          <MusicPlantIcon size="64" />
        </IconCard>
        <IconCard label="PianoKeysIcon" copyText={toJsx('PianoKeysIcon')} {...cardProps} size="64">
          <PianoKeysIcon size="64" />
        </IconCard>
      </Section>

      <Section title="Status">
        <IconCard label="OnlineIcon" copyText={toJsx('OnlineIcon')} {...cardProps} size="36">
          <OnlineIcon size="36" />
        </IconCard>
        <IconCard
          label="EighthRestIcon"
          copyText={toJsx('EighthRestIcon')}
          {...cardProps}
          size="36"
        >
          <EighthRestIcon size="36" />
        </IconCard>
        <IconCard
          label="QuarterRestIcon"
          copyText={toJsx('QuarterRestIcon')}
          {...cardProps}
          size="36"
        >
          <QuarterRestIcon size="36" />
        </IconCard>
        <IconCard label="HalfRestIcon" copyText={toJsx('HalfRestIcon')} {...cardProps} size="36">
          <HalfRestIcon size="36" />
        </IconCard>
        <IconCard label="WholeRestIcon" copyText={toJsx('WholeRestIcon')} {...cardProps} size="36">
          <WholeRestIcon size="36" />
        </IconCard>
      </Section>
    </div>
  );
}

type Story = StoryObj<{ color: string; size: string }>;

export const Gallery: Story = {
  render: (args) => <IconGallery {...args} />,
};
