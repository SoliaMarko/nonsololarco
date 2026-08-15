import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AiButton from './AiButton';

describe('AiButton', () => {
  it('renders the AI label', () => {
    render(<AiButton />);

    expect(screen.getByText('AI')).toBeDefined();
  });

  it('defaults to md size', () => {
    const { container } = render(<AiButton />);

    // md uses the default retro-primary button with no sm overrides
    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).not.toContain('border-2');
  });

  it('applies sm overrides for compact header usage', () => {
    const { container } = render(<AiButton size="sm" />);

    const button = container.querySelector('button') as HTMLElement;
    // sm adds border-2 and tighter padding
    expect(button.className).toContain('border-2');
    expect(button.className).toContain('min-h-0');
  });

  it('uses a smaller icon at sm size', () => {
    const { container: smContainer } = render(<AiButton size="sm" />);
    const { container: mdContainer } = render(<AiButton size="md" />);

    const smIcon = smContainer.querySelector('svg') as SVGElement;
    const mdIcon = mdContainer.querySelector('svg') as SVGElement;

    // sm: 14px, md: 16px
    expect(Number(smIcon.getAttribute('width'))).toBeLessThan(
      Number(mdIcon.getAttribute('width')),
    );
  });

  it('uses bold text weight at sm size', () => {
    render(<AiButton size="sm" />);

    const text = screen.getByText('AI');
    // The Text component with weight="bold" emits font-bold
    expect(text.className).toContain('font-bold');
  });

  it('uses medium text weight at md size', () => {
    render(<AiButton size="md" />);

    const text = screen.getByText('AI');
    expect(text.className).toContain('font-medium');
  });

  it('applies className to the button', () => {
    const { container } = render(<AiButton className="extra" />);

    const button = container.querySelector('button') as HTMLElement;
    expect(button.className).toContain('extra');
  });

  it('applies textClassName to the inner wrapper', () => {
    const { container } = render(<AiButton textClassName="custom-text" />);

    const wrapper = container.querySelector('button > div') as HTMLElement;
    expect(wrapper.className).toContain('custom-text');
  });
});
