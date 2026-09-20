/**
 * Geometry for the ceiling lamp illustration.
 *
 * The lamp ships as three raster layers cut from one render: the body in its
 * lit and unlit states, and the wooden pull knob on its own. The knob is a
 * separate file because the tug has to move it independently — the body keeps
 * a length of rope painted below where the knob rests, so pulling the knob
 * down pays rope out instead of tearing a gap.
 *
 * Every figure below is a fraction of the shared 512x840 source canvas that
 * both body frames are registered to. Percentages rather than pixels, so the
 * layers stay aligned at any rendered height.
 */
export const LAMP_IMAGE = {
  bodyOn: '/illustrations/lamp/lamp-on.png',
  bodyOff: '/illustrations/lamp/lamp-off.png',
  knob: '/illustrations/lamp/lamp-knob.png',
} as const;

/** Intrinsic pixel size of each layer, which next/image needs up front. */
export const LAMP_IMAGE_SIZE = {
  body: { width: 293, height: 480 },
  knob: { width: 49, height: 87 },
} as const;

/** Width as a fraction of height — the 512:840 source canvas. */
export const LAMP_ASPECT = 512 / 840;

/**
 * Where the knob sits at rest, as a percentage of the lamp box. Its bottom
 * edge is the bottom of the box, so a lamp `h` tall hangs exactly `h` deep
 * before the tug adds to it.
 */
export const LAMP_KNOB_BOX = {
  insetInlineStart: `${(340 / 512) * 100}%`,
  insetBlockStart: `${(688 / 840) * 100}%`,
  width: `${(86 / 512) * 100}%`,
} as const;
