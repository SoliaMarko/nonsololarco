import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

type SortField = 'bpm' | 'status' | 'time' | 'title' | 'trackOrder';
type SortOrder = 'asc' | 'desc';

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

  const sortField = (searchParams.get('sort') as SortField | null) ?? 'trackOrder';
  const sortOrder = (searchParams.get('order') as SortOrder | null) ?? 'asc';

  function handleSort(field: SortField) {
    const params = new URLSearchParams(searchParams.toString());

    if (sortField === field) {
      if (sortOrder === 'asc') {
        params.set('order', 'desc');
      } else {
        params.set('order', 'asc');
      }
    } else {
      params.set('sort', field);
      params.set('order', 'desc');
    }

    router.push(`?${params.toString()}`);

    // TODO: when pagination is implemented, pass sort params to server:
    // GET /bands/:id/tracks?sort=bpm&order=asc&page=1
    // GET /users/me/tracks?sort=bpm&order=asc
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
            'cursor-pointer transition-colors',
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
