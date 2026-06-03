import type { Meta, StoryObj } from '@storybook/nextjs';

import Badge from '@/src/components/ui/Badge';
import { CloseSolidIcon, PlusSolidIcon, ShareSolidIcon } from '@/src/icons/base';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Standalone badge for status labels, tags, and semantic markers. Supports Musical Pause status icons, semantic variants, custom icons, and sizes.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [undefined, 'emerald', 'yellow', 'neutral', 'danger'],
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'pause', 'away', 'long', 'inactive'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Online', status: 'online' },
};

export const AllStatuses: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(['online', 'pause', 'away', 'long', 'inactive'] as const).map((status) => (
        <Badge key={status} status={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          <span className="text-label text-fg-tertiary w-6">{size}</span>
          <Badge size={size} status="online">
            Online
          </Badge>
          <Badge size={size} status="pause">
            Pause
          </Badge>
          <Badge size={size} variant="emerald">
            Violin
          </Badge>
          <Badge size={size} variant="yellow">
            ✦ Featured
          </Badge>
          <Badge size={size} variant="neutral">
            Classical
          </Badge>
          <Badge size={size} variant="danger">
            Jazz
          </Badge>
        </div>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['online', 'pause', 'away', 'long', 'inactive'] as const).map((status) => (
          <Badge key={status} status={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(['emerald', 'yellow', 'neutral', 'danger'] as const).map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

export const IconPositions: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-label text-fg-tertiary w-16">start</span>
        <Badge variant="emerald" icon={PlusSolidIcon} iconPosition="start">
          Add
        </Badge>
        <Badge status="online" iconPosition="start">
          Online
        </Badge>
        <Badge variant="yellow" icon={ShareSolidIcon} iconPosition="start">
          Share
        </Badge>
        <Badge variant="danger" icon={CloseSolidIcon} iconPosition="start">
          Jazz
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-label text-fg-tertiary w-16">end</span>
        <Badge variant="emerald" icon={PlusSolidIcon} iconPosition="end">
          Add
        </Badge>
        <Badge status="online" iconPosition="end">
          Online
        </Badge>
        <Badge variant="yellow" icon={ShareSolidIcon} iconPosition="end">
          Share
        </Badge>
        <Badge variant="danger" icon={CloseSolidIcon} iconPosition="end">
          Jazz
        </Badge>
      </div>
    </div>
  ),
};
