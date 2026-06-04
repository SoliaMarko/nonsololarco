import type { Meta, StoryObj } from '@storybook/nextjs';

import Text from '@/src/components/typography/Text';
import AvatarButton from '@/src/components/ui/AvatarButton';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button/Button';
import Card from '@/src/components/ui/Card/Card';
import Divider from '@/src/components/ui/Divider/Divider';
import Skeleton from '@/src/components/ui/Skeleton';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Card is a layout primitive — no internal logic. Use it as a wrapper for any content.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'emerald', 'yellow', 'danger', 'ghost'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Text className="text-fg-tertiary">Card content goes here</Text>,
    variant: 'default',
  },
};

export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      {(['default', 'elevated', 'outlined', 'emerald', 'yellow', 'danger', 'ghost'] as const).map(
        (variant) => (
          <Card key={variant} variant={variant}>
            <Text className="text-body text-fg-secondary">{variant}</Text>
          </Card>
        ),
      )}
    </div>
  ),
};

export const VariantUseCases: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Card variant="emerald">
        <p className="text-body text-emerald-main font-medium">✓ Profile saved successfully</p>
        <p className="text-caption text-fg-tertiary">Your changes have been applied.</p>
      </Card>

      <Card variant="yellow">
        <p className="text-body text-yellow-muted font-medium">✦ Featured musician</p>
        <p className="text-caption text-fg-tertiary">Upgrade to Pro to appear in search.</p>
      </Card>

      <Card variant="danger">
        <p className="text-body text-danger font-medium">Remove connection</p>
        <p className="text-caption text-fg-tertiary">This action cannot be undone.</p>
      </Card>

      <Card variant="ghost">
        <p className="text-body text-fg-disabled text-center">Drop content here</p>
      </Card>
    </div>
  ),
};

export const MusicianCard: Story = {
  args: { children: '' },
  render: () => (
    <Card className="w-72 p-5">
      <div className="mb-3 flex items-start gap-3">
        <AvatarButton initials="ОК" size="lg" status="online" aria-label="View Oleksiy profile" />
        <div className="min-w-0 flex-1">
          <p className="text-body text-fg-primary truncate font-medium">Oleksa K.</p>
          <p className="text-caption text-fg-tertiary">Piano · Lviv</p>
          <Badge status="online" size="sm" className="mt-1">
            Online
          </Badge>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <Badge variant="yellow" size="sm">
          Classical
        </Badge>
        <Badge variant="neutral" size="sm">
          Folk
        </Badge>
        <Badge variant="danger" size="sm">
          Jazz
        </Badge>
      </div>

      <Divider />

      <div className="mt-3 flex gap-2">
        <Button variant="primary" size="sm" className="flex-1">
          Connect
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          View Profile
        </Button>
      </div>
    </Card>
  ),
};

export const Loading: Story = {
  args: { children: '' },
  render: () => (
    <Card className="w-72 p-5">
      <div className="mb-3 flex items-start gap-3">
        <Skeleton width={48} height={48} rounded="full" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={12} />
          <Skeleton width={64} height={20} rounded="full" />
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <Skeleton width={72} height={22} rounded="full" />
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
