import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MH - Gestion de Produits Premium',
  description: 'Application magnifique de gestion de produits et de clients',
  viewport: 'width=device-width, initial-scale=1.0',
  authors: [{ name: 'MH Team' }],
  keywords: 'gestion, produits, clients, MH, premium',
  openGraph: {
    title: 'MH - Gestion de Produits',
    description: 'Gérez vos produits et clients avec style',
    type: 'website',
  },
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
