import { MOCK_WISHLIST } from '@/src/data/profile/wishlist.mock';
import { MOCK_LEAD_TRACKS } from '@/src/data/repertoire/tracks.mock';
import { cn } from '@/src/utils/cn';

import SeeMoreButton from '../../shared/buttons/SeeMoreButton';
import SectionHeader from '../shared/SectionHeader';
import LeadRow from './LeadRow';
import WishlistRow from './WishlistRow';

export interface ProfileRepertoireProps {
  className?: string;
  /** Max leads shown before "see all" */
  maxLeads?: number;
  /** Max items in wishlist shown before "see all" */
  maxWishes?: number;
  profileId: string;
  /** Redirects to repertoire page */
  repertoireHref?: string;
  /** Redirects to wishlist section on repertoire page */
  wishlistHref?: string;
}

export default function ProfileRepertoire({
  className,
  maxLeads = 4,
  maxWishes = 4,
  //   Will need it later for requesting repertoires
  profileId: _profileId,
  repertoireHref = '/repertoire',
  wishlistHref = '/repertoire#wishlist',
}: ProfileRepertoireProps) {
  const leads = MOCK_LEAD_TRACKS;
  const wishlist = MOCK_WISHLIST;

  const visibleLeads = leads.slice(0, maxLeads);
  const hasMoreLeads = leads.length > maxLeads;

  const publicWishlist = wishlist.filter((wishlistItem) => wishlistItem.visibility === 'public');
  const visibleWishlist = publicWishlist.slice(0, maxWishes);
  const hasMoreWishes = publicWishlist.length > maxWishes;
  const showWishlist = publicWishlist.length > 0;

  return (
    <div className={cn('flex flex-col gap-4 p-6', className)}>
      {/* Repertoire */}
      <section>
        <SectionHeader
          className="sm:mbe-3"
          title="Leads in repertoire"
          meta={`${leads.length} ${leads.length === 1 ? 'track' : 'tracks'}`}
        />
        <div>
          {visibleLeads.map((track) => (
            <LeadRow key={track.id} hasMoreLeads={hasMoreLeads} track={track} />
          ))}
        </div>
        {hasMoreLeads ? (
          <div className="mbs-3 flex justify-end">
            <SeeMoreButton href={repertoireHref} />
          </div>
        ) : null}
      </section>

      {/* Wishlist (only if there are public items) */}
      {showWishlist ? (
        <section>
          <SectionHeader className="sm:mbe-3" title="Want to learn" />
          <div>
            {visibleWishlist.map((track) => (
              <WishlistRow key={track.id} hasMoreWishes={hasMoreWishes} track={track} />
            ))}
          </div>
          {hasMoreWishes ? (
            <div className="mbs-3 flex justify-end">
              <SeeMoreButton href={wishlistHref} />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
