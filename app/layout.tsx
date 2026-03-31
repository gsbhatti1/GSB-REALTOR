import type { Metadata } from 'next'
import Script from 'next/script'
import '../styles/globals.css'
import '../styles/mobile.css'
import ChatBot from '@/components/ui/ChatBot'

export const metadata: Metadata = {
  title: {
    default: 'GSB Realtor | Gurpreet Bhatti | Utah Real Estate',
    template: '%s | GSB Realtor'
  },
  description: 'Search all Utah homes, condos, and commercial properties for sale. Gurpreet Bhatti — REALTOR®, USMC Veteran, Dynasty Point Referral Group. Commercial & residential real estate across Utah.',
  keywords: ['Utah real estate', 'homes for sale Utah', 'Salt Lake City homes', 'Utah MLS search', 'commercial real estate Utah', 'Gurpreet Bhatti realtor', 'GSB realtor'],
  authors: [{ name: 'Gurpreet Bhatti', url: 'https://gsbrealtor.com' }],
  creator: 'Gurpreet Bhatti',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gsbrealtor.com',
    siteName: 'GSB Realtor',
    title: 'GSB Realtor | Utah Real Estate | Gurpreet Bhatti',
    description: 'Search all Utah homes and commercial properties. Expert local knowledge. Fast. Free.',
    images: [
      {
        url: 'https://gsbrealtor.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GSB Realtor — Utah Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GSB Realtor | Utah Real Estate',
    description: 'Search Utah homes and commercial properties with Gurpreet Bhatti, REALTOR®',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'NaXF_l7ss5Layf3j8Ba1tMtfmiwGr69E_UDGuP273XY',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0A0A0A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ChatBot />
        {/* Google Analytics GA4 — G-KVVK68CQXZ */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KVVK68CQXZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KVVK68CQXZ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  )
}
