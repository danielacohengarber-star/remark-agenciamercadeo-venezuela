import type { Metadata, Viewport } from 'next'
import './globals.css'
import SiteChrome from './components/SiteChrome'

export const metadata: Metadata = {
  title: {
    default: 'REMARK — Agencia de Marketing',
    template: '%s | REMARK',
  },
  description:
    "Let's make something remarkable. Agencia de marketing creativo para marcas que quieren destacar.",
  metadataBase: new URL('https://remarkagency.com'),
  openGraph: {
    type: 'website',
    locale: 'es_419',
    alternateLocale: 'en_US',
    siteName: 'REMARK',
    title: 'REMARK — Agencia de Marketing',
    description:
      "Let's make something remarkable. Agencia de marketing creativo.",
    images: [
      {
        url: '/assets/logo/remark-wordmark-white-on-red.png',
        width: 1200,
        height: 630,
        alt: 'REMARK',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REMARK — Agencia de Marketing',
    description: "Let's make something remarkable.",
    images: ['/assets/logo/remark-wordmark-white-on-red.png'],
  },
  icons: {
    icon: '/assets/logo/remark-isotipo-ink.png',
    apple: '/assets/logo/remark-isotipo-ink.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D0D0D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/*
        SiteChrome is the client boundary: it owns the preloader state and
        renders the Preloader + Navbar around every page. layout.tsx itself
        stays a Server Component so the metadata exports keep working.
      */}
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
