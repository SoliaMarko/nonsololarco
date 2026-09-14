'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { HomeOutlineIcon } from '@/src/icons/base';

import Text from '../../typography/Text';

export default function Breadcrumb() {
  const t = useTranslations('common');
  const tPages = useTranslations('pages');

  return (
    <div className="bg-base pli-6 plb-2 border-border-primary hidden items-center gap-2 border-b md:flex">
      <Link href="/" className="text-fg-tertiary hover:text-fg-primary text-sm transition-colors">
        <span className="text-emerald-main hover:text-fg-secondary flex flex-row items-center gap-2">
          <HomeOutlineIcon className="size-3 transition-colors" aria-hidden="true" />
          <Text className="text-sm text-inherit">{t('nav.feed')}</Text>
        </span>
      </Link>

      <span className="text-fg-disabled text-sm">›</span>
      <span className="text-fg-secondary text-sm font-medium">{tPages('repertoire.title')}</span>
    </div>
  );
}
