import type { Meta, StoryObj } from '@storybook/nextjs';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'retro-light',
      values: [
        { name: 'retro-light', value: '#F5F0E8' },
        { name: 'retro-dark', value: '#1A1713' },
      ],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const FeedActive: Story = {
  name: 'Feed — active',
  args: {
    activePath: '/',
    children: (
      <div className="border-border-primary bg-bg-surface text-text-muted rounded-lg border p-8 text-center text-sm">
        <Text>Feed Page Content</Text>
      </div>
    ),
  },
};

export const RepertoireActive: Story = {
  name: 'Repertoire — active',
  args: {
    activePath: '/repertoire',
    children: (
      <div className="border-border-primary bg-bg-surface text-text-muted rounded-lg border p-8 text-center text-sm">
        <Text>Repertoire Page Content</Text>
      </div>
    ),
  },
};

export const ChatWithBadge: Story = {
  name: 'Chat — with badge',
  args: {
    activePath: '/chat',
    children: (
      <div className="border-border-primary bg-bg-surface text-text-muted h-full rounded-lg border p-8 text-center text-sm">
        <Text>Chats Page Content</Text>
      </div>
    ),
  },
};
