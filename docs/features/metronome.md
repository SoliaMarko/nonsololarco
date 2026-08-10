# Metronome (offline)

> A fullscreen practice metronome with visual pendulum, adjustable BPM, tap
> tempo, song tracking, and practice history — no backend required.

**Status:** In progress
**Added:** 2026-08
**Code:** `apps/web/src/components/metronome/`, `apps/web/app/metronome/`

---

## Behaviour

The metronome opens as a standalone fullscreen page at `/metronome` with a
warm-dark stage aesthetic. It does not use the main app shell navigation.

### Song chooser (entry phase)

On first load the user sees a fullscreen overlay asking which song to track.
Options:

- **Pick a song** from the repertoire list (search supported).
- **"Новий твір"** — placeholder for creating a new piece (not yet wired).
- **"Просто грати"** — skip tracking and start the metronome freely.

### Metronome stage (play phase)

- **Pendulum** — a classic visual metronome that swings in time with the BPM.
- **BPM control** — large BPM display, draggable ruler strip, +/− buttons, and
  a TAP button for tap tempo.
- **Beat dots** — a row of dots that flash in sequence with the beat. The
  downbeat (first dot) flashes red; subsequent dots flash yellow.
- **Time signature** — 4/4, 3/4, or 6/4, selectable from the top bar.
- **Transport** — large play/pause button. When a song is tracked and the
  metronome is playing, a "Завершити та зберегти" (save session) button appears.
- **Track badge** — shows which song is being tracked (emerald), or "Без
  трекінгу" (no tracking) in muted style.
- **Toast** — appears briefly when a session is saved.

### History drawer

Accessible via the burger menu in the top bar. Shows:

- Stats banner: total songs, sessions, and minutes practised.
- Grouped history: sessions grouped by song, each expandable to show individual
  entries with date, BPM, and duration.
- Delete with undo: entries can be deleted, with a 3-second undo bar.
- Empty state when no history exists.

### FAB

`MetronomeFab` is a reusable floating action button intended for placement on
other pages (e.g. repertoire). It shows three expanding pulse rings on mount
that stop after 4.8 s.

## URL state

None. All state is local to the component.

## API

None. This is a fully offline feature. Practice history is local (mock data
for now).

## Implementation notes

- **Audio** uses the Web Audio API via `useMetronomeClicker` — oscillator pings
  at 1400 Hz (accent) and 900 Hz (normal). The AudioContext is created lazily
  on first play. Errors are silently caught so the feature works without audio
  permission.
- **Fonts** — Alfa Slab One, Oswald, Space Mono, and Spectral are loaded via
  `next/font/google` in `app/metronome/layout.tsx` and passed as CSS variables.
- **Auth** — `/metronome` is listed in `PUBLIC_PATHS` in the middleware, so it
  doesn't require login.
- **Pendulum animation** — CSS `@keyframes mt-swing` with duration derived from
  BPM via the `--beat` custom property.
- **BPM ruler** — uses pointer events for drag; mask-image fades at edges.

## Edge cases

- No audio: the metronome works visually even if the browser blocks
  AudioContext creation.
- BPM is clamped to 40–240.
- Tap tempo discards taps older than 3 seconds to avoid stale averages.

## Tests

- Unit: `src/utils/metronome.utils.test.ts`
- Unit: `src/hooks/useMetronomeClicker/useMetronomeClicker.test.ts`
- Unit: `src/hooks/useTapTempo/useTapTempo.test.ts`
- Unit: `src/components/metronome/BeatDots/BeatDots.test.tsx`
- Unit: `src/components/metronome/Pendulum/Pendulum.test.tsx`
- Unit: `src/components/metronome/TrackBadge/TrackBadge.test.tsx`
- Unit: `src/components/metronome/MetronomeTransport/MetronomeTransport.test.tsx`
- Unit: `src/components/metronome/MetronomeTopBar/MetronomeTopBar.test.tsx`
- Unit: `src/components/metronome/MetronomeToast/MetronomeToast.test.tsx`
- Unit: `src/components/metronome/MetronomeFab/MetronomeFab.test.tsx`
