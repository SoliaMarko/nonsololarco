import { createContext, useContext } from 'react';

interface TabsContextValue {
  animated: boolean;
  variant: 'nav' | 'panel';
}

const TabsContext = createContext<TabsContextValue>({
  animated: false,
  variant: 'panel',
});

/**
 * Returns the parent Tabs configuration — lets TabItem know whether the
 * sliding indicator is active so it can suppress its own border/background.
 */
export function useTabsContext(): TabsContextValue {
  return useContext(TabsContext);
}

export default TabsContext;
