'use client';

import { useTranslations } from 'next-intl';

import Text from '@/src/components/typography/Text';
import Button from '@/src/components/ui/Button';
import { PlusSolidIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

interface AddTrackButtonProps {
  className?: string;
}

export default function AddTrackButton({ className }: AddTrackButtonProps) {
  const t = useTranslations('pages');

  return (
    <Button className="bg-accent-red" variant="retro-primary">
      <div className={cn('text-primary-light flex flex-row items-center gap-2', className)}>
        <PlusSolidIcon size={16} />
        <Text className="text-sm font-medium text-inherit uppercase sm:text-[0.8rem]">
          {t('repertoire.addTrackButton')}{' '}
          <span className="hidden md:inline">{t('repertoire.addTrackButtonFull')}</span>
        </Text>
      </div>
    </Button>
  );
}
