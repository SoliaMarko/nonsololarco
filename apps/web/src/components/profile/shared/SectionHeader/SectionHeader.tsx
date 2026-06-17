import Heading from '@/src/components/typography/Heading';
import Text from '@/src/components/typography/Text';
import Divider from '@/src/components/ui/Divider';
import { ORIENTATION } from '@/src/lib/constants/common.const';
import { cn } from '@/src/lib/ui/utils/cn';

interface SectionHeaderProps {
  className?: string;
  meta?: string;
  title: string;
}

export default function SectionHeader({ className, meta, title }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center gap-4 sm:mbe-6', className)}>
      <Heading tag="h2" className="shrink-0">
        {title}
      </Heading>
      <Divider className="w-full" orientation={ORIENTATION.horizontal} />
      {meta ? (
        <Text className="text-fg-tertiary hidden shrink-0 text-xs tracking-widest uppercase sm:block">
          {meta}
        </Text>
      ) : null}
    </div>
  );
}
