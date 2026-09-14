import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Dropdown, { type DropdownGroup } from './Dropdown';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderDropdown(groups: DropdownGroup[], variant?: 'default' | 'stamp') {
  return render(<Dropdown variant={variant} trigger={<button>Open</button>} groups={groups} />);
}

async function openMenu() {
  const user = userEvent.setup();
  await user.click(screen.getByText('Open'));
  return user;
}

/* ------------------------------------------------------------------ */
/*  Default variant                                                    */
/* ------------------------------------------------------------------ */

describe('Dropdown — default variant', () => {
  const groups: DropdownGroup[] = [
    {
      items: [
        { label: 'Edit', onClick: vi.fn() },
        { label: 'Delete', onClick: vi.fn(), variant: 'danger' },
      ],
    },
  ];

  it('renders a trigger', () => {
    renderDropdown(groups);

    expect(screen.getByRole('button', { name: 'Open' })).toBeDefined();
  });

  it('renders with empty groups without crashing', () => {
    renderDropdown([]);

    expect(screen.getByRole('button', { name: 'Open' })).toBeDefined();
  });

  it('shows items when opened', async () => {
    renderDropdown(groups);
    await openMenu();

    expect(screen.getByText('Edit')).toBeDefined();
    expect(screen.getByText('Delete')).toBeDefined();
  });

  it('calls onClick when an item is selected', async () => {
    const onClick = vi.fn();
    renderDropdown([{ items: [{ label: 'Action', onClick }] }]);
    const user = await openMenu();

    await user.click(screen.getByText('Action'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders href items as links', async () => {
    renderDropdown([{ items: [{ label: 'Profile', href: '/profile' }] }]);
    await openMenu();

    const link = screen.getByText('Profile').closest('a');
    expect(link?.getAttribute('href')).toBe('/profile');
  });

  it('renders an icon when provided', async () => {
    const FakeIcon = ({ size, ...props }: { size: number }) => (
      <svg data-testid="icon" {...props}>
        <rect width={size} height={size} />
      </svg>
    );
    renderDropdown([{ items: [{ label: 'Settings', icon: FakeIcon, onClick: vi.fn() }] }]);
    await openMenu();

    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('shows a checkmark on selected items', async () => {
    renderDropdown([{ items: [{ label: 'Active', onClick: vi.fn(), selected: true }] }]);
    await openMenu();

    const item = screen.getByText('Active').closest('[role="menuitem"]');
    expect(item?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders a separator between groups', async () => {
    renderDropdown([
      { items: [{ label: 'A', onClick: vi.fn() }] },
      { items: [{ label: 'B', onClick: vi.fn() }] },
    ]);
    await openMenu();

    expect(screen.getByRole('separator')).toBeDefined();
  });
});

/* ------------------------------------------------------------------ */
/*  Stamp variant                                                      */
/* ------------------------------------------------------------------ */

describe('Dropdown — stamp variant', () => {
  it('renders a group label', async () => {
    renderDropdown([{ label: 'Sort by', items: [{ label: 'Title', onClick: vi.fn() }] }], 'stamp');
    await openMenu();

    expect(screen.getByText('Sort by')).toBeDefined();
  });

  it('renders leadingContent instead of icon', async () => {
    const stamp = <span data-testid="stamp">EN</span>;
    renderDropdown(
      [{ items: [{ label: 'English', leadingContent: stamp, onClick: vi.fn() }] }],
      'stamp',
    );
    await openMenu();

    expect(screen.getByTestId('stamp')).toBeDefined();
  });

  it('prefers leadingContent over icon when both are provided', async () => {
    const FakeIcon = (props: Record<string, unknown>) => <svg data-testid="icon" {...props} />;
    const stamp = <span data-testid="stamp">IT</span>;
    renderDropdown(
      [{ items: [{ label: 'Italiano', leadingContent: stamp, icon: FakeIcon, onClick: vi.fn() }] }],
      'stamp',
    );
    await openMenu();

    expect(screen.getByTestId('stamp')).toBeDefined();
    expect(screen.queryByTestId('icon')).toBeNull();
  });

  it('renders a text checkmark (✓) for selected stamp items', async () => {
    renderDropdown([{ items: [{ label: 'English', onClick: vi.fn(), selected: true }] }], 'stamp');
    await openMenu();

    const item = screen.getByText('English').closest('[role="menuitem"]');
    expect(item?.textContent).toContain('✓');
  });

  it('applies stamp content styles', async () => {
    renderDropdown([{ items: [{ label: 'Test', onClick: vi.fn() }] }], 'stamp');
    await openMenu();

    // Radix renders content in a portal — query the document, not container
    const content = document.querySelector('[role="menu"]') as HTMLElement;
    expect(content.className).toContain('border-2');
    expect(content.className).not.toContain('rounded-lg');
  });

  it('uses non-modal mode to avoid scroll jump', async () => {
    renderDropdown([{ items: [{ label: 'Item', onClick: vi.fn() }] }], 'stamp');
    await openMenu();

    // If modal were true, Radix would add aria-hidden to sibling elements.
    // With modal={false}, the trigger should remain accessible.
    expect(screen.getByRole('button', { name: 'Open' })).toBeDefined();
  });
});
