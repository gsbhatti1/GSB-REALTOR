import { Metadata } from 'next'
import MarketReportsClient from './MarketReportsClient'

export const metadata: Metadata = {
  title: 'Free Utah Real Estate Market Reports | GSB Realtor',
  description: 'Download free monthly Utah real estate market reports. Salt Lake County, Utah Valley, and commercial market data from Gurpreet Bhatti, REALTOR®.',
}

export default function MarketReportsPage() {
  return <MarketReportsClient />
}
