import type { Meta, StoryObj } from '@storybook/nextjs';

import Divider from '@/src/components/Divider';

const meta: Meta<typeof Divider> = {
  title: 'UI/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A divider component with horizontal and vertical orientations, color variants, thickness options, and optional label support.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'emerald', 'danger'],
      description: 'Divider color variant',
    },
    thickness: {
      control: 'select',
      options: [1, 2, 4, 8],
      description: 'Divider thickness',
    },
    label: {
      control: 'text',
      description: 'Label text (horizontal only)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Baseline

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    color: 'secondary',
  },
};

// Orientations

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: () => (
    <div className="flex h-16 items-stretch">
      <span className="text-fg-secondary">Left</span>
      <Divider orientation="vertical" />
      <span className="text-fg-secondary">Right</span>
    </div>
  ),
};

// With Label

export const WithLabel: Story = {
  args: {
    orientation: 'horizontal',
    label: 'or',
  },
};

// All Colors

export const AllColors: Story = {
  args: { orientation: 'horizontal' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Divider orientation="horizontal" color="primary" label="primary" />
      <Divider orientation="horizontal" color="secondary" label="secondary" />
      <Divider orientation="horizontal" color="tertiary" label="tertiary" />
      <Divider orientation="horizontal" color="emerald" label="emerald" />
      <Divider orientation="horizontal" color="danger" label="danger" />
    </div>
  ),
};

// All Thicknesses

export const AllThicknesses: Story = {
  args: { orientation: 'horizontal' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Divider orientation="horizontal" thickness={1} label="thickness 1" />
      <Divider orientation="horizontal" thickness={2} label="thickness 2" />
      <Divider orientation="horizontal" thickness={4} label="thickness 4" />
      <Divider orientation="horizontal" thickness={8} label="thickness 8" />
    </div>
  ),
};

// Vertical All Thicknesses

export const VerticalAllThicknesses: Story = {
  args: { orientation: 'vertical' },
  render: () => (
    <div className="flex h-16 items-stretch gap-4">
      <Divider orientation="vertical" thickness={1} />
      <Divider orientation="vertical" thickness={2} />
      <Divider orientation="vertical" thickness={4} />
      <Divider orientation="vertical" thickness={8} />
    </div>
  ),
};

// Danger

export const Danger: Story = {
  args: {
    orientation: 'horizontal',
    color: 'danger',
    label: 'dangerous',
  },
};
