import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import TabItem from './TabItem';
import Tabs from './Tabs';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

describe('Tabs', () => {
  it('renders children inside a tablist', () => {
    render(
      <Tabs label="Test tabs">
        <button>Tab 1</button>
        <button>Tab 2</button>
      </Tabs>,
    );

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeDefined();
    expect(tablist.getAttribute('aria-label')).toBe('Test tabs');
  });

  it('applies panel variant by default', () => {
    render(
      <Tabs>
        <button>Tab</button>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toBeDefined();
  });

  it('supports nav variant', () => {
    render(
      <Tabs variant="nav" label="Nav">
        <button>Tab</button>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toBeDefined();
  });

  it('passes through additional HTML attributes', () => {
    render(
      <Tabs data-custom="yes" label="Test">
        <button>Tab</button>
      </Tabs>,
    );

    expect(screen.getByRole('tablist').getAttribute('data-custom')).toBe('yes');
  });

  it('renders indicator elements when animated and a tab is active', () => {
    const { container } = render(
      <Tabs animated label="Animated">
        <TabItem isActive>Active</TabItem>
        <TabItem>Other</TabItem>
      </Tabs>,
    );

    const indicators = container.querySelectorAll('[aria-hidden="true"]');
    expect(indicators.length).toBe(2);
  });

  it('does not render indicator elements when animated is false', () => {
    const { container } = render(
      <Tabs label="Static">
        <TabItem isActive>Active</TabItem>
        <TabItem>Other</TabItem>
      </Tabs>,
    );

    const indicators = container.querySelectorAll('[aria-hidden="true"]');
    expect(indicators.length).toBe(0);
  });
});
