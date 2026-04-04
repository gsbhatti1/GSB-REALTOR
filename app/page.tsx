import LanguageSelectorFull from '@/components/ui/LanguageSelectorFull'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GSB Realtor | Gurpreet Bhatti | Utah Real Estate — Done Different',
  description:
    'Search 17,000+ Utah MLS listings in English, Spanish, Punjabi, Arabic, Chinese, and Vietnamese. Buy, sell, or invest with Gurpreet Bhatti — REALTOR® & USMC Veteran. Call 801-635-8462.',
  alternates: { canonical: 'https://gsbrealtor.com' },
}

export default function HomePage() {
  return (
    <>
      <LanguageSelectorFull />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I buy a home in Utah?",
              "acceptedAnswer": { "@type": "Answer", "text": "Buying a home in Utah starts with getting pre-approved for a mortgage, then working with a licensed REALTOR® like Gurpreet Bhatti to search active MLS listings. Gurpreet serves Salt Lake City, West Jordan, Sandy, South Jordan, Draper, and 40+ Utah cities. Call 801-635-8462 for a free consultation." }
            },
            {
              "@type": "Question",
              "name": "What is the average home price in Utah?",
              "acceptedAnswer": { "@type": "Answer", "text": "As of 2026, the median home price in Utah is approximately $500,000-$550,000, varying by city. Salt Lake City averages $450,000-$600,000, while suburban areas like West Jordan and Sandy range from $400,000-$550,000. Contact GSB Realtor at 801-635-8462 for current market data." }
            },
            {
              "@type": "Question",
              "name": "Do I need a REALTOR® to buy or sell a home in Utah?",
              "acceptedAnswer": { "@type": "Answer", "text": "While not legally required, working with a licensed REALTOR® is strongly recommended. Gurpreet Bhatti (License #12907042-SA00) provides full-service representation for buyers and sellers across Utah, Nevada, and Wyoming with no upfront cost to buyers." }
            },
            {
              "@type": "Question",
              "name": "How long does it take to buy a house in Utah?",
              "acceptedAnswer": { "@type": "Answer", "text": "The typical home buying process in Utah takes 30-60 days from accepted offer to closing. This includes the inspection period (10-14 days), mortgage approval (21-30 days), and final closing. Pre-approval can be completed in 1-3 days." }
            },
            {
              "@type": "Question",
              "name": "What languages does GSB Realtor speak?",
              "acceptedAnswer": { "@type": "Answer", "text": "Gurpreet Bhatti and the GSB Realtor team serve clients in English, Spanish, Punjabi, Arabic, Chinese, and Vietnamese. This makes GSB Realtor the ideal choice for Utah's diverse international communities." }
            },
            {
              "@type": "Question",
              "name": "Is Gurpreet Bhatti a licensed REALTOR® in Utah?",
              "acceptedAnswer": { "@type": "Answer", "text": "Yes. Gurpreet Bhatti is a licensed REALTOR® in Utah (License #12907042-SA00), Nevada (License #S.0201351), and Wyoming (License #RE-17041), affiliated with Dynasty Point Referral Group. Gurpreet is also a proud USMC Veteran." }
            }
          ]
        })}}
      />
    </>
  )
}
