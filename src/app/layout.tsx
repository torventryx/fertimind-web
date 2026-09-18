import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/i18n';

// Poppins real, autoalojada por next/font (sin FOUT, sin peticiones externas en runtime).
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

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
    <html lang="es" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
