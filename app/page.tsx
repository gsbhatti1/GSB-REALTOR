import LanguageSelectorFull from '@/components/ui/LanguageSelectorFull'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GSB Realtor | Gurpreet Bhatti | Utah Real Estate — Done Different',
  description:
    'Search 17,000+ Utah MLS listings in English, Spanish, Punjabi, Arabic, Chinese, and Vietnamese. Buy, sell, or invest with Gurpreet Bhatti — REALTOR® & USMC Veteran. Call 801-635-8462.',
  alternates: { canonical: 'https://gsbrealtor.com' },
}

export default function HomePage() {
  return <LanguageSelectorFull />
}
