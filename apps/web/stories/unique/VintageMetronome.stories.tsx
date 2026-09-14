import type { Meta, StoryObj } from '@storybook/nextjs';

import VintageMetronome from '@/src/illustrations/metronome/VintageMetronome';

const meta = {
  title: 'Unique/VintageMetronome',
  component: VintageMetronome,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Vintage wooden metronome. `detailed` is the full instrument for hero and empty-state use; `compact` drops the engraved scale, numerals, grain and key plate so the silhouette survives at button size. Hover or tab to it to start the swing.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['detailed', 'compact'] },
    height: { control: { type: 'range', min: 24, max: 320, step: 4 } },
    beatSeconds: { control: { type: 'range', min: 0.2, max: 2, step: 0.05 } },
    isSwinging: { control: 'boolean' },
    title: { control: 'text' },
  },
} satisfies Meta<typeof VintageMetronome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Detailed: Story = {
  args: { height: 268, variant: 'detailed', title: 'Metronome' },
  parameters: {
    docs: { description: { story: 'Hover to start the pendulum.' } },
  },
};

export const Compact: Story = {
  args: { height: 120, variant: 'compact', title: 'Metronome' },
};

export const Swinging: Story = {
  args: { height: 268, variant: 'detailed', isSwinging: true, title: 'Metronome' },
  parameters: {
    docs: {
      description: {
        story: 'With `isSwinging` the arm runs continuously, ignoring hover.',
      },
    },
  },
};

export const Tempos: Story = {
  args: { height: 180 },
  render: () => (
    <div className="flex items-end gap-10">
      {[
        { beatSeconds: 1.2, label: 'Largo' },
        { beatSeconds: 0.7, label: 'Allegro' },
        { beatSeconds: 0.35, label: 'Presto' },
      ].map(({ beatSeconds, label }) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <VintageMetronome beatSeconds={beatSeconds} height={180} isSwinging />
          <span className="text-label text-fg-tertiary">{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const ButtonSizes: Story = {
  args: { height: 40, variant: 'compact' },
  render: () => (
    <div className="flex items-end gap-8">
      {[26, 34, 40, 56].map((height) => (
        <div key={height} className="flex flex-col items-center gap-3">
          <VintageMetronome height={height} variant="compact" />
          <span className="text-label text-fg-tertiary">{height}px</span>
        </div>
      ))}
    </div>
  ),
};

export const VariantComparison: Story = {
  args: { height: 160 },
  render: () => (
    <div className="flex items-end gap-12">
      {(['detailed', 'compact'] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-3">
          <VintageMetronome height={160} variant={variant} />
          <span className="text-label text-fg-tertiary">{variant}</span>
        </div>
      ))}
    </div>
  ),
};
