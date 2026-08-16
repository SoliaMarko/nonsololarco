'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';

import { MOCK_PRACTICE_HISTORY, MOCK_REPERTOIRE_SONGS } from '@/src/data/metronome/metronome.mock';
import { useMetronomeEngine } from '@/src/hooks/useMetronomeEngine';
import { useTapTempo } from '@/src/hooks/useTapTempo';
import {
  ChooserSong,
  DEFAULT_SIGNATURE,
  MetronomePhase,
  PracticeSession,
  TimeSignatureDef,
} from '@/src/lib/types/metronome.types';

import BeatDots from '../BeatDots';
import BpmControl from '../BpmControl';
import HistoryDrawer from '../HistoryDrawer';
import Toast from '@/src/components/ui/Toast';
import MetronomeTopBar from '../MetronomeTopBar';
import MetronomeTransport from '../MetronomeTransport';
import Pendulum from '../Pendulum';
import SongChooser from '../SongChooser';
import TrackBadge from '../TrackBadge';

let nextId = 100;

/**
 * Top-level metronome screen that manages all local state: phase
 * (choose vs play), BPM, time signature, playback, beat tracking,
 * practice history, song list, and overlay/drawer visibility.
 */
export default function MetronomeScreen() {
  const [phase, setPhase] = useState<MetronomePhase>('choose');
  const [tracked, setTracked] = useState<ChooserSong | 'skip' | null>(null);
  const [bpm, setBpm] = useState(92);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(-1);
  const [signature, setSignature] = useState<TimeSignatureDef>(DEFAULT_SIGNATURE);
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState<PracticeSession[]>(MOCK_PRACTICE_HISTORY);
  const [songs, setSongs] = useState<ChooserSong[]>(MOCK_REPERTOIRE_SONGS);

  const playStartRef = useRef<number | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const t = useTranslations('pages.metronome');

  const tap = useTapTempo();

  const { getBeatPosition } = useMetronomeEngine({
    beats: signature.beats,
    bpm,
    onBeat: setBeat,
    playing,
  });

  // Clear the beat indicator whenever playback stops
  useEffect(() => {
    if (!playing) setBeat(-1);
  }, [playing]);

  // Track when playing starts/stops for duration calculation
  useEffect(() => {
    if (playing) {
      playStartRef.current = Date.now();
    }
  }, [playing]);

  // Clear toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const deleteEntry = useCallback((id: string, restore?: PracticeSession) => {
    if (restore) {
      setHistory((h) => [restore, ...h]);
      return;
    }
    setHistory((h) => h.filter((x) => x.id !== id));
  }, []);

  const handlePick = (song: ChooserSong) => {
    setTracked(song);
    setBpm(song.bpm);
    setPhase('play');
  };

  const handleSkip = () => {
    setTracked('skip');
    setPhase('play');
  };

  /**
   * Closes the chooser without touching the current song or tempo. On the
   * very first open there is nothing selected yet, so dismissing is treated
   * as "just play" — the same outcome, minus the extra click.
   */
  const handleDismissChooser = () => {
    if (!tracked) setTracked('skip');
    setPhase('play');
  };

  const handleAdd = (title: string, inputBpm?: number, inputSignature?: TimeSignatureDef) => {
    const songBpm = inputBpm ?? bpm;
    const newNumber = songs.length + 1;
    const newSong: ChooserSong = {
      bpm: songBpm,
      key: '—',
      number: newNumber,
      ready: 'new',
      title,
    };
    setSongs((prev) => [...prev, newSong]);
    setTracked(newSong);
    setBpm(songBpm);
    if (inputSignature) setSignature(inputSignature);
    setPhase('play');
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(t('toastAdded', { title }));
    toastTimerRef.current = setTimeout(() => setToast(null), 2200);
  };

  const handleSave = () => {
    setPlaying(false);

    if (tracked && tracked !== 'skip') {
      const startedAtMs = playStartRef.current ?? Date.now();
      const durationMs = Date.now() - startedAtMs;
      const entry: PracticeSession = {
        bpm,
        durationMs,
        id: `h-${nextId++}`,
        song: tracked.title,
        songNumber: tracked.number,
        startedAt: new Date(startedAtMs).toISOString(),
      };
      setHistory((prev) => [entry, ...prev]);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast(t('toastSaved', { title: tracked.title }));
      toastTimerRef.current = setTimeout(() => setToast(null), 2600);
    }

    playStartRef.current = null;
  };

  /** Stops playback, saving the session first when one is being tracked. */
  const stopAndSave = () => {
    if (playing && tracked && tracked !== 'skip') {
      handleSave();
      return;
    }
    setPlaying(false);
  };

  const handleSwitchSong = () => {
    stopAndSave();
    setPhase('choose');
  };

  const handleExit = () => {
    stopAndSave();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="text-primary-light relative flex h-dvh w-full flex-col overflow-hidden bg-[radial-gradient(120%_90%_at_50%_12%,#3a3024_0%,#221c14_45%,#14100b_100%)]">
      {/* Grain texture overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.025)_0.6px,transparent_0.7px)] bg-size-[4px_4px]" />

      <MetronomeTopBar
        onMenuOpen={() => setMenuOpen(true)}
        onSignatureChange={setSignature}
        signature={signature}
      />

      {/* Main content — vertically centred in the remaining space so the
          layout doesn't stretch on tall screens. Each child centres itself
          horizontally; the wrapper stays full-width so BpmRuler spans edge
          to edge. */}
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <BpmControl bpm={bpm} onBpmChange={setBpm} onTap={() => tap(setBpm)} />

        <div className="relative z-4 flex min-h-0 flex-1 items-center justify-center" style={{ maxHeight: '22rem' }}>
          <Pendulum getBeatPosition={getBeatPosition} playing={playing} />
        </div>

        <BeatDots activeBeat={beat} signature={signature} />

        <div className="pli-6 relative z-5 flex flex-col items-center gap-3">
          <TrackBadge onChangeTrack={handleSwitchSong} tracked={tracked} />
          <MetronomeTransport
            onSave={handleSave}
            onTogglePlay={() => setPlaying((p) => !p)}
            playing={playing}
            tracked={tracked}
          />
        </div>
      </div>

      {/* Bottom spacer — prevents controls from hugging the screen edge on
          tall viewports while staying flush on compact ones. */}
      <div className="min-h-4 max-h-16 flex-1" />

      {menuOpen && (
        <HistoryDrawer
          history={history}
          onClose={() => setMenuOpen(false)}
          onDelete={deleteEntry}
          onExit={handleExit}
        />
      )}

      {phase === 'choose' && (
        <SongChooser
          onAdd={handleAdd}
          onBack={handleExit}
          onDismiss={handleDismissChooser}
          onPick={handlePick}
          onSkip={handleSkip}
          songs={songs}
        />
      )}

      {toast && (
        <Toast
          className="absolute inset-x-0 bottom-5.5 z-40 mx-auto w-fit"
          message={toast}
          style={{ animation: 'toast-in 0.3s ease-out' }}
        />
      )}
    </div>
  );
}
