import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TabItem from './TabItem';

describe('TabItem', () => {
  it('renders a button by default', () => {
    render(<TabItem>My Tab</TabItem>);

    const tab = screen.getByRole('tab');
    expect(tab).toBeDefined();
    expect(tab.tagName).toBe('BUTTON');
    expect(tab.textContent).toBe('My Tab');
  });

  it('sets aria-selected to true when active', () => {
    render(<TabItem isActive>Active</TabItem>);

    expect(screen.getByRole('tab').getAttribute('aria-selected')).toBe('true');
  });

  it('sets aria-selected to false when inactive', () => {
    render(<TabItem isActive={false}>Inactive</TabItem>);

    expect(screen.getByRole('tab').getAttribute('aria-selected')).toBe('false');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<TabItem onClick={handleClick}>Click me</TabItem>);

    await user.click(screen.getByRole('tab'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('renders child element when asChild is true', () => {
    render(
      <TabItem asChild>
        <a href="/test">Link Tab</a>
      </TabItem>,
    );

    const tab = screen.getByRole('tab');
    expect(tab.tagName).toBe('A');
    expect(tab.getAttribute('href')).toBe('/test');
    expect(tab.textContent).toBe('Link Tab');
  });

  it('merges className with variant classes', () => {
    const { container } = render(
      <TabItem className="custom-class">Tab</TabItem>,
    );

    const tab = container.querySelector('[role="tab"]') as HTMLElement;
    expect(tab.className).toContain('custom-class');
  });
});
