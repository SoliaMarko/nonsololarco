import type { Meta, StoryObj } from '@storybook/nextjs';

import AvatarButton from '@/src/components/ui/AvatarButton';
import Button from '@/src/components/ui/Button/Button';
import Dropdown from '@/src/components/ui/Dropdown/Dropdown';
import { DotsIcon, LogOutIcon, ProfileOutlineIcon, SettingsOutlineIcon } from '@/src/icons/base';
import { BouquetIcon } from '@/src/icons/colorful';
import { OPTIONS_POSITION } from '@/src/lib/constants/common.const';

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Floating action menu built on Radix UI DropdownMenu. Items support onClick or href — mutually exclusive. Groups separated by dotted dividers.',
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfileMenu: Story = {
  args: {
    trigger: (
      <AvatarButton initials="SM" size="sm" status="online" aria-label="Open profile menu" />
    ),
    align: OPTIONS_POSITION.end,
    groups: [
      {
        items: [
          { label: 'View profile', href: '/profile/me' },
          { label: 'Settings', href: '/settings' },
          { label: 'Notifications', href: '/notifications' },
        ],
      },
      {
        items: [{ label: 'Sign out', onClick: () => {}, variant: 'danger' }],
      },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    trigger: <AvatarButton initials="SM" size="sm" aria-label="Open profile menu" />,
    align: OPTIONS_POSITION.end,
    groups: [
      {
        items: [
          { label: 'View profile', icon: ProfileOutlineIcon, href: '/profile/me' },
          { label: 'Settings', icon: SettingsOutlineIcon, href: '/settings' },
          { label: 'Notifications', icon: BouquetIcon, href: '/notifications' },
        ],
      },
      {
        items: [{ label: 'Sign out', icon: LogOutIcon, onClick: () => {}, variant: 'danger' }],
      },
    ],
  },
};

export const MusicianCardMenu: Story = {
  args: {
    trigger: (
      <Button variant="ghost" size="sm" aria-label="More actions">
        <DotsIcon size="16" />
      </Button>
    ),
    align: OPTIONS_POSITION.end,
    groups: [
      {
        items: [
          { label: 'View profile', href: '/profile/123' },
          { label: 'Send message', href: '/chat/123' },
          { label: 'Share profile', onClick: () => {} },
        ],
      },
      {
        items: [{ label: 'Disconnect', onClick: () => {}, variant: 'danger' }],
      },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    trigger: (
      <Button variant="outline" size="sm">
        Options
      </Button>
    ),
    groups: [
      {
        items: [
          { label: 'Edit profile', onClick: () => {} },
          { label: 'Export data', onClick: () => {}, disabled: true },
          { label: 'Upgrade to Pro', href: '/pricing' },
        ],
      },
      {
        items: [{ label: 'Delete account', onClick: () => {}, variant: 'danger' }],
      },
    ],
  },
};

export const StampVariant: Story = {
  args: {
    variant: 'stamp',
    trigger: (
      <Button variant="outline" size="sm">
        Options ▼
      </Button>
    ),
    align: OPTIONS_POSITION.end,
    groups: [
      {
        label: 'Sort by',
        items: [
          { label: 'Title', onClick: () => {}, selected: true },
          { label: 'Date added', onClick: () => {} },
          { label: 'BPM', onClick: () => {} },
        ],
      },
    ],
  },
};

export const Alignment: Story = {
  args: {
    trigger: (
      <Button variant="outline" size="sm">
        Menu
      </Button>
    ),
    groups: [{ items: [{ label: 'View profile', href: '/profile/me' }] }],
  },
  render: () => (
    <div className="flex items-center gap-8">
      {(['start', 'center', 'end'] as const).map((align) => (
        <div key={align} className="flex flex-col items-center gap-2">
          <Dropdown
            align={align}
            trigger={
              <Button variant="outline" size="sm">
                {align}
              </Button>
            }
            groups={[
              {
                items: [
                  { label: 'View profile', href: '/profile/me' },
                  { label: 'Settings', href: '/settings' },
                ],
              },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};
