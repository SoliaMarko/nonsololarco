import type { Meta, StoryObj } from '@storybook/nextjs';

import VinylRecord from '@/src/illustrations/vinyl/VinylRecord/VinylRecord';
import { VinylColor } from '@/src/lib/types/illustrations/vinyl-record.types';

const VINYL_COLORS = [
  'olive',
  'amber',
  'terracotta',
  'rust',
  'sage',
  'teal',
] as const satisfies readonly VinylColor[];

const meta = {
  title: 'Unique/VinylRecord',
  component: VinylRecord,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Vinyl disc illustration with two spin modes. By default it spins on hover via a RAF loop that preserves the rotation angle across hover sessions; with `isPlaying` it spins continuously through a CSS keyframe — for a "Now playing" widget.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: VINYL_COLORS,
    },
    size: { control: { type: 'range', min: 32, max: 200, step: 4 } },
    isPlaying: { control: 'boolean' },
  },
} satisfies Meta<typeof VinylRecord>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: 'olive',
    size: 56,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover the disc to spin it — the angle is preserved when you move off and back on.',
      },
    },
  },
};

export const Playing: Story = {
  args: {
    color: 'olive',
    size: 56,
    isPlaying: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Continuous CSS spin for the "Now playing" state.',
      },
    },
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {VINYL_COLORS.map((color) => (
        <VinylRecord key={color} color={color} isPlaying />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-8">
      {([32, 48, 72, 96, 120] as const).map((size) => (
        <VinylRecord key={size} color="olive" size={size} />
      ))}
    </div>
  ),
};
