import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OAuthButton from './OAuthButton';

const renderButton = (overrides: Partial<Parameters<typeof OAuthButton>[0]> = {}) =>
  render(
    <OAuthButton
      href="/api/auth/google"
      icon={<svg aria-label="Google" />}
      label="Continue with Google"
      {...overrides}
    />,
  );

describe('OAuthButton', () => {
  it('renders the label text', () => {
    renderButton();

    expect(screen.getByText('Continue with Google')).toBeDefined();
  });

  it('renders the provider icon', () => {
    const { container } = renderButton();

    // Bare <svg aria-label> has no implicit ARIA role in jsdom, so it can't
    // be queried via getByRole — fall back to a direct selector.
    expect(container.querySelector('svg[aria-label="Google"]')).not.toBeNull();
  });

  it('links to the provided OAuth href', () => {
    renderButton();

    expect(screen.getByRole('link').getAttribute('href')).toBe('/api/auth/google');
  });

  it('has an accessible name matching the label', () => {
    renderButton();

    expect(screen.getByRole('link').getAttribute('aria-label')).toBe('Continue with Google');
  });

  it('renders a single link with no nested interactive elements', () => {
    renderButton();

    expect(screen.getByRole('link')).toBeDefined();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
