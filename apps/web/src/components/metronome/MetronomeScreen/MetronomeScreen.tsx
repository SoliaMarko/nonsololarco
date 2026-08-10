'use client';

import { useCallback, useEffect, useState } from 'react';

import { MOCK_PRACTICE_HISTORY } from '@/src/data/metronome/metronome.mock';
import { useMetronomeClicker } from '@/src/hooks/useMetronomeClicker';
import { useTapTempo } from '@/src/hooks/useTapTempo';

import { ChooserSong, MetronomePhase, PracticeSession, TimeSignature } from '@/src/lib/types/metronome.types';

import BeatDots from '../BeatDots';
import BpmControl from '../BpmControl';
import HistoryDrawer from '../HistoryDrawer';
import MetronomeToast from '../MetronomeToast';
import MetronomeTopBar from '../MetronomeTopBar';
import MetronomeTransport from '../MetronomeTransport';
import Pendulum from '../Pendulum';
import SongChooser from '../SongChooser';
import TrackBadge from '../TrackBadge';

/**
 * Top-level metronome screen that manages all local state: phase
 * (choose vs play), BPM, time signature, playback, beat tracking,
 * practice history, and overlay/drawer visibility.
 */
export default function MetronomeScreen() {
  const [phase, setPhase] = useState<MetronomePhase>('choose');
  const [tracked, setTracked] = useState<ChooserSong | 'skip' | null>(null);
  const [bpm, setBpm] = useState(92);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(-1);
  const [signature, setSignature] = useState<TimeSignature>(4);
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState<PracticeSession[]>(MOCK_PRACTICE_HISTORY);

  const click = useMetronomeClicker();
  const tap = useTapTempo();

  const deleteEntry = useCallback((id: string, restore?: PracticeSession) => {
    if (restore) {
      setHistory((h) => [restore, ...h]);
      return;
    }
    setHistory((h) => h.filter((x) => x.id !== id));
  }, []);

  // Beat scheduler
  useEffect(() => {
    if (!playing) {
      setBeat(-1);
      return;
    }
    let b = 0;
    const tick = () => {
      setBeat(b % signature);
      click(b % signature === 0);
      b++;
    };
    tick();
    const id = setInterval(tick, 60000 / bpm);
    return () => clearInterval(id);
  }, [playing, bpm, signature, click]);

  const handlePick = (song: ChooserSong) => {
    setTracked(song);
    setBpm(song.bpm);
    setPhase('play');
  };

  const handleSkip = () => {
    setTracked('skip');
    setPhase('play');
  };

  const handleAdd = () => {
    setTracked({ bpm: 120, key: 'C', number: 0, ready: 'new', title: 'Новий твір' });
    setPhase('play');
    setToast('Чернетку додано в репертуар');
    setTimeout(() => setToast(null), 2200);
  };

  const handleSave = () => {
    setPlaying(false);
    if (tracked && tracked !== 'skip') {
      setToast(`Запис додано в історію «${tracked.title}»`);
      setTimeout(() => setToast(null), 2600);
    }
  };

  const handleBack = () => {
    setPhase('choose');
  };

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden text-primary-light"
      style={{
        background: 'radial-gradient(120% 90% at 50% 12%, #3a3024 0%, #221c14 45%, #14100b 100%)',
      }}
    >
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.025) 0.6px, transparent 0.7px)',
          backgroundSize: '4px 4px',
        }}
      />

      <MetronomeTopBar
        onBack={handleBack}
        onMenuOpen={() => setMenuOpen(true)}
        onSignatureChange={setSignature}
        signature={signature}
      />

      <BpmControl bpm={bpm} onBpmChange={setBpm} onTap={() => tap(setBpm)} />

      <div className="relative z-4 flex flex-1 items-center justify-center">
        <Pendulum bpm={bpm} playing={playing} />
      </div>

      <BeatDots activeBeat={beat} signature={signature} />

      <div className="relative z-5 flex flex-col items-center gap-3.5" style={{ padding: '0 22px 20px' }}>
        <TrackBadge onChangeTrack={handleBack} tracked={tracked} />
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
        />
      )}

      {phase === 'choose' && (
        <SongChooser onAdd={handleAdd} onPick={handlePick} onSkip={handleSkip} />
      )}

      {toast && <MetronomeToast message={toast} />}
    </div>
  );
}
