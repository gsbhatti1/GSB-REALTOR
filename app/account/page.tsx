import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AccountClient from './AccountClient'

export const metadata: Metadata = {
  title: 'My Account | GSB Realtor',
  description: 'Manage your saved properties, listing alerts, and contact history with Gurpreet Bhatti.',
  robots: { index: false, follow: false },
}

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}>
        <AccountClient />
      </main>
      <Footer />
    </>
  )
}
