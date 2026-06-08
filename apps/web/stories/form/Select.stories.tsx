import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import Select from '@/src/components/form/Select';

const GENRE_OPTIONS = [
  { label: 'Classical', value: 'classical' },
  { label: 'Jazz', value: 'jazz' },
  { label: 'Folk', value: 'folk' },
  { label: 'Electronic', value: 'electronic' },
  { label: 'Rock', value: 'rock' },
];

const INSTRUMENT_GROUPS = [
  {
    label: 'Strings',
    options: [
      { label: 'Violin', value: 'violin' },
      { label: 'Viola', value: 'viola' },
      { label: 'Cello', value: 'cello' },
      { label: 'Double Bass', value: 'double-bass' },
    ],
  },
  {
    label: 'Keys',
    options: [
      { label: 'Piano', value: 'piano' },
      { label: 'Organ', value: 'organ' },
      { label: 'Harpsichord', value: 'harpsichord' },
    ],
  },
  {
    label: 'Wind',
    options: [
      { label: 'Flute', value: 'flute' },
      { label: 'Clarinet', value: 'clarinet' },
      { label: 'Saxophone', value: 'saxophone' },
      { label: 'Trumpet', value: 'trumpet' },
    ],
  },
];

const meta = {
  args: {
    value: null,
    onChange: () => {},
    options: [],
  },
  title: 'FORM/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible select built on Radix UI. Supports flat options or grouped options — mutually exclusive. Clearable, with error and hint states.',
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className="w-64">
        <Select
          label="Genre"
          placeholder="Select genre..."
          value={value}
          onChange={setValue}
          options={GENRE_OPTIONS}
        />
      </div>
    );
  },
};

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className="w-64">
        <Select
          label="Instrument"
          placeholder="Select instrument..."
          value={value}
          onChange={setValue}
          groups={INSTRUMENT_GROUPS}
        />
      </div>
    );
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('jazz');

    return (
      <div className="w-64">
        <Select
          label="Genre"
          value={value}
          onChange={setValue}
          options={GENRE_OPTIONS}
          isClearable
        />
      </div>
    );
  },
};

export const WithHint: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className="w-64">
        <Select
          label="Genre"
          placeholder="Select genre..."
          value={value}
          onChange={setValue}
          options={GENRE_OPTIONS}
          hint="This helps us match you with other musicians"
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className="w-64">
        <Select
          label="Genre"
          placeholder="Select genre..."
          value={value}
          onChange={setValue}
          options={GENRE_OPTIONS}
          error="Please select at least one genre"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Select
        label="City"
        value="lviv"
        onChange={() => {}}
        options={[{ label: 'Lviv', value: 'lviv' }]}
        disabled
      />
    </div>
  ),
};

export const WithDisabledOption: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className="w-64">
        <Select
          label="Experience"
          placeholder="Select level..."
          value={value}
          onChange={setValue}
          options={[
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
            { label: 'Professional', value: 'professional', disabled: true },
          ]}
          hint="Professional level coming soon"
        />
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => {
    const [v1, setV1] = useState<string | null>(null);
    const [v2, setV2] = useState<string | null>('jazz');
    const [v3, setV3] = useState<string | null>(null);

    return (
      <div className="flex w-64 flex-col gap-4">
        <Select
          label="Default"
          placeholder="Select..."
          value={v1}
          onChange={setV1}
          options={GENRE_OPTIONS}
        />
        <Select
          label="With value + clearable"
          value={v2}
          onChange={setV2}
          options={GENRE_OPTIONS}
          isClearable
        />
        <Select
          label="With error"
          placeholder="Select..."
          value={v3}
          onChange={setV3}
          options={GENRE_OPTIONS}
          error="Required field"
        />
        <Select
          label="Disabled"
          value="classical"
          onChange={() => {}}
          options={GENRE_OPTIONS}
          disabled
        />
      </div>
    );
  },
};
