import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Track } from '@nonsololarco/types';

import RepertoireFilterBar from './RepertoireFilterBar';

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockActiveBand = {
  activeBand: undefined as { id: string; name: string } | undefined,
  activeBandId: '',
  isSpecificBandSelected: false,
};

vi.mock('@/src/hooks/global/useActiveBand', () => ({
  useActiveBand: () => mockActiveBand,
}));

const mockUser = { id: 'user-1', name: 'Solomiia' };

vi.mock('@/src/hooks/global/useAuth', () => ({
  useAuth: () => ({ user: mockUser }),
}));

const tracks: Track[] = [
  {
    id: 't-1', order: 1, title: 'Song A', bpm: 120, musicalKey: 'C',
    duration: '3:20', side: 'a', status: 'ready',
    leadMember: { id: 'user-1', name: 'Solomiia' }, members: [],
  },
  {
    id: 't-2', order: 2, title: 'Song B', bpm: 100, musicalKey: 'D',
    duration: '4:00', side: 'a', status: 'learning',
    leadMember: { id: 'user-2', name: 'Anna' }, members: [{ id: 'user-1', name: 'Solomiia' }],
  },
  {
    id: 't-3', order: 3, title: 'Song C', bpm: 90, musicalKey: 'E',
    duration: '2:50', side: 'b', status: 'archived',
    leadMember: { id: 'user-2', name: 'Anna' }, members: [],
  },
];

let mockTracks: Track[] = tracks;

vi.mock('@/src/lib/hooks/useRepertoire', () => ({
  SOLO_BAND_ID: 'solo',
  useRepertoireTracks: () => ({ data: { data: mockTracks } }),
}));

vi.mock('@/src/icons/achievements', () => ({
  StarOutlineIcon: () => <span data-icon="star" />,
}));

vi.mock('@/src/icons/base', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/src/icons/base')>();
  return {
    ...actual,
    ArrowRightSolidIcon: () => <span data-icon="arrow" />,
    ChevronIcon: () => <span data-icon="chevron" />,
    SortIcon: () => <span data-icon="sort" />,
  };
});

function findButtons(text: string) {
  return screen.getAllByRole('button').filter((b) => b.textContent?.includes(text));
}

function getFirstButton(text: string) {
  const [button] = findButtons(text);
  if (!button) throw new Error(`Button not found: ${text}`);
  return button;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockSearchParams = new URLSearchParams();
  mockActiveBand.activeBand = undefined;
  mockActiveBand.activeBandId = '';
  mockActiveBand.isSpecificBandSelected = false;
  mockTracks = tracks;
});

describe('RepertoireFilterBar', () => {
  it('renders all status filter pills', () => {
    render(<RepertoireFilterBar />);

    expect(findButtons('All').length).toBeGreaterThan(0);
    expect(findButtons('Ready').length).toBeGreaterThan(0);
    expect(findButtons('Learning').length).toBeGreaterThan(0);
    expect(findButtons('New').length).toBeGreaterThan(0);
  });

  it('marks the active filter as pressed', () => {
    mockSearchParams = new URLSearchParams('status=ready');
    render(<RepertoireFilterBar />);

    const readyPills = findButtons('Ready');
    expect(readyPills.some((b) => b.getAttribute('aria-pressed') === 'true')).toBe(true);
  });

  it('updates URL when a filter pill is clicked', () => {
    render(<RepertoireFilterBar />);

    fireEvent.click(getFirstButton('Ready'));

    expect(mockPush).toHaveBeenCalledWith('?status=ready', { scroll: false });
  });

  it('removes status param when "All" is clicked', () => {
    mockSearchParams = new URLSearchParams('status=ready');
    render(<RepertoireFilterBar />);

    fireEvent.click(getFirstButton('All'));

    expect(mockPush).toHaveBeenCalledWith('?', { scroll: false });
  });

  it('shows archived and active counts on extra filters', () => {
    render(<RepertoireFilterBar />);

    const archiveBtns = findButtons('Archive');
    const activeBtns = findButtons('Active');

    expect(archiveBtns[0]?.textContent).toContain('1');
    expect(activeBtns[0]?.textContent).toContain('2');
  });

  it('shows zero counts when there are no tracks', () => {
    mockTracks = [];
    render(<RepertoireFilterBar />);

    expect(findButtons('Archive')[0]?.textContent).toContain('0');
  });

  describe('Only mine toggle', () => {
    beforeEach(() => {
      mockActiveBand.activeBand = { id: 'band-1', name: 'The Band' };
      mockActiveBand.activeBandId = 'band-1';
      mockActiveBand.isSpecificBandSelected = true;
    });

    it('is visible for a real band', () => {
      render(<RepertoireFilterBar />);

      expect(findButtons('Only mine').length).toBeGreaterThan(0);
    });

    it('is hidden for solo band', () => {
      mockActiveBand.activeBandId = 'solo';
      render(<RepertoireFilterBar />);

      expect(findButtons('Only mine').length).toBe(0);
    });

    it('is hidden when no specific band is selected', () => {
      mockActiveBand.isSpecificBandSelected = false;
      render(<RepertoireFilterBar />);

      expect(findButtons('Only mine').length).toBe(0);
    });

    it('toggles onlyMine param in URL', () => {
      render(<RepertoireFilterBar />);

      fireEvent.click(getFirstButton('Only mine'));

      expect(mockPush).toHaveBeenCalledWith('?onlyMine=true', { scroll: false });
    });

    it('removes onlyMine param when toggled off', () => {
      mockSearchParams = new URLSearchParams('onlyMine=true');
      render(<RepertoireFilterBar />);

      fireEvent.click(getFirstButton('Only mine'));

      expect(mockPush).toHaveBeenCalledWith('?', { scroll: false });
    });

    it('shows count of tracks where user participates', () => {
      render(<RepertoireFilterBar />);

      expect(findButtons('Only mine')[0]?.textContent).toContain('2');
    });
  });

  describe('sort normalization', () => {
    it('treats unsupported sort values as default', () => {
      mockSearchParams = new URLSearchParams('sort=trackOrder&order=asc');
      render(<RepertoireFilterBar />);

      const sortBtns = findButtons('Sort');
      expect(sortBtns.length).toBeGreaterThan(0);
      expect(sortBtns[0]?.textContent).toContain('Sort');
      expect(sortBtns[0]?.textContent).not.toContain('Track');
    });

    it('treats completely unknown sort fields as default', () => {
      mockSearchParams = new URLSearchParams('sort=foobar&order=desc');
      render(<RepertoireFilterBar />);

      const sortBtns = findButtons('Sort');
      expect(sortBtns.length).toBeGreaterThan(0);
    });
  });

  describe('band page link', () => {
    it('shows link when a specific band is selected', () => {
      mockActiveBand.activeBand = { id: 'band-1', name: 'The Band' };
      mockActiveBand.activeBandId = 'band-1';
      mockActiveBand.isSpecificBandSelected = true;
      render(<RepertoireFilterBar />);

      const links = screen.getAllByRole('link').filter((a) => a.getAttribute('href') === '/band/band-1');
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]?.textContent).toContain('The Band');
    });

    it('hides link when no band is selected', () => {
      render(<RepertoireFilterBar />);

      const links = screen.queryAllByRole('link');
      const bandLink = links.find((a) => a.getAttribute('href')?.startsWith('/band/'));
      expect(bandLink).toBeUndefined();
    });
  });
});
