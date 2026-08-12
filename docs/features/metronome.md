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
- **"Новий твір"** — opens an inline form (title + optional BPM). If BPM is
  omitted, the current metronome BPM is used. The new song is added to the
  repertoire list and auto-selected for tracking.
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
- **Toast** — the DS `Toast` component (`src/components/ui/Toast`) appears
  briefly when a session is saved or a song is added. Supports `success`,
  `error` and `info` variants.

### History drawer

Accessible via the burger menu in the top bar. Shows:

- Stats banner: total songs, sessions, and minutes practised.
- Grouped history: sessions grouped by song, each expandable to show individual
  entries with date, BPM, and duration. Ordered newest first, both within a
  song and across songs.
- Delete with undo: entries can be deleted, with a 3-second undo bar.
- Empty state when no history exists.

### FAB

`MetronomeFab` is a reusable floating action button intended for placement on
other pages (e.g. repertoire). It shows three expanding pulse rings on mount
that stop after 4.8 s.

## URL state

None. All state is local to the component.

## API

None. This is a fully offline feature. Practice history is stored in
component state (seeded with mock data). Sessions are created automatically
when the user stops/saves the metronome while a song is tracked — each
entry records `startedAt`, BPM, duration, and song. Navigating back to the
chooser while playing auto-saves the current session. Prepared for future API
migration: the `PracticeSession` interface is the contract.

`startedAt` is an ISO timestamp and the single source of truth for when a
session happened — it is both the sort key and the input to the displayed
label, via `formatSessionDate`. Storing a pre-formatted date string instead
would leave nothing reliable to sort by.

## Implementation notes

- **Audio** uses the Web Audio API via `useMetronomeClicker` — oscillator pings
  at 1400 Hz (accent) and 900 Hz (normal). The AudioContext is created lazily
  on first play. Errors are silently caught so the feature works without audio
  permission.
- **Fonts** — Alfa Slab One, Oswald, Space Mono, and Spectral are loaded via
  `next/font/google` in `app/metronome/layout.tsx` and passed as CSS variables.
- **Auth** — `/metronome` is listed in `PUBLIC_PATHS` in the middleware, so it
  doesn't require login.
- **Pendulum animation** — driven by a `requestAnimationFrame` loop that
  samples the audio clock each frame, not CSS keyframes. This avoids restarts
  on every beat and cannot drift from the click track. On short viewports
  (≤ 44 rem) the pendulum scales down via CSS `scale` to avoid overlapping
  the BPM controls.
- **BPM ruler** — uses pointer events for drag; mask-image fades at edges.

## Edge cases

- No audio: the metronome works visually even if the browser blocks
  AudioContext creation.
- BPM is clamped to 40–240.
- Tap tempo discards taps older than 3 seconds to avoid stale averages.

## Tests

All paths are relative to `apps/web/`.

- Unit: `src/utils/audio.utils.test.ts`
- Unit: `src/utils/metronome.utils.test.ts`
- Unit: `src/hooks/useMetronomeClicker/useMetronomeClicker.test.ts`
- Unit: `src/hooks/useMetronomeEngine/useMetronomeEngine.test.ts`
- Unit: `src/hooks/useTapTempo/useTapTempo.test.ts`
- Unit: `src/components/metronome/BeatDots/BeatDots.test.tsx`
- Unit: `src/components/metronome/BpmControl/BpmControl.test.tsx`
- Unit: `src/components/metronome/BpmControl/BpmRuler/BpmRuler.test.tsx`
- Unit: `src/components/metronome/HistoryDrawer/HistoryDrawer.test.tsx`
- Unit: `src/components/metronome/MetronomeFab/MetronomeFab.test.tsx`
- Unit: `src/components/metronome/MetronomeScreen/MetronomeScreen.test.tsx`
- Unit: `src/components/metronome/MetronomeTopBar/MetronomeTopBar.test.tsx`
- Unit: `src/components/metronome/MetronomeTransport/MetronomeTransport.test.tsx`
- Unit: `src/components/metronome/Pendulum/Pendulum.test.tsx`
- Unit: `src/components/metronome/SongChooser/SongChooser.test.tsx`
- Unit: `src/components/metronome/TimeSignatureSelect/SigDropdown/SigDropdown.test.tsx`
- Unit: `src/components/metronome/TimeSignatureSelect/TimeSignatureSelect.test.tsx`
- Unit: `src/components/metronome/TrackBadge/TrackBadge.test.tsx`
- Unit: `src/components/ui/Toast/Toast.test.tsx`
- Unit: `src/icons/base/baseIcons.test.tsx`
- Unit: `src/icons/base/MenuIcon.test.tsx`
