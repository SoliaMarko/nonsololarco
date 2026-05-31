import type { Meta, StoryObj } from '@storybook/nextjs';

import Heading from '@/src/components/typography/Heading';
import { TAG_DEFAULT_SIZE } from '@/src/lib/types/typography/heading.types';

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Heading component for h1-h6 elements with color, alignment and truncate support.',
      },
    },
  },
  argTypes: {
    tag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
    },
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'tertiary', 'accent', 'highlight', 'danger'],
    },
    align: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end'],
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
    tag: 'h2',
  },
};

export const AllLevels: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag) => (
        <Heading key={tag} tag={tag}>
          {tag.toUpperCase()} — {TAG_DEFAULT_SIZE[tag]}
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
          <Heading key={color} tag="h2" color={color}>
            Color — {color}
          </Heading>
        ),
      )}
    </div>
  ),
};

export const SizeOverride: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading tag="h1" size="lg">
        Semantic h1, visual lg
      </Heading>
      <Heading tag="h2" size="2xl">
        Semantic h2, visual 2xl
      </Heading>
    </div>
  ),
};

export const Alignment: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex w-full flex-col gap-2">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Heading key={align} tag="h2" align={align}>
          Align — {align}
        </Heading>
      ))}
    </div>
  ),
};

export const Truncated: Story = {
  args: { children: '' },
  render: () => (
    <div className="w-205">
      <Heading tag="h2" isTruncated>
        This is a very long heading that will be truncated this is a very long heading that will be
        truncated
      </Heading>
    </div>
  ),
};
