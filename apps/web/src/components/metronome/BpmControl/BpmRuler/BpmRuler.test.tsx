import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BpmRuler from './BpmRuler';

vi.mock('@/src/utils/audio.utils', () => ({
  playBlip: vi.fn(),
}));

/** One BPM step equals this many pixels of horizontal drag (MT_TICK_WIDTH). */
const TICK = 14;

// jsdom's synthetic PointerEvents drop `clientX`, so drags are driven with
// MouseEvents (which carry coordinates) dispatched under the pointer type names
// the component listens for.
function pointerDown(el: Element, clientX: number) {
  el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX }));
}

function pointerMove(clientX: number) {
  document.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX }));
}

function pointerCancel() {
  document.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true }));
}

function setup(bpm: number) {
  const onBpmChange = vi.fn();
  const { container } = render(<BpmRuler bpm={bpm} onBpmChange={onBpmChange} />);
  const strip = container.firstElementChild as HTMLElement;
  return { onBpmChange, strip };
}

// jsdom elements have no pointer-capture methods; the handler calls them. Keep
// the originals so afterEach can undo the assignment — clearAllMocks only wipes
// call history, leaving the stubs on the prototype for unrelated suites.
type PatchedMethod = 'setPointerCapture' | 'releasePointerCapture';
const originals: Partial<Record<PatchedMethod, PropertyDescriptor | undefined>> = {};
const PATCHED: PatchedMethod[] = ['setPointerCapture', 'releasePointerCapture'];

beforeEach(() => {
  for (const method of PATCHED) {
    originals[method] = Object.getOwnPropertyDescriptor(Element.prototype, method);
  }
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
  for (const method of PATCHED) {
    const descriptor = originals[method];
    if (descriptor) Object.defineProperty(Element.prototype, method, descriptor);
    else delete (Element.prototype as Partial<Element>)[method];
  }
});

describe('BpmRuler', () => {
  it('raises the BPM when dragged left', () => {
    const { onBpmChange, strip } = setup(100);
    pointerDown(strip, 200);
    pointerMove(200 - TICK);
    expect(onBpmChange).toHaveBeenCalledWith(101);
  });

  it('lowers the BPM when dragged right', () => {
    const { onBpmChange, strip } = setup(100);
    pointerDown(strip, 200);
    pointerMove(200 + TICK);
    expect(onBpmChange).toHaveBeenCalledWith(99);
  });

  it('clamps at the maximum of 240', () => {
    const { onBpmChange, strip } = setup(239);
    pointerDown(strip, 200);
    pointerMove(200 - TICK * 2);
    expect(onBpmChange).toHaveBeenCalledWith(240);
  });

  it('clamps at the minimum of 40', () => {
    const { onBpmChange, strip } = setup(41);
    pointerDown(strip, 200);
    pointerMove(200 + TICK * 2);
    expect(onBpmChange).toHaveBeenCalledWith(40);
  });

  it('stops responding to moves after the pointer is cancelled', () => {
    const { onBpmChange, strip } = setup(100);
    pointerDown(strip, 200);
    pointerCancel();
    pointerMove(200 - TICK * 3);
    expect(onBpmChange).not.toHaveBeenCalled();
  });
});
