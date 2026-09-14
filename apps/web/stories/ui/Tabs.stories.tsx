'use client';

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import Tabs, { TabItem } from '@/src/components/ui/Tabs';
import {
  CalendarIcon,
  ChatOutlineIcon,
  HomeOutlineIcon,
  ProfileOutlineIcon,
  RepertoireIcon,
} from '@/src/icons/base';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
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
      options: ['nav', 'panel'],
    },
    animated: { control: 'boolean' },
    scrollable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

/* ---------- Panel variant ---------- */

export const PanelDefault: Story = {
  name: 'Panel — static',
  render: () => {
    const [active, setActive] = useState('all');
    const tabs = [
      { id: 'all', label: 'All bands', subtitle: '42 tracks' },
      { id: 'jazz', label: 'Jazz Quartet', subtitle: 'Keys · 18 tracks' },
      { id: 'chamber', label: 'Chamber Trio', subtitle: 'Violin · 12 tracks' },
      { id: 'solo', label: 'Solo', subtitle: '12 tracks' },
    ];

    return (
      <Tabs variant="panel" label="Bands">
        {tabs.map((tab) => (
          <TabItem key={tab.id} isActive={active === tab.id} onClick={() => setActive(tab.id)}>
            <div className="min-w-0 text-left">
              <div className="truncate text-sm font-semibold">{tab.label}</div>
              <div className="text-fg-tertiary mbs-0.5 truncate text-xs">{tab.subtitle}</div>
            </div>
          </TabItem>
        ))}
      </Tabs>
    );
  },
};

export const PanelAnimated: Story = {
  name: 'Panel — animated',
  render: () => {
    const [active, setActive] = useState('all');
    const tabs = [
      { id: 'all', label: 'All bands', subtitle: '42 tracks' },
      { id: 'jazz', label: 'Jazz Quartet', subtitle: 'Keys · 18 tracks' },
      { id: 'chamber', label: 'Chamber Trio', subtitle: 'Violin · 12 tracks' },
      { id: 'solo', label: 'Solo', subtitle: '12 tracks' },
    ];

    return (
      <Tabs animated variant="panel" label="Bands">
        {tabs.map((tab) => (
          <TabItem key={tab.id} isActive={active === tab.id} onClick={() => setActive(tab.id)}>
            <div className="min-w-0 text-left">
              <div className="truncate text-sm font-semibold">{tab.label}</div>
              <div className="text-fg-tertiary mbs-0.5 truncate text-xs">{tab.subtitle}</div>
            </div>
          </TabItem>
        ))}
      </Tabs>
    );
  },
};

/* ---------- Nav variant ---------- */

const NAV_TABS = [
  { id: 'feed', label: 'Feed', icon: HomeOutlineIcon },
  { id: 'repertoire', label: 'Repertoire', icon: RepertoireIcon },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'chats', label: 'Chats', icon: ChatOutlineIcon },
  { id: 'profile', label: 'Profile', icon: ProfileOutlineIcon },
];

export const NavDefault: Story = {
  name: 'Nav — static',
  render: () => {
    const [active, setActive] = useState('feed');

    return (
      <div className="border-border-primary bg-surface border-b">
        <Tabs variant="nav" label="Main Nav" scrollable={false}>
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabItem
                key={tab.id}
                variant="nav"
                isActive={active === tab.id}
                onClick={() => setActive(tab.id)}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span>{tab.label}</span>
              </TabItem>
            );
          })}
        </Tabs>
      </div>
    );
  },
};

export const NavAnimated: Story = {
  name: 'Nav — animated',
  render: () => {
    const [active, setActive] = useState('feed');

    return (
      <div className="border-border-primary bg-surface border-b">
        <Tabs animated variant="nav" label="Main Nav" scrollable={false}>
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabItem
                key={tab.id}
                variant="nav"
                isActive={active === tab.id}
                onClick={() => setActive(tab.id)}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span>{tab.label}</span>
              </TabItem>
            );
          })}
        </Tabs>
      </div>
    );
  },
};

/* ---------- Edge cases ---------- */

export const SingleTab: Story = {
  name: 'Single tab',
  render: () => (
    <Tabs variant="panel" label="Solo">
      <TabItem isActive>Only tab</TabItem>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  name: 'Many tabs — scrollable',
  render: () => {
    const [active, setActive] = useState('tab-0');
    const tabs = Array.from({ length: 10 }, (_, i) => ({
      id: `tab-${i}`,
      label: `Ensemble ${i + 1}`,
      subtitle: `${Math.floor(Math.random() * 30) + 1} tracks`,
    }));

    return (
      <div className="max-w-2xl">
        <Tabs animated variant="panel" label="Many bands">
          {tabs.map((tab) => (
            <TabItem key={tab.id} isActive={active === tab.id} onClick={() => setActive(tab.id)}>
              <div className="min-w-0 text-left">
                <div className="truncate text-sm font-semibold">{tab.label}</div>
                <div className="text-fg-tertiary mbs-0.5 truncate text-xs">{tab.subtitle}</div>
              </div>
            </TabItem>
          ))}
        </Tabs>
      </div>
    );
  },
};

/* ---------- Side-by-side comparison ---------- */

export const AnimatedVsStatic: Story = {
  name: 'Comparison — animated vs static',
  render: () => {
    const [activeA, setActiveA] = useState('one');
    const [activeB, setActiveB] = useState('one');
    const items = ['one', 'two', 'three'];

    return (
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-fg-secondary mbe-2 text-xs font-bold tracking-widest uppercase">
            Animated
          </p>
          <Tabs animated variant="panel" label="Animated demo">
            {items.map((id) => (
              <TabItem key={id} isActive={activeA === id} onClick={() => setActiveA(id)}>
                <div className="text-sm font-semibold capitalize">{id}</div>
              </TabItem>
            ))}
          </Tabs>
        </div>

        <div>
          <p className="text-fg-secondary mbe-2 text-xs font-bold tracking-widest uppercase">
            Static
          </p>
          <Tabs variant="panel" label="Static demo">
            {items.map((id) => (
              <TabItem key={id} isActive={activeB === id} onClick={() => setActiveB(id)}>
                <div className="text-sm font-semibold capitalize">{id}</div>
              </TabItem>
            ))}
          </Tabs>
        </div>
      </div>
    );
  },
};
