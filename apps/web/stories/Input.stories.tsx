import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs';

import Input from '@/src/components/Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A controlled input component with label, error, and hint support.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Label above the input' },
    placeholder: { control: 'text' },
    error: { control: 'text', description: 'Error message shown below' },
    hint: { control: 'text', description: 'Hint message shown below' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Baseline

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    name: 'musician',
    placeholder: 'Search for a musician...',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

// With Label

export const WithLabel: Story = {
  args: {
    value: '',
    onChange: () => {},
    label: 'Artist name',
    name: 'artist',
    placeholder: 'e.g. Lindsey Stirling',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

// With Value

export const WithValue: Story = {
  args: {
    value: 'Niccolò Paganini',
    onChange: () => {},
    label: 'Full name',
    name: 'full_name',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

// With Hint

export const WithHint: Story = {
  args: {
    value: '',
    onChange: () => {},
    label: 'Username',
    name: 'username',
    placeholder: 'jazz_guitarist_42',
    hint: 'Only letters, numbers and underscores.',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

// With Error

export const WithError: Story = {
  args: {
    value: 'not-an-email',
    onChange: () => {},
    label: 'Email',
    name: 'email',
    placeholder: 'you@arco.music',
    error: 'Please enter a valid email address.',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

// Error clears on input

export const ErrorClearsOnInput: Story = {
  args: { value: '', name: 'email', onChange: () => {} },
  render: function Render() {
    const [value, setValue] = useState('bad@@input');
    const [error, setError] = useState('Invalid email address.');
    return (
      <Input
        error={error}
        label="Email"
        name="email"
        placeholder="you@arco.music"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError('');
        }}
      />
    );
  },
};

// Disabled

export const Disabled: Story = {
  args: {
    value: 'Piano, Guitar, Violin',
    onChange: () => {},
    name: 'instruments',
    label: 'Instruments',
    disabled: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

export const DisabledEmpty: Story = {
  args: {
    value: '',
    onChange: () => {},
    label: 'Genre',
    name: 'genre',
    placeholder: 'Not available',
    disabled: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

// All states

export const AllStates: Story = {
  args: { value: '', name: 'genres', onChange: () => {} },
  render: function Render() {
    const [values, setValues] = useState({
      default: '',
      genres: 'Classical, Jazz, Folk',
      username: '',
      email: 'not-an-email',
    });

    const update = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value }));

    return (
      <div className="flex w-80 flex-col gap-4">
        <Input
          label="Search"
          name="musician"
          placeholder="Search for a musician..."
          value={values.default}
          onChange={update('default')}
        />
        <Input label="Genres" name="genres" value={values.genres} onChange={update('genres')} />
        <Input
          label="Username"
          name="username"
          placeholder="jazz_guitarist_42"
          hint="Only letters, numbers and underscores."
          value={values.username}
          onChange={update('username')}
        />
        <Input
          label="Email"
          name="email"
          value={values.email}
          error="Please enter a valid email address."
          onChange={update('email')}
        />
        <Input
          label="Instruments"
          name="instruments"
          value="Piano, Guitar, Violin"
          disabled
          onChange={() => {}}
        />
      </div>
    );
  },
};

// Interactive validation

export const Interactive: Story = {
  args: { value: '', name: 'artist', onChange: () => {} },
  render: function Render() {
    const [value, setValue] = useState('');
    const error = value.length > 0 && value.length < 3 ? 'Minimum 3 characters.' : '';

    return (
      <Input
        error={error}
        hint="Enter your musician name."
        label="Artist name"
        name="artist"
        placeholder="e.g. David Garett"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

// Input types

export const Password: Story = {
  args: {
    value: '',
    onChange: () => {},
    label: 'Password',
    name: 'password',
    placeholder: '••••••••',
    type: 'password',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

export const NumberInput: Story = {
  args: {
    value: '',
    onChange: () => {},
    label: 'Years of experience',
    name: 'experience',
    placeholder: '5',
    type: 'number',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};
