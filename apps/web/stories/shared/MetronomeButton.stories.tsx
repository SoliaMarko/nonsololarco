import type { Meta, StoryObj } from '@storybook/nextjs';

import MetronomeButton from '@/src/components/shared/MetronomeButton';

const meta = {
  title: 'Shared/MetronomeButton',
  component: MetronomeButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Entry point to the metronome. `header` sits in the desktop header row; `fab` is the mobile thumb-zone button. The caller decides which is visible at which breakpoint — AppHeaderNav renders the header variant above `md`, AppShell renders the fab below it.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['header', 'fab'] },
  },
} satisfies Meta<typeof MetronomeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Header: Story = {
  args: { variant: 'header' },
};

export const Fab: Story = {
  args: { variant: 'fab' },
};

export const BothVariants: Story = {
  args: { variant: 'header' },
  render: () => (
    <div className="flex items-end gap-10">
      {(['header', 'fab'] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-3">
          <MetronomeButton variant={variant} />
          <span className="text-label text-fg-tertiary">{variant}</span>
        </div>
      ))}
    </div>
  ),
};

export const InHeaderRow: Story = {
  args: { variant: 'header' },
  render: () => (
    <div className="border-border-primary bg-surface pli-4 flex h-14 w-md items-center justify-end gap-4 border-b">
      <MetronomeButton variant="header" />
      <div className="border-border-primary bg-elevated size-10 rounded-full border-2" />
      <div className="border-border-primary bg-elevated size-10 rounded-full border-2" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sized to sit flush with the other 40px header controls.',
      },
    },
  },
};
