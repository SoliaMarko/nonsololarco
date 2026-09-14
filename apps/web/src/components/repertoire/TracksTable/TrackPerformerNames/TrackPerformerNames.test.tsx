import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TrackPerformer } from '@/src/utils/track-performers.utils';

import TrackPerformerNames from './TrackPerformerNames';

const LEAD: TrackPerformer = { id: 'u-anna', name: 'Anna', isLead: true };
const MEMBER: TrackPerformer = { id: 'u-jared', name: 'Jared', isLead: false };
const OTHER: TrackPerformer = { id: 'u-solomiia', name: 'Solomiia', isLead: false };

describe('TrackPerformerNames', () => {
  it('renders a single performer with no separator', () => {
    const { container } = render(<TrackPerformerNames performers={[LEAD]} />);

    expect(container.textContent).toBe('Anna');
  });

  it('joins multiple performers with commas, in the order given', () => {
    const { container } = render(<TrackPerformerNames performers={[OTHER, LEAD, MEMBER]} />);

    expect(container.textContent).toBe('Solomiia, Anna, Jared');
  });

  it('highlights the lead when there is more than one performer', () => {
    render(<TrackPerformerNames performers={[LEAD, MEMBER]} />);

    const anna = screen.getByText('Anna');
    const jared = screen.getByText('Jared');

    expect(anna.className).toContain('font-semibold');
    expect(jared.className).not.toContain('font-semibold');
  });

  it('does not highlight a lone performer — there is nothing to contrast', () => {
    render(<TrackPerformerNames performers={[LEAD]} />);

    expect(screen.getByText('Anna').className).not.toContain('font-semibold');
  });

  it('highlights the lead even when they are not listed first', () => {
    render(<TrackPerformerNames performers={[OTHER, LEAD]} />);

    expect(screen.getByText('Anna').className).toContain('font-semibold');
  });

  it('dims the highlighted lead when muted', () => {
    render(<TrackPerformerNames isMuted performers={[LEAD, MEMBER]} />);

    expect(screen.getByText('Anna').className).toContain('opacity-60');
  });

  it('renders nothing for an empty list', () => {
    const { container } = render(<TrackPerformerNames performers={[]} />);

    expect(container.textContent).toBe('');
  });

  it('truncates the list as a whole when isTruncated is true', () => {
    const { container } = render(
      <TrackPerformerNames isTruncated performers={[LEAD, MEMBER, OTHER]} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('truncate');
    expect(screen.getByText('Jared').className).not.toContain('truncate');
  });

  it('does not truncate by default', () => {
    const { container } = render(<TrackPerformerNames performers={[LEAD, MEMBER]} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toContain('truncate');
  });
});
