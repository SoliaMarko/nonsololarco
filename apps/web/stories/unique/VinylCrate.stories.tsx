import type { Meta, StoryObj } from '@storybook/nextjs';

import VinylCrate, { VinylCrateBar } from '@/src/illustrations/vinyl-crate';

const meta = {
  title: 'Unique/VinylCrate',
  component: VinylCrate,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A crate of vinyl records with animated colour dots. On hover the dots scan up and down; with `isPlaying` they animate continuously — used as the "All Repertoires" tab icon.',
      },
    },
  },
  argTypes: {
    isPlaying: { control: 'boolean' },
    speed: { control: { type: 'range', min: 0.5, max: 5, step: 0.1 } },
    cycleMs: { control: { type: 'range', min: 1000, max: 8000, step: 100 } },
    width: { control: { type: 'range', min: 16, max: 120, step: 4 } },
    height: { control: { type: 'range', min: 16, max: 160, step: 4 } },
  },
} satisfies Meta<typeof VinylCrate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 24,
    height: 32,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover the crate to animate the dots — they scan up and down each record.',
      },
    },
  },
};

export const Playing: Story = {
  args: {
    width: 24,
    height: 32,
    isPlaying: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Continuous animation for the active "All Repertoires" tab state.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-8">
      {([16, 24, 32, 48, 64, 96] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <VinylCrate width={size} height={Math.round(size * 1.33)} isPlaying />
          <span className="text-fg-tertiary font-mono text-[10px]">{size}px</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Scales proportionally — height is ~1.33× width to match the viewBox ratio.',
      },
    },
  },
};

export const CustomBars: Story = {
  render: () => {
    const variants: { bars: VinylCrateBar[]; label: string }[] = [
      {
        label: 'Default',
        bars: [
          { color: '#8aa06b', tall: false },
          { color: '#b24b3a', tall: true },
          { color: '#e0a92e', tall: false },
        ],
      },
      {
        label: 'Teal',
        bars: [
          { color: '#22B79a', tall: true },
          { color: '#3b82e0', tall: false },
          { color: '#22B79a', tall: true },
        ],
      },
      {
        label: 'Warm',
        bars: [
          { color: '#e0a92e', tall: false },
          { color: '#b24b3a', tall: true },
          { color: '#e0a92e', tall: false },
        ],
      },
      {
        label: '4 bars',
        bars: [
          { color: '#8aa06b', tall: false },
          { color: '#b24b3a', tall: true },
          { color: '#e0a92e', tall: false },
          { color: '#22B79a', tall: true },
        ],
      },
    ];

    return (
      <div className="flex flex-wrap items-end justify-center gap-8">
        {variants.map(({ label, bars }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <VinylCrate bars={bars} width={32} height={42} isPlaying />
            <span className="text-fg-tertiary font-mono text-[10px]">{label}</span>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom bar colours and tall/short variants — the crate adapts to any number of records.',
      },
    },
  },
};

export const SpeedVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-8">
      {([0.5, 1, 1.8, 3, 5] as const).map((speed) => (
        <div key={speed} className="flex flex-col items-center gap-2">
          <VinylCrate width={24} height={32} isPlaying speed={speed} />
          <span className="text-fg-tertiary font-mono text-[10px]">×{speed}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Speed multiplier — 1.8 is the default, feels natural in the tab bar.',
      },
    },
  },
};
