import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'h1', 'h2', 'h3', 'body', 'h4', 'caption', 'label'] }],
    },
  },
});

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}
