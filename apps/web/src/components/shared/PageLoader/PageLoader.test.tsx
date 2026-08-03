import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PageLoader from './PageLoader';

describe('PageLoader', () => {
  it('renders an accessible loading status', () => {
    render(<PageLoader />);

    expect(screen.getByRole('status')).toBeDefined();
  });

  it('announces a custom label', () => {
    render(<PageLoader label="Loading your session" />);

    expect(screen.getByRole('status').getAttribute('aria-label')).toBe('Loading your session');
  });
});
