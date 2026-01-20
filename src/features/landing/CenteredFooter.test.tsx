import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '@/locales/en.json';

import { CenteredFooter } from './CenteredFooter';

describe('CenteredFooter', () => {
  describe('Render method', () => {
    it('should have copyright information', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CenteredFooter logo={null} name="Tradelia" iconList={null} legalLinks={null}>
            Random children
          </CenteredFooter>
        </NextIntlClientProvider>,
      );

      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(`© ${currentYear} Tradelia`);

      expect(copyright).toBeInTheDocument();
    });
  });
});
