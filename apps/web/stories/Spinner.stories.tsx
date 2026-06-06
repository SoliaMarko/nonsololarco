import type { Meta, StoryObj } from '@storybook/nextjs';

import Button from '@/src/components/ui/Button/Button';
import Spinner from '@/src/components/ui/Spinner/Spinner';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Arco signature loading indicator — 4 musical notes bouncing in a wave. Pure CSS animation, no JS.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
    color: {
      control: 'select',
      options: [undefined, 'emerald', 'muted', 'primaryLight', 'yellow'],
    },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'md', color: 'emerald' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <Spinner size={size} />
          <span className="text-label text-fg-tertiary">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {(['emerald', 'yellow', 'muted'] as const).map((color) => (
        <div key={color} className="flex flex-col items-center gap-3">
          <Spinner color={color} />
          <span className="text-label text-fg-tertiary">{color}</span>
        </div>
      ))}
      <div className="bg-emerald-main flex flex-col items-center gap-3 rounded-lg p-3">
        <Spinner color="primaryLight" />
        <span className="text-label text-primary-light">primaryLight</span>
      </div>
    </div>
  ),
};

export const InButtonPrimary: Story = {
  render: () => (
    <Button variant="primary" size="md" isLoading>
      Saving
    </Button>
  ),
};

export const InButtonGhost: Story = {
  render: () => (
    <Button variant="ghost" size="md" isLoading>
      Loading
    </Button>
  ),
};

export const PageLoading: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" color="emerald" />
      <span className="text-caption text-fg-tertiary">Loading musicians...</span>
    </div>
  ),
};
