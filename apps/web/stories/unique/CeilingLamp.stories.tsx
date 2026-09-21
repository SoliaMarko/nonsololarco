import type { Meta, StoryObj } from '@storybook/nextjs';

import CeilingLamp from '@/src/illustrations/lamp/CeilingLamp';

const meta = {
  title: 'Unique/CeilingLamp',
  component: CeilingLamp,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Vintage pull-cord ceiling lamp, composited from three raster layers: the lit body, the unlit body, and the wooden knob on its own so the tug can move it. Drives the theme toggle in the app header.',
      },
    },
  },
  argTypes: {
    height: { control: { type: 'range', min: 60, max: 260, step: 2 } },
    isOn: { control: 'boolean' },
    isPulling: { control: 'boolean' },
  },
} satisfies Meta<typeof CeilingLamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lit: Story = {
  args: { height: 220, isOn: true, title: 'Ceiling lamp' },
};

export const Unlit: Story = {
  args: { height: 220, isOn: false, title: 'Ceiling lamp' },
};

export const BothStates: Story = {
  args: { height: 200 },
  render: () => (
    <div className="flex items-start gap-16">
      <div className="bg-primary-light flex flex-col items-center gap-3 p-6">
        <CeilingLamp height={200} isOn />
        <span className="text-label text-primary-dark">on</span>
      </div>
      <div className="bg-primary-dark flex flex-col items-center gap-3 p-6">
        <CeilingLamp height={200} />
        <span className="text-label text-primary-light">off</span>
      </div>
    </div>
  ),
};

export const MidPull: Story = {
  args: { height: 220, isOn: true, isPulling: true },
  parameters: {
    docs: {
      description: {
        story:
          'The tug, frozen as a prop. In the app it is transient state cleared on `animationend`; here it replays whenever the story re-renders.',
      },
    },
  },
};

export const HeaderSize: Story = {
  args: { height: 66 },
  render: () => (
    <div className="w-lg">
      <div className="border-border-primary bg-surface pli-4 flex h-14 items-center gap-6 border-b">
        <CeilingLamp height={66} isOn />
        <span className="text-label text-fg-tertiary">header row, 56px</span>
      </div>
      <div className="plb-8" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'At 66px the shade sits inside the 56px header row and the cord dangles past the border — the size ThemeToggle uses.',
      },
    },
  },
};
