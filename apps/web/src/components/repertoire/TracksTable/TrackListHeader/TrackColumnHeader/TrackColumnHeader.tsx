import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';
import { SortField, SortOrder } from '@/src/utils/tracks-sort.utils';

type BaseProps = {
  className?: string;
  title: string;
};

type TrackColumnHeaderProps =
  | (BaseProps & { field: SortField; isSortable: true })
  | (BaseProps & { isSortable?: false });

export default function TrackColumnHeader(props: TrackColumnHeaderProps) {
  const { className, isSortable, title } = props;

  const searchParams = useSearchParams();
  const router = useRouter();

  const sortField = searchParams.get('sort') as SortField | null;
  const sortOrder = (searchParams.get('order') as SortOrder | null) ?? 'asc';

  function handleSort(field: SortField) {
    const params = new URLSearchParams(searchParams.toString());

    if (sortField === field) {
      params.set('order', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sort', field);
      params.set('order', 'desc');
    }
    params.delete('page');

    router.push(`?${params.toString()}`, { scroll: false });
  }

  function getSortIcon(field: SortField) {
    const classNames = field === sortField ? 'text-danger-deep' : '';

    return sortOrder === 'asc' && field === sortField ? (
      <ChevronIcon className={classNames} direction="up" size={10} />
    ) : (
      <ChevronIcon className={classNames} direction="down" size={10} />
    );
  }

  if (isSortable) {
    const isActive = sortField === props.field;
    const ariaSortValue = isActive ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none';

    return (
      <div
        role="columnheader"
        aria-sort={ariaSortValue}
        className={cn('text-[10px] font-bold tracking-widest uppercase', className)}
      >
        <button
          onClick={() => handleSort(props.field)}
          className={cn(
            'flex items-center gap-1',
            'transition-colors',
            isActive ? 'text-fg-primary' : 'text-fg-tertiary hover:text-fg-secondary',
          )}
        >
          {title}
          <span className="text-[10px]">{getSortIcon(props.field)}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      role="columnheader"
      className={cn('text-fg-tertiary text-[10px] font-bold tracking-widest uppercase', className)}
    >
      {title}
    </div>
  );
}
