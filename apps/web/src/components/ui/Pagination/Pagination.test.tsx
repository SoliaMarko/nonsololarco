import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all page buttons for a small range', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
  });

  it('marks the current page with aria-current', () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
  });

  it('calls onPageChange with the clicked page', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('disables prev arrow on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
  });

  it('disables next arrow on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
  });

  it('steps forward / backward via arrows', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('has an accessible navigation landmark', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });
});
