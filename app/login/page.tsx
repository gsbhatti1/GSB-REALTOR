import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign In | GSB Realtor',
  description: 'Sign in or create your GSB Realtor account to save properties, set listing alerts, and stay connected with Gurpreet Bhatti.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
        <LoginClient />
      </main>
    </>
  )
}
