import { Track, TrackMember } from '@nonsololarco/types';

/** A performer on a track, flagged with whether they lead it. */
export interface TrackPerformer extends TrackMember {
  isLead: boolean;
}

/**
 * Builds the display list of everyone who plays on a track, ordered with the
 * current user first.
 *
 * The API keeps the lead separate from `members` (see the data model), so this
 * merges them back into one list — lead first, then the other performers in
 * the order the API returned them — and then moves the current user to the
 * front so a musician always sees their own name at the start of the row.
 *
 * A performer appearing in both `leadMember` and `members` is listed once, as
 * lead. Returns just the lead when there are no other performers, and never
 * returns an empty array — every track has a lead.
 *
 * @param currentUserId Omit, or pass an id not on the track, to keep the
 *   natural lead-first order.
 *
 * @example
 * // lead: Anna, members: [Solomiia, Jared], current user: Solomiia
 * getTrackPerformers(track, solomiiaId)
 * // → [Solomiia, Anna (isLead), Jared]
 */
export function getTrackPerformers(
  track: Pick<Track, 'leadMember' | 'members'>,
  currentUserId?: string,
): TrackPerformer[] {
  const combined: TrackPerformer[] = [
    { ...track.leadMember, isLead: true },
    ...(track.members ?? []).map((member) => ({ ...member, isLead: false })),
  ];

  const performers = combined.filter(
    (performer, index) => combined.findIndex((other) => other.id === performer.id) === index,
  );

  const currentUserIndex = performers.findIndex((performer) => performer.id === currentUserId);

  // -1 = not on this track, 0 = already first; both need no reordering.
  if (currentUserIndex <= 0) return performers;

  const [currentUser] = performers.splice(currentUserIndex, 1);

  return [currentUser as TrackPerformer, ...performers];
}

/**
 * Whether the lead's name should be visually distinguished in a performer list.
 *
 * A solo performer is trivially the lead, so marking them adds noise — the
 * distinction only carries meaning once there's someone to contrast against.
 */
export function shouldHighlightLead(performers: readonly TrackPerformer[]): boolean {
  return performers.length > 1;
}
