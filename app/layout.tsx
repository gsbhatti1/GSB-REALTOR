import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import '../styles/globals.css'
import '../styles/mobile.css'
import ChatBot from '@/components/ui/ChatBot'
import {
  RealEstateAgentSchema,
  LocalBusinessSchema,
  WebsiteSchema,
} from '@/components/seo/JsonLd'

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://gsbrealtor.com'),
  title: {
    default: 'GSB Realtor | Gurpreet Bhatti | Utah Real Estate',
    template: '%s | GSB Realtor',
  },
  description:
    'Search all Utah homes, condos, and commercial properties for sale. Gurpreet Bhatti — REALTOR®, USMC Veteran, Dynasty Point Referral Group. Commercial & residential real estate across Utah.',
  keywords: [
    'Utah real estate',
    'homes for sale Utah',
    'Salt Lake City homes',
    'Utah MLS search',
    'commercial real estate Utah',
    'Gurpreet Bhatti realtor',
    'GSB realtor',
    'NNN lease Utah',
    'Utah REALTOR',
    'West Jordan real estate',
    'Sandy Utah homes',
    'South Jordan homes for sale',
  ],
  authors: [{ name: 'Gurpreet Bhatti', url: 'https://gsbrealtor.com' }],
  creator: 'Gurpreet Bhatti',
  alternates: {
    canonical: 'https://gsbrealtor.com',
    languages: {
      'en-US': 'https://gsbrealtor.com',
      'es': 'https://gsbrealtor.com/es',
      'pa': 'https://gsbrealtor.com/pa',
      'ar': 'https://gsbrealtor.com/ar',
      'zh': 'https://gsbrealtor.com/zh',
      'vi': 'https://gsbrealtor.com/vi',
      'fa': 'https://gsbrealtor.com/fa',
      'pt': 'https://gsbrealtor.com/pt',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gsbrealtor.com',
    siteName: 'GSB Realtor',
    title: 'GSB Realtor | Utah Real Estate | Gurpreet Bhatti',
    description:
      'Search all Utah homes and commercial properties. Expert local knowledge. Fast. Free.',
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
    description:
      'Search Utah homes and commercial properties with Gurpreet Bhatti, REALTOR®',
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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  category: 'real estate',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ── Fonts (single source — removed duplicate @import from globals.css) ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />

        {/* ── Structured Data (JSON-LD) ── */}
        <RealEstateAgentSchema />
        <LocalBusinessSchema />
        <WebsiteSchema />
      </head>
      <body>
        {/* ── Accessibility: Skip Navigation (CSS-only) ── */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        <div id="main-content">{children}</div>

        <ChatBot />

        {/* ── Browser Language Auto-Detection ── */}
        <Script id="lang-detect" strategy="afterInteractive">{`
          (function() {
            if (localStorage.getItem('gsb_lang_detected')) return;
            if (window.location.pathname !== '/') return;
            localStorage.setItem('gsb_lang_detected', '1');
            var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
            if (lang.startsWith('es')) { window.location.replace('/es'); }
            else if (lang.startsWith('zh')) { window.location.replace('/zh'); }
            else if (lang.startsWith('ar')) { window.location.replace('/ar'); }
            else if (lang.startsWith('vi')) { window.location.replace('/vi'); }
            else if (lang.startsWith('pa') || lang.startsWith('hi')) { window.location.replace('/pa'); }
          })();
        `}</Script>

        {/* ── Google Analytics GA4 ── */}
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
