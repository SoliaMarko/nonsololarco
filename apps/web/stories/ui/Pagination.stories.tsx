import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Pagination from '@/src/components/ui/Pagination';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { currentPage: 5 },
};

export const FirstPage: Story = {
  args: { currentPage: 1 },
};

export const LastPage: Story = {
  args: { currentPage: 10 },
};

export const ManyPages: Story = {
  args: { currentPage: 25, totalPages: 50 },
};

export const WiderSiblings: Story = {
  args: { currentPage: 10, totalPages: 20, siblingCount: 2 },
};

export const SinglePage: Story = {
  args: { currentPage: 1, totalPages: 1 },
};

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  },
};
