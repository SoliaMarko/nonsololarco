import type { Meta, StoryObj } from '@storybook/nextjs';

import NavLink from '@/src/components/ui/NavLink';
import {
  CalendarIcon,
  ChatOutlineIcon,
  HomeOutlineIcon,
  ProfileOutlineIcon,
  RepertoireIcon,
} from '@/src/icons/base';

const meta: Meta<typeof NavLink> = {
  title: 'Navigation/NavLink',
  component: NavLink,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'retro',
      values: [
        { name: 'retro', value: '#F5F0E8' },
        { name: 'dark', value: '#221e19' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['desktop', 'mobile'],
    },
    isActive: { control: 'boolean' },
    badge: { control: { type: 'number', min: 0, max: 99 } },
  },
};

export default meta;
type Story = StoryObj<typeof NavLink>;

export const DesktopDefault: Story = {
  args: {
    href: '#',
    icon: HomeOutlineIcon,
    label: 'Feed',
    variant: 'desktop',
    isActive: false,
  },
};

export const DesktopActive: Story = {
  args: {
    href: '#',
    icon: HomeOutlineIcon,
    label: 'Feed',
    variant: 'desktop',
    isActive: true,
  },
};

export const DesktopWithBadge: Story = {
  args: {
    href: '#',
    icon: ChatOutlineIcon,
    label: 'Chats',
    variant: 'desktop',
    isActive: false,
    badge: 3,
  },
};

export const MobileDefault: Story = {
  args: {
    href: '#',
    icon: HomeOutlineIcon,
    label: 'Feed',
    variant: 'mobile',
    isActive: false,
  },
};

export const MobileActive: Story = {
  args: {
    href: '#',
    icon: RepertoireIcon,
    label: 'Repertoire',
    variant: 'mobile',
    isActive: true,
  },
};

export const MobileWithBadge: Story = {
  args: {
    href: '#',
    icon: ChatOutlineIcon,
    label: 'Chats',
    variant: 'mobile',
    isActive: false,
    badge: 3,
  },
};

export const AllLinksDesktop: Story = {
  name: 'All links — desktop navbar',
  render: () => (
    <nav className="border-border-primary pli-4 bg-surface flex items-end gap-1 border-b pbs-2">
      {[
        { href: '#', icon: HomeOutlineIcon, label: 'Feed', isActive: true },
        { href: '#', icon: RepertoireIcon, label: 'Repertoire', isActive: false },
        { href: '#', icon: CalendarIcon, label: 'Calendar', isActive: false },
        { href: '#', icon: ChatOutlineIcon, label: 'Chats', isActive: false, badge: 3 },
        { href: '#', icon: ProfileOutlineIcon, label: 'Profile', isActive: false },
      ].map((item) => (
        <NavLink key={item.label} variant="desktop" {...item} />
      ))}
    </nav>
  ),
};

export const AllLinksMobile: Story = {
  name: 'All links — mobile bottom nav',
  render: () => (
    <nav className="border-border-primary plb-1 bg-surface flex w-80 items-center justify-around border-t">
      {[
        { href: '#', icon: HomeOutlineIcon, label: 'Feed', isActive: true },
        { href: '#', icon: RepertoireIcon, label: 'Repertoire', isActive: false },
        { href: '#', icon: CalendarIcon, label: 'Calendar', isActive: false },
        { href: '#', icon: ChatOutlineIcon, label: 'Chats', isActive: false, badge: 3 },
        { href: '#', icon: ProfileOutlineIcon, label: 'Profile', isActive: false },
      ].map((item) => (
        <NavLink key={item.label} variant="mobile" {...item} />
      ))}
    </nav>
  ),
};
