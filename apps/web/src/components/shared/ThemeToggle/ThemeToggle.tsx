'use client';

import { useEffect, useState } from 'react';

import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/hooks/global/useTheme';
import { MoonOutlineIcon, SunOutlineIcon } from '@/src/icons/base';
import { THEME } from '@/src/lib/constants/common.const';
import { cn } from '@/src/utils/cn';

export interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Button
      aria-label={
        mounted
          ? theme === THEME.dark
            ? 'Switch to light theme'
            : 'Switch to dark theme'
          : 'Toggle theme'
      }
      className={cn('bg-control-surface size-10 rounded-full border-2 p-0', className)}
      onClick={toggleTheme}
      variant="press"
    >
      {mounted ? (
        theme === THEME.dark ? (
          <SunOutlineIcon size={20} />
        ) : (
          <MoonOutlineIcon size={20} />
        )
      ) : (
        <SunOutlineIcon size={20} aria-hidden />
      )}
    </Button>
  );
}
