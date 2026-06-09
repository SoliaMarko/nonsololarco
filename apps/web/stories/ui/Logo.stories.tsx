import type { Meta, StoryObj } from '@storybook/nextjs';

import Logo from '@/src/components/ui/Logo/Logo';

const meta = {
  title: 'Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'nonsololarco brand logo. Three variants: mark (icon only), wordmark (icon + name), lockup (wordmark + subtitle). Adapts to dark/light theme.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['mark', 'wordmark', 'lockup'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    locale: {
      control: 'select',
      options: ['en', 'it', 'ua'],
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'wordmark', size: 'md' },
};

export const Mark: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Logo variant="mark" size={size} />
          <span className="text-label text-fg-tertiary">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Wordmark: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="text-label text-fg-tertiary w-6">{size}</span>
          <Logo variant="wordmark" size={size} />
        </div>
      ))}
    </div>
  ),
};

export const Lockup: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="text-label text-fg-tertiary w-6">{size}</span>
          <Logo variant="lockup" size={size} locale="en" />
        </div>
      ))}
    </div>
  ),
};

export const Locales: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-label text-fg-tertiary w-6">EN</span>
        <Logo variant="lockup" size="md" locale="en" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-label text-fg-tertiary w-6">IT</span>
        <Logo variant="lockup" size="md" locale="it" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-label text-fg-tertiary w-6">UA</span>
        <Logo variant="lockup" size="md" locale="ua" />
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div className="flex items-center gap-4">
        <span className="text-label text-fg-tertiary w-16">mark</span>
        <Logo variant="mark" size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-label text-fg-tertiary w-16">wordmark</span>
        <Logo variant="wordmark" size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-label text-fg-tertiary w-16">lockup EN</span>
        <Logo variant="lockup" size="md" locale="en" />
      </div>
    </div>
  ),
};
