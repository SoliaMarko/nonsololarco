import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function QuarterRestIcon(
  // TODO: fallback color
  { className = '', title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? (title ? generatedId : undefined);

  return (
    <svg
      {...(title ? { role: 'img', 'aria-labelledby': resolvedTitleId } : { 'aria-hidden': true })}
      className={className}
      fill="none"
      height={props.size || '36'}
      width={props.size || '36'}
      viewBox={calcViewBox({ x1: 229, y1: 177, x2: 306, y2: 392 }, 4)}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path
        d="M 269.75 391.02 C 268.31 390.50 265.99 391.05 261.62 387.88 C 257.24 384.71 248.83 378.50 243.51 371.99 C 238.18 365.49 231.67 355.17 229.67 348.83 C 227.67 342.50 230.03 338.31 231.51 334.01 C 232.98 329.70 235.85 325.68 238.52 323.02 C 241.19 320.36 243.62 318.79 247.53 318.03 C 251.43 317.26 259.02 318.73 261.93 318.41 C 264.84 318.10 269.52 323.88 264.98 316.12 C 260.44 308.36 237.03 283.62 234.70 271.85 C 232.37 260.08 247.54 252.49 251.00 245.50 C 254.45 238.51 255.44 236.42 255.43 229.93 C 255.42 223.44 253.87 213.77 250.95 206.55 C 248.02 199.33 240.06 190.98 237.88 186.62 C 235.71 182.26 237.34 181.88 237.89 180.39 C 238.44 178.91 239.74 177.94 241.18 177.70 C 242.63 177.45 244.43 177.46 246.57 178.93 C 248.70 180.40 245.86 176.98 253.98 186.52 C 262.10 196.06 288.53 226.59 295.31 236.19 C 302.09 245.79 297.23 238.46 294.64 244.14 C 292.05 249.82 282.94 262.47 279.77 270.27 C 276.59 278.07 275.42 284.35 275.58 290.94 C 275.74 297.52 275.69 300.62 280.72 309.78 C 285.75 318.94 305.86 340.54 305.76 345.90 C 305.67 351.27 286.76 341.69 280.15 341.98 C 273.54 342.26 269.21 343.79 266.12 347.62 C 263.02 351.44 261.67 360.04 261.57 364.93 C 261.47 369.82 263.46 373.54 265.52 376.98 C 267.58 380.42 272.55 383.53 273.91 385.57 C 275.28 387.62 274.34 388.34 273.73 389.25 C 273.12 390.15 270.91 390.72 270.24 391.02 C 269.58 391.31 271.19 391.54 269.75 391.02 Z"
        fill="currentColor"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(QuarterRestIcon);
export default ForwardRef;
