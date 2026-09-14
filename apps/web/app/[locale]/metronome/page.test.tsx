import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockIntl } from '@/src/test/intl-mock';

vi.mock('next-intl', () => mockIntl.nextIntl);

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

vi.mock('@/src/hooks/useMetronomeEngine', () => ({
  useMetronomeEngine: () => ({ getBeatPosition: () => null }),
}));

beforeEach(() => {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  mockIntl.reset();
});

describe('MetronomePage', () => {
  it('renders the MetronomeScreen inside a Suspense boundary', async () => {
    // Dynamic import avoids hoisting before mocks are installed
    const { default: MetronomePage } = await import('./page');
    render(<MetronomePage />);
    // The chooser title proves MetronomeScreen rendered successfully
    expect(screen.getByText('pages.metronome.chooserTitle')).toBeDefined();
  });
});
