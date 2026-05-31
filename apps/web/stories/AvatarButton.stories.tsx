import type { Meta, StoryObj } from '@storybook/nextjs';

import AvatarButton from '@/src/components/ui/AvatarButton';

const meta = {
  title: 'UI/AvatarButton',
  component: AvatarButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Clickable Avatar wrapped in a button element for accessibility.',
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
} satisfies Meta<typeof AvatarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initials: 'OW',
    size: 'md',
    status: 'online',
    'aria-label': 'Open profile menu',
  },
};

export const WithImage: Story = {
  args: {
    initials: 'OW',
    size: 'md',
    status: 'online',
    src: 'https://images.pexels.com/photos/15722044/pexels-photo-15722044.jpeg',
    alt: 'Oscar',
    'aria-label': 'Open profile menu',
  },
};

export const AllStatuses: Story = {
  args: { initials: 'OW' },
  render: () => (
    <div className="flex items-end gap-6">
      {(['online', 'pause', 'away', 'long', 'inactive'] as const).map((status) => (
        <div key={status} className="flex flex-col items-center gap-2">
          <AvatarButton
            initials="OW"
            size="lg"
            status={status}
            aria-label={`Status: ${status}`}
            onClick={() => {
              alert('Avatar Clicked!');
            }}
          />
          <span className="text-label text-fg-tertiary">{status}</span>
        </div>
      ))}
    </div>
  ),
};
