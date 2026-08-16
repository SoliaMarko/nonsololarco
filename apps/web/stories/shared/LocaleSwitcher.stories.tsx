import { NextIntlClientProvider } from 'next-intl';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import LocaleSwitcher from '@/src/components/shared/LocaleSwitcher/LocaleSwitcher';
import LocaleStamp from '@/src/components/shared/LocaleSwitcher/LocaleStamp/LocaleStamp';
import enCommon from '@/messages/en/common.json';

const withIntl = (Story: React.ComponentType) => (
  <NextIntlClientProvider locale="en" messages={{ common: enCommon }}>
    <Story />
  </NextIntlClientProvider>
);

const meta = {
  title: 'Shared/LocaleSwitcher',
  component: LocaleSwitcher,
  tags: ['autodocs'],
  decorators: [withIntl],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dropdown for switching the interface language. The trigger is a retro press-style button whose body IS the stamp — bordered rectangle with a flag corner triangle, locale code and a chevron. Menu items show locale endonyms with separate stamp badges and a checkmark on the active one.',
      },
    },
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** All three locale stamps rendered side by side for visual comparison. */
export const LocaleStamps: StoryObj = {
  render: () => (
    <div className="flex items-center gap-6">
      {(['en', 'it', 'uk'] as const).map((locale) => (
        <div key={locale} className="flex flex-col items-center gap-3">
          <LocaleStamp locale={locale} />
          <span className="font-label text-fg-secondary text-[0.625rem] font-bold uppercase tracking-widest">
            {locale}
          </span>
        </div>
      ))}
    </div>
  ),
};
