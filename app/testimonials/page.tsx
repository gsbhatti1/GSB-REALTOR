import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TestimonialsClient from './TestimonialsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Reviews | GSB Realtor — Gurpreet Bhatti',
  description: 'Read what our clients say about working with Gurpreet Bhatti, REALTOR® in Utah. Real stories from buyers, sellers, and investors across Salt Lake County.',
  alternates: { canonical: 'https://gsbrealtor.com/testimonials' },
}

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}>
        <TestimonialsClient />
      </main>
      <Footer />
    </>
  )
}
