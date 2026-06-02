/**
 * Calculates an SVG viewBox string from bounding box coordinates with optional padding.
 *
 * @param x1 - Minimum x coordinate (left edge of bounding box)
 * @param y1 - Minimum y coordinate (top edge of bounding box)
 * @param x2 - Maximum x coordinate (right edge of bounding box)
 * @param y2 - Maximum y coordinate (bottom edge of bounding box)
 * @param padding - Extra space added around the bounding box on all sides (default: 1)
 * @returns A viewBox string in the format "x y width height"
 *
 * @throws {Error} If x2 <= x1 (invalid horizontal bounds)
 * @throws {Error} If y2 <= y1 (invalid vertical bounds)
 * @throws {Error} If padding is negative
 *
 * @example
 * // Circle at center (9,9) with radius 5.5, line to (17,17)
 * calcViewBox({ x1: 3.5, y1: 3.5, x2: 17, y2: 17 })
 * // => "2.5 2.5 15.5 15.5"
 *
 * @example
 * // With custom padding
 * calcViewBox({ x1: 4.3, y1: 5.3, x2: 15, y2: 16 }, 1.5)
 * // => "2.8 3.8 13.4 13.4"
 */
export function calcViewBox(
  { x1, y1, x2, y2 }: { x1: number; x2: number; y1: number; y2: number },
  padding = 1,
): string {
  if (x2 <= x1) throw new Error(`calcViewBox: x2 (${x2}) must be greater than x1 (${x1})`);
  if (y2 <= y1) throw new Error(`calcViewBox: y2 (${y2}) must be greater than y1 (${y1})`);
  if (padding < 0) throw new Error(`calcViewBox: padding (${padding}) must be non-negative`);

  return `${x1 - padding} ${y1 - padding} ${x2 - x1 + padding * 2} ${y2 - y1 + padding * 2}`;
}
