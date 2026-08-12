import { ComponentType } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  CheckCircleIcon,
  EyeOffIcon,
  MetronomeIcon,
  MinusIcon,
  PauseIcon,
  SaveIcon,
  TrashIcon,
  VinylIcon,
} from './index';

/**
 * The base icons are generated from a shared template: decorative
 * (`aria-hidden`) by default, an accessible `role="img"` when given a `title`,
 * and sized by the `size` prop. This exercises that contract for each one so a
 * regression in the template is caught everywhere it is used.
 */
type IconProps = { size?: number; title?: string };
const ICONS: [string, ComponentType<IconProps>][] = [
  ['CheckCircleIcon', CheckCircleIcon],
  ['EyeOffIcon', EyeOffIcon],
  ['MetronomeIcon', MetronomeIcon],
  ['MinusIcon', MinusIcon],
  ['PauseIcon', PauseIcon],
  ['SaveIcon', SaveIcon],
  ['TrashIcon', TrashIcon],
  ['VinylIcon', VinylIcon],
];

describe.each(ICONS)('%s', (_name, Icon) => {
  it('renders as decorative (aria-hidden) with no title', () => {
    const { container } = render(<Icon />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders as an accessible image when titled', () => {
    render(<Icon title="Label" />);
    expect(screen.getByRole('img', { name: 'Label' })).toBeDefined();
  });

  it('applies the size prop to width and height', () => {
    const { container } = render(<Icon size={30} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('30');
    expect(svg?.getAttribute('height')).toBe('30');
  });

  it('falls back to size 24 when size is omitted', () => {
    const { container } = render(<Icon />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });
});
