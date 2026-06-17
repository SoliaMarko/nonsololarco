import Link from 'next/link';

import Text from '@/src/components/typography/Text';
import Button from '@/src/components/ui/Button';
import { ChevronIcon } from '@/src/icons/base';

export interface SeeMoreButtonProps {
  href: string;
}

export default function SeeMoreButton({ href }: SeeMoreButtonProps) {
  return (
    <Link
      href={href}
      className="text-emerald-main hover:text-contrast mbs-3 gap-1 self-end text-sm font-medium"
    >
      <Button variant="ghost">
        <div className="flex items-center gap-1">
          <Text className="text-inherit">See all</Text>
          <ChevronIcon size={14} aria-hidden="true" direction="right" />
        </div>
      </Button>
    </Link>
  );
}
