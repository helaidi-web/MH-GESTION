import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MH - Gestion de Produits Premium',
    template: '%s | MH Gestion',
  },
  description: 'Application magnifique de gestion de produits et de clients avec localStorage persistant',
  authors: [{ name: 'MH Team', url: 'https://github.com/helaidi-web' }],
  creator: 'MH Team',
  keywords: ['gestion', 'produits', 'clients', 'MH', 'premium', 'management'],
  metadataBase: new URL('https://mh-gestion.vercel.app'),
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: {
    email: false,
    telephone: false,
  },
  icons: {
    icon: '🎯',
  },
  openGraph: {
    title: 'MH - Gestion de Produits Premium',
    description: 'Gérez vos produits et clients avec style',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'MH Gestion',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: 'index, follow',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#667eea" />
      </head>
      <body>{children}</body>
    </html>
  );
}
