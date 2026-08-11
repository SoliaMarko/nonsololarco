'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

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
import MetronomeToast from '../MetronomeToast';
import MetronomeTopBar from '../MetronomeTopBar';
import MetronomeTransport from '../MetronomeTransport';
import Pendulum from '../Pendulum';
import SongChooser from '../SongChooser';
import TrackBadge from '../TrackBadge';

let nextId = 100;

/**
 * Formats a duration in milliseconds as a human-readable Ukrainian string
 * — e.g. "3 хв" or "< 1 хв".
 */
function formatDurationMs(ms: number): string {
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return '< 1 хв';
  return `${minutes} хв`;
}

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
  const router = useRouter();

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
    setToast(`«${title}» додано в репертуар`);
    setTimeout(() => setToast(null), 2200);
  };

  const handleSave = () => {
    setPlaying(false);

    if (tracked && tracked !== 'skip') {
      const startedAtMs = playStartRef.current ?? Date.now();
      const entry: PracticeSession = {
        bpm,
        duration: formatDurationMs(Date.now() - startedAtMs),
        id: `h-${nextId++}`,
        song: tracked.title,
        songNumber: tracked.number,
        startedAt: new Date(startedAtMs).toISOString(),
      };
      setHistory((prev) => [entry, ...prev]);
      setToast(`Сесію збережено · «${tracked.title}»`);
      setTimeout(() => setToast(null), 2600);
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
    router.back();
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

      <BpmControl bpm={bpm} onBpmChange={setBpm} onTap={() => tap(setBpm)} />

      <div className="relative z-4 flex flex-1 items-center justify-center">
        <Pendulum getBeatPosition={getBeatPosition} playing={playing} />
      </div>

      <BeatDots activeBeat={beat} signature={signature} />

      <div className="pli-6 relative z-5 flex flex-col items-center gap-3 pbe-4">
        <TrackBadge onChangeTrack={handleSwitchSong} tracked={tracked} />
        <MetronomeTransport
          onSave={handleSave}
          onTogglePlay={() => setPlaying((p) => !p)}
          playing={playing}
          tracked={tracked}
        />
      </div>

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
          onDismiss={handleDismissChooser}
          onPick={handlePick}
          onSkip={handleSkip}
          songs={songs}
        />
      )}

      {toast && <MetronomeToast message={toast} />}
    </div>
  );
}
