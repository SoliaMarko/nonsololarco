import type { Meta, StoryObj } from '@storybook/nextjs';

import Toast from '@/src/components/ui/Toast/Toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Retro-styled notification toast — success, error or info. The parent controls positioning and visibility; this component is the visual box only.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'info'],
    },
    message: { control: 'text' },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { message: 'Session saved', variant: 'success' },
};

export const Error: Story = {
  args: { message: 'Failed to save', variant: 'error' },
};

export const Info: Story = {
  args: { message: 'Copied to clipboard', variant: 'info' },
};

export const AllVariants: Story = {
  args: { message: 'Session saved' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Toast message="Session saved" variant="success" />
      <Toast message="Failed to save" variant="error" />
      <Toast message="Copied to clipboard" variant="info" />
    </div>
  ),
};

export const WithoutIcon: Story = {
  args: { message: 'No icon toast', variant: 'success', icon: null },
};

export const OnDarkBackground: Story = {
  args: { message: '«Ніч у депо» додано в репертуар' },
  render: () => (
    <div className="bg-primary-dark relative flex items-center justify-center rounded-lg p-16">
      <Toast
        className="absolute inset-x-0 bottom-5.5 mx-auto w-fit"
        message="«Ніч у депо» додано в репертуар"
        variant="success"
        style={{ animation: 'toast-in 0.3s ease-out' }}
      />
    </div>
  ),
};
