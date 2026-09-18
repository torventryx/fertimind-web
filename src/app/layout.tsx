import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE } from '@/lib/i18n';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'FertiMind — fertilidad y reproducción asistida',
    template: '%s · FertiMind',
  },
  description: SITE.es.description,
  applicationName: 'FertiMind',
  authors: [{ name: 'FertiMind' }],
};

export const viewport: Viewport = {
  themeColor: '#453A5F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
