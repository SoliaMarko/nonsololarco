import { useEffect, useState } from 'react';

import { THEME } from '@/src/lib/constants/common.const';
import { ThemeType } from '@/src/lib/types/common.types';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window === 'undefined') {
      return THEME.dark;
    }

    return (localStorage.getItem('theme') as ThemeType) ?? THEME.dark;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === THEME.dark ? THEME.light : THEME.dark));

  return { theme, toggleTheme };
}
