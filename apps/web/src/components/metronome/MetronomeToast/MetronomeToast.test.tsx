import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MetronomeToast from './MetronomeToast';

describe('MetronomeToast', () => {
  it('renders the message text', () => {
    render(<MetronomeToast message="Запис додано" />);
    expect(screen.getByText('Запис додано')).toBeDefined();
  });
});
