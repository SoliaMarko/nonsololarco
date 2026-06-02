import { CSSProperties, Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

/**
 * Chat icon with solid fill and contrast content lines.
 *
 * The icon color is controlled via `className` (e.g. Tailwind `text-*`).
 * The inner lines color is controlled via `contentColor` prop or `--icon-content-color` CSS variable.
 *
 * @example
 * // Default (white content lines)
 * <ChatSolidIcon className="text-primary" />
 *
 * @example
 * // CSS color
 * <ChatSolidIcon className="text-card" contentColor="#ff0000" />
 *
 * @example
 * // Tailwind CSS variable
 * <ChatSolidIcon className="text-card [--icon-content-color:theme(colors.danger)]" />
 */
function ChatSolidIcon(
  {
    contentColor,
    style,
    title,
    titleId,
    ...props
  }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps> & { contentColor?: string },
  ref: Ref<SVGSVGElement>,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? (title ? generatedId : undefined);

  return (
    <svg
      {...(title ? { role: 'img', 'aria-labelledby': resolvedTitleId } : { 'aria-hidden': true })}
      fill="none"
      height={props.size || '24'}
      width={props.size || '24'}
      viewBox={calcViewBox({ x1: 3, y1: 4, x2: 17, y2: 17 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={
        {
          ...style,
          ...(contentColor ? { '--icon-content-color': contentColor } : {}),
        } as CSSProperties
      }
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path
        d="M3 4H17V14H11L7 17V14H3V4Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <line
        x1="6"
        y1="8"
        x2="14"
        y2="8"
        stroke="var(--icon-content-color, white)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="6"
        y1="11"
        x2="11"
        y2="11"
        stroke="var(--icon-content-color, white)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(ChatSolidIcon);
export default ForwardRef;
