import { ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  BoltOutlineIcon,
  ClockOutlineIcon,
  CrownOutlineIcon,
  DiamondOutlineIcon,
  FlameOutlineIcon,
  HeartOutlineIcon,
  StarOutlineIcon,
} from '@/src/icons/achievements';
import TeamOutlineIcon from '@/src/icons/achievements/TeamOutlineIcon';
import { CheckSolidIcon } from '@/src/icons/base';
import AchievementBadge from '@/src/illustrations/achievements/AchievementBadge/AchievementBadge';
import { AchievementBadgeColor } from '@/src/lib/types/illustrations/achievement-badge.types';

const meta = {
  title: 'Unique/AchievementBadge',
  component: AchievementBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Gamification badge for achievements, streaks, and milestones. Supports progress arcs, color themes, levitation animation, counter and lock overlays. Icon size is auto-scaled via cloneElement — pass the icon as JSX without a size prop.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['green', 'amber', 'orange', 'blue', 'teal', 'red', 'purple', 'indigo', 'grey'],
    },
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    size: { control: { type: 'range', min: 48, max: 160, step: 4 } },
    levitate: { control: 'boolean' },
    levitateDelay: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    locked: { control: 'boolean' },
    count: { control: 'text' },
  },
} satisfies Meta<typeof AchievementBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <CheckSolidIcon />,
    label: ['100%', 'MONTH'],
    color: 'green',
    progress: 1,
    levitate: true,
  },
};

export const AllColors: Story = {
  args: { icon: <StarOutlineIcon />, label: ['Label'] },
  render: () => (
    <div className="flex flex-wrap justify-center gap-8">
      <AchievementBadge
        icon={<CheckSolidIcon />}
        label={['100%', 'MONTH']}
        color="green"
        progress={1}
        levitate
        levitateDelay={0}
      />
      <AchievementBadge
        icon={<StarOutlineIcon />}
        label={['SOLO', 'EVENING']}
        color="amber"
        progress={1}
        levitate
        levitateDelay={0.4}
      />
      <AchievementBadge
        icon={<FlameOutlineIcon />}
        label={['STREAK', '×6']}
        color="orange"
        progress={1}
        levitate
        levitateDelay={0.8}
        count="×6"
      />
      <AchievementBadge
        icon={<TeamOutlineIcon />}
        label={['TEAM', '×5']}
        color="blue"
        progress={1}
        levitate
        levitateDelay={1.2}
        count="×5"
      />
      <AchievementBadge
        icon={<ClockOutlineIcon />}
        label={['EARLY', 'BIRD']}
        color="teal"
        progress={1}
        levitate
        levitateDelay={1.6}
      />
      <AchievementBadge
        icon={<BoltOutlineIcon />}
        label={['TOP-3']}
        color="red"
        progress={1}
        levitate
        levitateDelay={2.0}
      />
      <AchievementBadge
        icon={<CrownOutlineIcon />}
        label={['CHAMPION']}
        color="purple"
        progress={1}
        levitate
        levitateDelay={2.4}
      />
      <AchievementBadge
        icon={<DiamondOutlineIcon />}
        label={['RARE']}
        color="indigo"
        progress={1}
        levitate
        levitateDelay={2.8}
      />
      <AchievementBadge
        icon={<HeartOutlineIcon />}
        label={['PROGRESS']}
        color="grey"
        progress={0.6}
        locked
      />
    </div>
  ),
};

export const ProgressStates: Story = {
  args: { icon: <StarOutlineIcon />, label: ['Label'] },
  render: () => (
    <div className="flex flex-wrap justify-center gap-8">
      {([0, 0.25, 0.5, 0.75, 1] as const).map((progress) => (
        <AchievementBadge
          key={progress}
          icon={<StarOutlineIcon />}
          label={[`${Math.round(progress * 100)}%`, 'PROGRESS']}
          color={progress === 1 ? 'amber' : 'grey'}
          progress={progress}
          levitate={progress === 1}
          locked={progress < 1}
        />
      ))}
    </div>
  ),
};

export const WithCount: Story = {
  args: {
    icon: <FlameOutlineIcon />,
    label: ['STREAK'],
    color: 'orange',
    progress: 1,
    levitate: true,
  },
  render: () => (
    <div className="flex flex-wrap justify-center gap-8">
      {(['×2', '×6', '×12', '×30'] as const).map((count, i) => (
        <AchievementBadge
          key={count}
          icon={<FlameOutlineIcon />}
          label={['STREAK', count]}
          color="orange"
          progress={1}
          levitate
          levitateDelay={i * 0.4}
          count={count}
        />
      ))}
    </div>
  ),
};

export const Locked: Story = {
  args: { icon: <StarOutlineIcon />, label: ['Label'] },
  render: () => (
    <div className="flex flex-wrap justify-center gap-8">
      <AchievementBadge
        icon={<HeartOutlineIcon />}
        label={['PROGRESS']}
        color="grey"
        progress={0.8}
        locked
      />
      <AchievementBadge
        icon={<DiamondOutlineIcon />}
        label={['18/30', 'PROGRESS']}
        color="grey"
        progress={0.57}
        locked
      />
      <AchievementBadge
        icon={<StarOutlineIcon />}
        label={['MENTOR', '1/3']}
        color="grey"
        progress={0.31}
        locked
      />
      <AchievementBadge
        icon={<CrownOutlineIcon />}
        label={['LEGEND']}
        color="grey"
        progress={1}
        locked
      />
    </div>
  ),
};

export const Sizes: Story = {
  args: { icon: <CheckSolidIcon />, label: ['Label'] },
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-8">
      {([48, 64, 80, 108, 128] as const).map((size) => (
        <AchievementBadge
          key={size}
          icon={<CheckSolidIcon />}
          label={[`${size}px`]}
          color="green"
          progress={1}
          levitate
          size={size}
        />
      ))}
    </div>
  ),
};

export const LevitateStagger: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Each badge has a different levitateDelay so they drift out of phase — looks natural in a grid.',
      },
    },
  },
  args: { icon: <StarOutlineIcon />, label: ['Label'] },
  render: () => {
    const badges: ReadonlyArray<{
      color: AchievementBadgeColor;
      count?: string;
      delay: number;
      icon: ReactNode;
      label: [string, string?];
    }> = [
      { color: 'green', icon: <CheckSolidIcon />, label: ['100%', 'MONTH'], delay: 0 },
      {
        color: 'orange',
        icon: <FlameOutlineIcon />,
        label: ['STREAK', '×6'],
        delay: 0.6,
        count: '×6',
      },
      { color: 'amber', icon: <StarOutlineIcon />, label: ['SOLO', 'EVENING'], delay: 0.8 },
      { color: 'blue', icon: <TeamOutlineIcon />, label: ['TEAM', '×5'], delay: 1.4, count: '×5' },
      { color: 'teal', icon: <ClockOutlineIcon />, label: ['EARLY', 'BIRD'], delay: 1.6 },
      { color: 'red', icon: <BoltOutlineIcon />, label: ['TOP-3'], delay: 2.2 },
      { color: 'purple', icon: <CrownOutlineIcon />, label: ['CHAMPION'], delay: 0.8 },
      { color: 'indigo', icon: <DiamondOutlineIcon />, label: ['RARE'], delay: 1.6 },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px 24px' }}>
        {badges.map(({ color, icon, label, delay, count }) => (
          <AchievementBadge
            key={color}
            icon={icon}
            label={label}
            color={color}
            progress={1}
            levitate
            levitateDelay={delay}
            count={count}
          />
        ))}
      </div>
    );
  },
};
