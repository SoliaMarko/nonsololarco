'use client';

import Text from '@/src/components/typography/Text';
import Button from '@/src/components/ui/Button';
import { NotesIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

interface AiButtonProps {
  className?: string;
  textClassName?: string;
}

export default function AiButton({ className, textClassName }: AiButtonProps) {
  return (
    <Button className={cn('bg-accent-dark-green', className)} variant="retro-primary">
      <div className={cn('text-primary-light flex flex-row items-center gap-2', textClassName)}>
        <NotesIcon size={16} />
        <Text className="text-sm font-medium text-inherit uppercase sm:text-[0.8rem]">AI</Text>
      </div>
    </Button>
  );
}
