import type { Meta, StoryObj } from '@storybook/nextjs';

import Heading from '@/src/components/typography/Heading';

const meta = {
  title: 'UI/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Heading component for h1-h6 elements with color and truncate support.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    level: {
      control: 'select',
      options: [undefined, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'tertiary', 'accent', 'highlight', 'danger'],
    },
    isTruncated: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Heading',
    as: 'h2',
  },
};

export const AllLevels: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((level) => (
        <Heading key={level} as={level}>
          {level.toUpperCase()} — Heading {level.slice(1)}
        </Heading>
      ))}
    </div>
  ),
};

export const AllColorVariant: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['primary', 'secondary', 'tertiary', 'accent', 'highlight', 'danger'] as const).map(
        (color) => (
          <Heading key={color} as="h2" color={color}>
            Color — {color}
          </Heading>
        ),
      )}
    </div>
  ),
};
export const LevelOverride: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading as="h1" level="h3">
        Semantic h1, visual h3
      </Heading>
      <Heading as="h2" level="h1">
        Semantic h2, visual h1
      </Heading>
    </div>
  ),
};

export const Truncated: Story = {
  args: { children: '' },
  render: () => (
    <div className="w-48">
      <Heading as="h2" isTruncated>
        This is a very long heading that will be truncated
      </Heading>
    </div>
  ),
};
