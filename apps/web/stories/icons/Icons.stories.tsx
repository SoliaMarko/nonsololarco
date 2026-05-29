import { ReactNode, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import { cn } from '@/lib/ui/utils/cn';
// base
import ArrowLeftSolidIcon from '@/src/icons/base/ArrowLeftSolidIcon';
import ArrowRightSolidIcon from '@/src/icons/base/ArrowRightSolidIcon';
import ChatOutlineIcon from '@/src/icons/base/ChatOutlineIcon';
import ChatSolidIcon from '@/src/icons/base/ChatSolidIcon';
import CheckSolidIcon from '@/src/icons/base/CheckSolidIcon';
import CloseSolidIcon from '@/src/icons/base/CloseSolidIcon';
import HomeOutlineIcon from '@/src/icons/base/HomeOutlineIcon';
import HomeSolidIcon from '@/src/icons/base/HomeSolidIcon';
import MoonOutlineIcon from '@/src/icons/base/MoonOutlineIcon';
import PlusSolidIcon from '@/src/icons/base/PlusSolidIcon';
import ProfileOutlineIcon from '@/src/icons/base/ProfileOutlineIcon';
import ProfileSolidIcon from '@/src/icons/base/ProfileSolidIcon';
import SearchOutlineIcon from '@/src/icons/base/SearchOutlineIcon';
import SearchSolidIcon from '@/src/icons/base/SearchSolidIcon';
import ShareOutlineIcon from '@/src/icons/base/ShareOutlineIcon';
import ShareSolidIcon from '@/src/icons/base/ShareSolidIcon';
import SunOutlineIcon from '@/src/icons/base/SunOutlineIcon';
// colorful
import BouquetIcon from '@/src/icons/colorful/BouquetIcon';
import FireIcon from '@/src/icons/colorful/FireIcon';
import MusicPlantIcon from '@/src/icons/colorful/MusicPlantIcon';
import PianoKeysIcon from '@/src/icons/colorful/PianoKeysIcon';
// status
import OnlineIcon from '@/src/icons/status/OnlineIcon';

const meta: Meta = {
  title: 'Components/Icons',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['16', '20', '24', '32', '48', '64'],
      description: 'Icon size in px',
    },
    color: {
      control: { type: 'color' },
      description: 'Icon color (currentColor)',
    },
  },
  args: {
    size: '24',
    color: 'var(--text-primary)',
  },
};

export default meta;

// IconCard

interface IconCardProps {
  children: ReactNode;
  color: string;
  copiedLabel: string | null;
  label: string;
  onCopy: (label: string) => void;
  size: string;
}

function IconCard({ label, size, color, copiedLabel, onCopy, children }: IconCardProps) {
  const isCopied = copiedLabel === label;

  return (
    <button
      onClick={() => onCopy(label)}
      title={`Copy "${label}"`}
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

// Section

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

// Gallery

function IconGallery({ size, color }: { color: string; size: string }) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = async (label: string) => {
    try {
      await navigator.clipboard.writeText(label);
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(null), 1500);
    } catch {
      // clipboard not available — silently ignore in Storybook context
    }
  };

  const cardProps = { size, color, copiedLabel, onCopy: handleCopy };

  return (
    <div className="p-2">
      <Section title="Base — Outline">
        <IconCard label="ChatOutlineIcon" {...cardProps}>
          <ChatOutlineIcon size={size} />
        </IconCard>
        <IconCard label="HomeOutlineIcon" {...cardProps}>
          <HomeOutlineIcon size={size} />
        </IconCard>
        <IconCard label="MoonOutlineIcon" {...cardProps}>
          <MoonOutlineIcon size={size} />
        </IconCard>
        <IconCard label="ProfileOutlineIcon" {...cardProps}>
          <ProfileOutlineIcon size={size} />
        </IconCard>
        <IconCard label="SearchOutlineIcon" {...cardProps}>
          <SearchOutlineIcon size={size} />
        </IconCard>
        <IconCard label="ShareOutlineIcon" {...cardProps}>
          <ShareOutlineIcon size={size} />
        </IconCard>
        <IconCard label="SunOutlineIcon" {...cardProps}>
          <SunOutlineIcon size={size} />
        </IconCard>
      </Section>

      <Section title="Base — Solid">
        <IconCard label="ArrowLeftSolidIcon" {...cardProps}>
          <ArrowLeftSolidIcon size={size} />
        </IconCard>
        <IconCard label="ArrowRightSolidIcon" {...cardProps}>
          <ArrowRightSolidIcon size={size} />
        </IconCard>
        <IconCard label="ChatSolidIcon" {...cardProps}>
          <ChatSolidIcon className="[--icon-content-color:var(--color-danger)]" size={size} />
        </IconCard>
        <IconCard label="CheckSolidIcon" {...cardProps}>
          <CheckSolidIcon size={size} />
        </IconCard>
        <IconCard label="CloseSolidIcon" {...cardProps}>
          <CloseSolidIcon size={size} />
        </IconCard>
        <IconCard label="HomeSolidIcon" {...cardProps}>
          <HomeSolidIcon size={size} />
        </IconCard>
        <IconCard label="PlusSolidIcon" {...cardProps}>
          <PlusSolidIcon size={size} />
        </IconCard>
        <IconCard label="ProfileSolidIcon" {...cardProps}>
          <ProfileSolidIcon size={size} />
        </IconCard>
        <IconCard label="SearchSolidIcon" {...cardProps}>
          <SearchSolidIcon size={size} />
        </IconCard>
        <IconCard label="ShareSolidIcon" {...cardProps}>
          <ShareSolidIcon size={size} />
        </IconCard>
      </Section>

      <Section title="Colorful">
        <IconCard label="BouquetIcon" {...cardProps} size="64">
          <BouquetIcon size="64" />
        </IconCard>
        <IconCard label="FireIcon" {...cardProps} size="64">
          <FireIcon size="64" />
        </IconCard>
        <IconCard label="MusicPlantIcon" {...cardProps} size="64">
          <MusicPlantIcon size="64" />
        </IconCard>
        <IconCard label="PianoKeysIcon" {...cardProps} size="64">
          <PianoKeysIcon size="64" />
        </IconCard>
      </Section>

      <Section title="Status">
        <IconCard label="OnlineIcon" {...cardProps} size="36">
          <OnlineIcon size="36" />
        </IconCard>
      </Section>
    </div>
  );
}

// Story

type Story = StoryObj<{ color: string; size: string }>;

export const Gallery: Story = {
  render: (args) => <IconGallery {...args} />,
};
