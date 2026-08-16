import { cn } from '@/src/utils/cn';
import { TrackPerformer, shouldHighlightLead } from '@/src/utils/track-performers.utils';

/**
 * Props for TrackPerformerNames. Expects performers pre-sorted by
 * `getTrackPerformers()` — current user first, then the rest alphabetically.
 */
export interface TrackPerformerNamesProps {
  className?: string;
  /** Dims every name — used on archived rows, where the row is struck through */
  isMuted?: boolean;
  /**
   * Clips the list to one line with an ellipsis. Needs a width constraint from
   * `className` (or a `min-w-0` ancestor) and a block-level display to apply —
   * `truncate` does nothing on a plain inline element.
   */
  isTruncated?: boolean;
  /** Ordered by `getTrackPerformers()`: the current user first, then the rest */
  performers: readonly TrackPerformer[];
}

/**
 * Renders a track's performers as a comma-separated list, with the lead's name
 * in the accent colour.
 *
 * The lead is only distinguished when there's more than one performer — on a
 * one-person track the highlight would mark the only name on the row.
 *
 * The whole list truncates as one string rather than per name, so a long
 * roster degrades to `"Solomiia, Anna, Ja…"` instead of clipping each entry.
 */
export default function TrackPerformerNames({
  className,
  isMuted = false,
  isTruncated = false,
  performers,
}: TrackPerformerNamesProps) {
  const highlightLead = shouldHighlightLead(performers);

  return (
    <span className={cn(isTruncated && 'truncate', className)}>
      {performers.map((performer, index) => (
        <span key={performer.id}>
          {index > 0 ? ', ' : null}
          <span
            className={cn(
              highlightLead && performer.isLead && 'text-accent-red font-semibold',
              highlightLead && performer.isLead && isMuted && 'opacity-60',
            )}
          >
            {performer.name}
          </span>
        </span>
      ))}
    </span>
  );
}
