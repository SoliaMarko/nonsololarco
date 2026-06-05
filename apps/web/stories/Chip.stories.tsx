import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import Chip from '@/src/components/ui/Chip/Chip';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interactive tag for instruments, genres, and search filters. Supports removable, selectable, and disabled states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [undefined, 'emerald', 'yellow', 'neutral', 'dangerous'],
    },
    isSelected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Violin', variant: 'emerald' },
};

export const AllVariants: Story = {
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Violin" variant="emerald" />
      <Chip label="Featured" variant="yellow" />
      <Chip label="Classical" variant="neutral" />
      <Chip label="Blocked" variant="danger" />
    </div>
  ),
};

export const Removable: Story = {
  args: { label: '' },
  render: () => {
    const [chips, setChips] = useState(['Violin', 'Piano', 'Classical', 'Folk']);

    return (
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            variant="emerald"
            onRemove={() => setChips((prev) => prev.filter((c) => c !== chip))}
          />
        ))}
      </div>
    );
  },
};

export const Selected: Story = {
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Violin" variant="emerald" isSelected />
      <Chip label="Featured" variant="yellow" isSelected />
      <Chip label="Classical" variant="neutral" isSelected />
      <Chip label="Blocked" variant="danger" isSelected />
    </div>
  ),
};

export const AsFilter: Story = {
  args: { label: '' },
  render: () => {
    const filters = ['Violin', 'Piano', 'Guitar', 'Cello', 'Flute'];
    const [selected, setSelected] = useState<string[]>(['Violin']);

    return (
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Chip
            key={f}
            label={f}
            variant="emerald"
            isSelected={selected.includes(f)}
            onClick={() =>
              setSelected((prev) => (prev.includes(f) ? prev.filter((s) => s !== f) : [...prev, f]))
            }
          />
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { label: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Violin" variant="emerald" disabled />
      <Chip label="Featured" variant="yellow" disabled />
      <Chip label="Classical" variant="neutral" disabled />
      <Chip label="Blocked" variant="danger" disabled />
    </div>
  ),
};
