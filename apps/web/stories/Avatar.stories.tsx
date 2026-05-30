import type { Meta, StoryObj } from '@storybook/nextjs';

import Avatar from '@/src/components/Avatar/Avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Avatar component with initials fallback, image support, and Musical Pause status badges.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'pause', 'away', 'long', 'inactive'],
    },
    initials: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default

export const Default: Story = {
  args: {
    initials: 'CB',
    size: 'md',
  },
};

// Sizes

export const Sizes: Story = {
  args: { initials: 'CB' },
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} initials="MS" size={size} />
      ))}
    </div>
  ),
};

//  WithStatus

export const WithStatus: Story = {
  args: { initials: 'CB', size: 'lg', status: 'online' },
};

// AllStatuses

export const AllStatuses: Story = {
  args: { initials: 'CB' },
  render: () => (
    <div className="flex items-end gap-6">
      {(['online', 'pause', 'away', 'long', 'inactive'] as const).map((status) => (
        <div key={status} className="flex flex-col items-center gap-2">
          <Avatar initials="CB" size="lg" status={status} />
          <span className="text-label text-fg-tertiary">{status}</span>
        </div>
      ))}
    </div>
  ),
};

// Offline

export const Offline: Story = {
  args: { initials: 'CB', size: 'lg' },
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} initials="MS" size={size} />
      ))}
    </div>
  ),
};

// WithImage

export const WithImage: Story = {
  args: {
    initials: 'CB',
    size: 'xl',
    src: 'https://images.pexels.com/photos/15722044/pexels-photo-15722044.jpeg',
    alt: 'May',
    status: 'online',
  },
};

//  Fallback

export const Fallback: Story = {
  args: { initials: 'CB' },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar initials="CB" size="lg" src="https://broken-url.xyz/404.jpg" />
        <span className="text-body text-fg-secondary">Broken image: initials fallback</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar initials="ОК" size="lg" />
        <span className="text-body text-fg-secondary">No src: initials fallback</span>
      </div>
    </div>
  ),
};

// AllSizesWithStatus

export const AllSizesWithImage: Story = {
  args: { initials: 'CB' },
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar
          key={size}
          initials="CB"
          size={size}
          status="pause"
          src="https://images.pexels.com/photos/15722044/pexels-photo-15722044.jpeg"
          alt="May"
        />
      ))}
    </div>
  ),
};
