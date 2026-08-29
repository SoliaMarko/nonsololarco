import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import Text from '@/src/components/typography/Text';
import Button from '@/src/components/ui/Button';
import { ChevronIcon } from '@/src/icons/base';

export interface SeeMoreButtonProps {
  href: string;
}

export default function SeeMoreButton({ href }: SeeMoreButtonProps) {
  const t = useTranslations('common');

  return (
    <Link href={href} className="text-emerald-main self-end text-sm font-medium">
      <Button variant="ghost">
        <div className="flex items-center gap-1">
          <Text className="text-inherit">{t('actions.seeAll')}</Text>
          <ChevronIcon size={14} aria-hidden="true" direction="right" />
        </div>
      </Button>
    </Link>
  );
}
