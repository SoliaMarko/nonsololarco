import type { Meta, StoryObj } from '@storybook/nextjs';

import ThemeToggle from '@/src/components/shared/ThemeToggle';

const meta = {
  title: 'Shared/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The theme switch, drawn as a pull-cord ceiling lamp: lit in light mode, dark in dark mode. Clicking anywhere on it — including the rope hanging below the header — yanks the cord and flips the theme. It writes `data-theme` on `<html>`, so in Storybook it changes the whole preview frame.',
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const InHeaderRow: Story = {
  args: {},
  render: () => (
    <div className="w-xl">
      <div className="border-border-primary bg-surface pli-4 flex h-14 items-center gap-1 border-b">
        <ThemeToggle />
        <span className="text-label text-fg-tertiary">nonsololarco</span>
      </div>
      <div className="plb-10 pli-4">
        <span className="text-label text-fg-tertiary">page content</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Where it lives: hanging from the start of the header, before the logo. The rope crosses the header border on purpose — the gaps around it stay click-through, so nothing underneath is blocked.',
      },
    },
  },
};
