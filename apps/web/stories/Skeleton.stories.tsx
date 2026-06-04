import type { Meta, StoryObj } from '@storybook/nextjs';

import Card from '@/src/components/ui/Card/Card';
import Skeleton from '@/src/components/ui/Skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Loading placeholder with shimmer animation. Always aria-hidden. Adapts to dark/light theme via CSS tokens.',
      },
    },
  },
  argTypes: {
    rounded: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { width: 200, height: 16 },
};

export const Text: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="80%" />
      <Skeleton height={16} width="60%" />
    </div>
  ),
};

export const Avatar: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton width={48} height={48} rounded="full" />
      <div className="flex flex-col gap-2">
        <Skeleton width={120} height={14} />
        <Skeleton width={80} height={12} />
      </div>
    </div>
  ),
};

export const CardComposition: Story = {
  args: { children: '' },
  render: () => (
    <Card className="w-72 p-5">
      <div className="mb-3 flex items-start gap-3">
        <Skeleton width={48} height={48} rounded="full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} />
          <Skeleton width={64} height={20} rounded="full" />
        </div>
      </div>
      <div className="mb-3 flex gap-2">
        <Skeleton width={64} height={22} rounded="full" />
        <Skeleton width={56} height={22} rounded="full" />
        <Skeleton width={48} height={22} rounded="full" />
      </div>
      <Skeleton width="100%" height={1} className="mb-3" />
      <div className="flex gap-2">
        <Skeleton width="50%" height={32} rounded="md" />
        <Skeleton width="50%" height={32} rounded="md" />
      </div>
    </Card>
  ),
};

export const CustomSize: Story = {
  args: { width: 300, height: 120, rounded: 'lg' },
};
