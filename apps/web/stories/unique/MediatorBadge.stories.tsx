import type { Meta, StoryObj } from '@storybook/nextjs';

import PickIcon from '@/src/illustrations/picks/MediatorBadge/MediatorBadge';
import { PickVariant } from '@/src/lib/types/illustrations/mediator-badge.types';

const meta = {
  title: 'Unique/PickIcon',
  component: PickIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Collectible Picks token with three rarity variants — gold, hologram (animated hue shift), and onyx (gold-bordered). Renders a 104×101 SVG scaled by `size`, with a subtle 3D wobble that can be disabled via `isStatic`.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['gold', 'hologram', 'onyx'],
    },
    size: { control: { type: 'range', min: 48, max: 200, step: 4 } },
    isStatic: { control: 'boolean' },
  },
} satisfies Meta<typeof PickIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'gold',
    size: 104,
  },
};

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The three rarity tiers side by side. Hologram cycles its hue; gold and onyx are static-colored.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-12">
      {(['gold', 'hologram', 'onyx'] as const satisfies readonly PickVariant[]).map((variant) => (
        <PickIcon key={variant} variant={variant} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-10">
      {([48, 64, 82, 104, 140] as const).map((size) => (
        <PickIcon key={size} variant="gold" size={size} />
      ))}
    </div>
  ),
};

export const Static: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Wobble disabled via `isStatic` — for static layouts or reduced-motion contexts.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-12">
      {(['gold', 'hologram', 'onyx'] as const satisfies readonly PickVariant[]).map((variant) => (
        <PickIcon key={variant} variant={variant} isStatic />
      ))}
    </div>
  ),
};
