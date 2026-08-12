import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Track } from '@nonsololarco/types';

import { mockIntl } from '@/src/test/intl-mock';

import RepertoireFilterBar from './RepertoireFilterBar';

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock('next-intl', () => mockIntl.nextIntl);
vi.mock('@/i18n/navigation', () => mockIntl.navigation);

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
  mockIntl.reset();
  mockSearchParams = new URLSearchParams();
  mockActiveBand.activeBand = undefined;
  mockActiveBand.activeBandId = '';
  mockActiveBand.isSpecificBandSelected = false;
  mockTracks = tracks;
});

describe('RepertoireFilterBar', () => {
  it('renders all status filter pills', () => {
    render(<RepertoireFilterBar />);

    expect(findButtons('pages.repertoire.statusAll').length).toBeGreaterThan(0);
    expect(findButtons('pages.repertoire.statusReady').length).toBeGreaterThan(0);
    expect(findButtons('pages.repertoire.statusLearning').length).toBeGreaterThan(0);
    expect(findButtons('pages.repertoire.statusNew').length).toBeGreaterThan(0);
  });

  it('marks the active filter as pressed', () => {
    mockSearchParams = new URLSearchParams('status=ready');
    render(<RepertoireFilterBar />);

    const readyPills = findButtons('pages.repertoire.statusReady');
    expect(readyPills.some((b) => b.getAttribute('aria-pressed') === 'true')).toBe(true);
  });

  it('updates URL when a filter pill is clicked', () => {
    render(<RepertoireFilterBar />);

    fireEvent.click(getFirstButton('repertoire.statusReady'));

    expect(mockPush).toHaveBeenCalledWith('?status=ready', { scroll: false });
  });

  it('removes status param when "All" is clicked', () => {
    mockSearchParams = new URLSearchParams('status=ready');
    render(<RepertoireFilterBar />);

    fireEvent.click(getFirstButton('repertoire.statusAll'));

    expect(mockPush).toHaveBeenCalledWith('?', { scroll: false });
  });

  it('shows archived and active counts on extra filters', () => {
    render(<RepertoireFilterBar />);

    const archiveBtns = findButtons('pages.repertoire.extraFilterArchive');
    const activeBtns = findButtons('pages.repertoire.extraFilterActive');

    expect(archiveBtns[0]?.textContent).toContain('1');
    expect(activeBtns[0]?.textContent).toContain('2');
  });

  it('shows zero counts when there are no tracks', () => {
    mockTracks = [];
    render(<RepertoireFilterBar />);

    expect(findButtons('pages.repertoire.extraFilterArchive')[0]?.textContent).toContain('0');
  });

  describe('Only mine toggle', () => {
    beforeEach(() => {
      mockActiveBand.activeBand = { id: 'band-1', name: 'The Band' };
      mockActiveBand.activeBandId = 'band-1';
      mockActiveBand.isSpecificBandSelected = true;
    });

    it('is visible for a real band', () => {
      render(<RepertoireFilterBar />);

      expect(findButtons('pages.repertoire.onlyMine').length).toBeGreaterThan(0);
    });

    it('is hidden for solo band', () => {
      mockActiveBand.activeBandId = 'solo';
      render(<RepertoireFilterBar />);

      expect(findButtons('pages.repertoire.onlyMine').length).toBe(0);
    });

    it('is hidden when no specific band is selected', () => {
      mockActiveBand.isSpecificBandSelected = false;
      render(<RepertoireFilterBar />);

      expect(findButtons('pages.repertoire.onlyMine').length).toBe(0);
    });

    it('toggles onlyMine param in URL', () => {
      render(<RepertoireFilterBar />);

      fireEvent.click(getFirstButton('pages.repertoire.onlyMine'));

      expect(mockPush).toHaveBeenCalledWith('?onlyMine=true', { scroll: false });
    });

    it('removes onlyMine param when toggled off', () => {
      mockSearchParams = new URLSearchParams('onlyMine=true');
      render(<RepertoireFilterBar />);

      fireEvent.click(getFirstButton('pages.repertoire.onlyMine'));

      expect(mockPush).toHaveBeenCalledWith('?', { scroll: false });
    });

    it('shows count of tracks where user participates', () => {
      render(<RepertoireFilterBar />);

      expect(findButtons('pages.repertoire.onlyMine')[0]?.textContent).toContain('2');
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
    });

    it('hides link when no band is selected', () => {
      render(<RepertoireFilterBar />);

      const links = screen.queryAllByRole('link');
      const bandLink = links.find((a) => a.getAttribute('href')?.startsWith('/band/'));
      expect(bandLink).toBeUndefined();
    });
  });
});
