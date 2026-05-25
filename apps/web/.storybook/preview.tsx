import { useEffect } from 'react';

import type { Preview } from '@storybook/nextjs-vite';

import '../app/globals.css';
import '../src/styles/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';

      useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
      }, [theme]);

      const bg = theme === 'dark' ? '#1a1713' : '#f7f4ef';

      return (
        <div style={{ background: bg, width: '100%', minWidth: '900px', padding: '2rem' }}>
          <Story />
        </div>
      );
    },
  ],

  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'dark',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
