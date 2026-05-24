import type { Meta, StoryObj } from '@storybook/nextjs';

import Button from '@/src/Button';

// Minimal local icon example — replace with your actual icon component
const ChevronIcon = ({ size = 16, className = '' }: { className?: string; size?: number }) => (
  <svg
    className={className}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A polymorphic button component with multiple variants, sizes, icon support, and loading state.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline', 'destructive'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Baseline

export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

// All Variants

export const AllVariants: Story = {
  args: { children: '', variant: 'primary' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

// All Sizes

export const AllSizes: Story = {
  args: { children: '', variant: 'primary' },
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button variant="primary" size="xs">
        Extra Small
      </Button>
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
      <Button variant="primary" size="xl">
        Extra Large
      </Button>
    </div>
  ),
};

// With Icons

export const WithIconStart: Story = {
  args: {
    variant: 'primary',
    children: 'Continue',
    icon: ChevronIcon,
    iconPosition: 'start',
  },
};

export const WithIconEnd: Story = {
  args: {
    variant: 'outline',
    children: 'Continue',
    icon: ChevronIcon,
    iconPosition: 'end',
  },
};

export const IconSizes: Story = {
  args: { children: '', variant: 'primary' },
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button variant="primary" icon={ChevronIcon} iconPosition="end" size="xs">
        XS
      </Button>
      <Button variant="primary" icon={ChevronIcon} iconPosition="end" size="sm">
        SM
      </Button>
      <Button variant="primary" icon={ChevronIcon} iconPosition="end" size="md">
        MD
      </Button>
      <Button variant="primary" icon={ChevronIcon} iconPosition="end" size="lg">
        LG
      </Button>
      <Button variant="primary" icon={ChevronIcon} iconPosition="end" size="xl">
        XL
      </Button>
    </div>
  ),
};

// Loading

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Saving',
    isLoading: true,
  },
};

export const LoadingVariants: Story = {
  args: { children: '', variant: 'primary' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" isLoading>
        Primary
      </Button>
      <Button variant="secondary" isLoading>
        Secondary
      </Button>
      <Button variant="ghost" isLoading>
        Ghost
      </Button>
      <Button variant="outline" isLoading>
        Outline
      </Button>
      <Button variant="destructive" isLoading>
        Destructive
      </Button>
    </div>
  ),
};

// Disabled

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled',
    disabled: true,
  },
};

export const DisabledVariants: Story = {
  args: { children: '', variant: 'primary' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
    </div>
  ),
};

// Full Width

export const FullWidth: Story = {
  args: { children: '', variant: 'primary' },
  render: () => (
    <div className="w-72 flex flex-col gap-3">
      <Button variant="primary" className="w-full">
        Full Width Primary
      </Button>
      <Button variant="outline" icon={ChevronIcon} iconPosition="end" className="w-full">
        Full Width Outline
      </Button>
    </div>
  ),
};
