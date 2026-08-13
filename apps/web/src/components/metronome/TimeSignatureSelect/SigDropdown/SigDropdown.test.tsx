import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SigDropdown from './SigDropdown';

// Radix DropdownMenu relies on pointer-capture and scroll APIs jsdom omits.
// Capture the originals so each spy can be removed again — clearAllMocks only
// resets call history, it does not undo the prototype assignment, which would
// otherwise leak into unrelated suites that expect the jsdom defaults.
type PatchedMethod =
  | 'hasPointerCapture'
  | 'setPointerCapture'
  | 'releasePointerCapture'
  | 'scrollIntoView';
const originals: Partial<Record<PatchedMethod, PropertyDescriptor | undefined>> = {};
const PATCHED: PatchedMethod[] = [
  'hasPointerCapture',
  'setPointerCapture',
  'releasePointerCapture',
  'scrollIntoView',
];

beforeEach(() => {
  for (const method of PATCHED) {
    originals[method] = Object.getOwnPropertyDescriptor(Element.prototype, method);
  }
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
  for (const method of PATCHED) {
    const descriptor = originals[method];
    if (descriptor) Object.defineProperty(Element.prototype, method, descriptor);
    else delete (Element.prototype as Partial<Element>)[method];
  }
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
    expect(screen.getByRole('button', { name: 'Beats' }).textContent).toContain('3');
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
