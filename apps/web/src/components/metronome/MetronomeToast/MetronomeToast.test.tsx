import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MetronomeToast from './MetronomeToast';

describe('MetronomeToast', () => {
  it('renders the message text', () => {
    render(<MetronomeToast message="Entry added" />);
    expect(screen.getByText('Entry added')).toBeDefined();
  });
});
