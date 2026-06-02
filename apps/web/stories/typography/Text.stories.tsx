import type { Meta, StoryObj } from '@storybook/nextjs';

import Text from '@/src/components/typography/Text';

const meta = {
  title: 'Typography/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Text component for body copy with size, weight, color, alignment and truncate support.',
      },
    },
  },
  argTypes: {
    tag: {
      control: 'select',
      options: ['p', 'span', 'strong', 'em', 'small'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
    },

    weight: {
      control: 'select',
      options: [undefined, 'regular', 'medium', 'semibold'],
    },
    color: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'tertiary',
        'disabled',
        'accent',
        'highlight',
        'danger',
      ],
    },
    align: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end'],
    },
    isTruncated: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Text',
    tag: 'p',
  },
};

export const AllSizes: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const).map((size) => (
        <Text key={size} size={size}>
          Size {size}
        </Text>
      ))}
    </div>
  ),
};

export const AllWeights: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['regular', 'medium', 'semibold'] as const).map((weight) => (
        <Text key={weight} weight={weight}>
          Weight — {weight}
        </Text>
      ))}
    </div>
  ),
};

export const AllColorVariant: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-col gap-3">
      {(
        ['primary', 'secondary', 'tertiary', 'disabled', 'accent', 'highlight', 'danger'] as const
      ).map((color) => (
        <Text key={color} color={color}>
          Color — {color}
        </Text>
      ))}
    </div>
  ),
};

export const Alignment: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex w-full flex-col gap-2">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Text key={align} align={align}>
          Align — {align}
        </Text>
      ))}
    </div>
  ),
};

export const Truncated: Story = {
  args: { children: '' },
  render: () => (
    <div className="w-205">
      <Text isTruncated>
        This is a very long line of text that will be truncated this is a very long line of text
        that will be truncated this is a very long line of text that will be truncated
      </Text>
    </div>
  ),
};

export const Inline: Story = {
  args: { children: '' },
  render: () => (
    <Text tag="p">
      A paragraph with{' '}
      <Text tag="strong" weight="semibold">
        bold
      </Text>{' '}
      and{' '}
      <Text tag="em" color="accent">
        accented
      </Text>{' '}
      inline pieces.
    </Text>
  ),
};
