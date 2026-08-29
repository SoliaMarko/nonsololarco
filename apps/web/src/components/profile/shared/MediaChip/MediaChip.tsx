import Link from 'next/link';

import { ImageIcon, LinkIcon, PlayIcon } from '@/src/icons/base';
import { type WishlistMediaKind } from '@/src/lib/types/profile/wishlist.types';
import { cn } from '@/src/utils/cn';

const MEDIA_ICON: Record<WishlistMediaKind, typeof PlayIcon> = {
  video: PlayIcon,
  sheet: ImageIcon,
  link: LinkIcon,
};

interface MediaChipProps {
  kind: WishlistMediaKind;
  url: string;
  label?: string;
}

export default function MediaChip({ kind, label, url }: MediaChipProps) {
  const Icon = MEDIA_ICON[kind];

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'border-fg-primary/20 pli-1.5 plb-0.5 text-fg-tertiary',
        'inline-flex items-center gap-1 rounded-sm border text-xs',
        'hover:text-fg-primary hover:border-fg-primary/40 transition-colors duration-150',
        'focus-visible:ring-fg-primary focus-visible:ring-1 focus-visible:outline-none',
      )}
    >
      <Icon size={11} aria-hidden="true" />
      {label ?? kind}
    </Link>
  );
}
