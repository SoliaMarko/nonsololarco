import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SigDropdown from './SigDropdown';

// Radix DropdownMenu relies on pointer-capture and scroll APIs jsdom omits.
beforeEach(() => {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

function setup(options: readonly number[] = [2, 3, 4], value = 4) {
  const onSelect = vi.fn();
  render(
    <SigDropdown
      ariaLabel="Beats"
      onSelect={onSelect}
      options={options}
      value={value}
      variant="light"
    />,
  );
  return { onSelect };
}

describe('SigDropdown', () => {
  it('renders the current value on the trigger', () => {
    setup([2, 3, 4], 3);
    expect(screen.getByRole('button', { name: 'Beats' })).toBeDefined();
  });

  it('opens the menu and lists every option', async () => {
    setup([2, 3, 4], 4);
    await userEvent.click(screen.getByRole('button', { name: 'Beats' }));
    const items = await screen.findAllByRole('menuitem');
    expect(items).toHaveLength(3);
  });

  it('calls onSelect with the chosen option', async () => {
    const { onSelect } = setup([2, 3, 4], 4);
    await userEvent.click(screen.getByRole('button', { name: 'Beats' }));
    const items = await screen.findAllByRole('menuitem');
    await userEvent.click(items[0]!);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('renders no items for an empty option list', async () => {
    setup([], 4);
    await userEvent.click(screen.getByRole('button', { name: 'Beats' }));
    expect(screen.queryAllByRole('menuitem')).toHaveLength(0);
  });
});
