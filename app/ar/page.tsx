import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GSB Realtor — Arabic / عربي',
  description: 'GSB Realtor — Coming soon in Arabic. Call 801-635-8462.',
}

export default function ArabicPage() {
  return (
    <main style={{
      background: '#0A0A0A', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', textAlign: 'center',
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '13px', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#C9A84C',
          marginBottom: '16px',
        }}>
          GSB Realtor
        </div>

        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🇸🇦</div>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '32px', fontWeight: '300',
          color: '#F5F3EE', marginBottom: '8px',
        }} dir="rtl">
          قريباً باللغة العربية
        </h1>

        <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>
          Coming soon in Arabic
        </p>

        <p style={{ color: '#C9A84C', fontSize: '18px', fontWeight: '700', marginBottom: '32px' }}>
          801-635-8462
        </p>

        <p style={{ color: '#666', fontSize: '13px', marginBottom: '24px' }}>
          Gurpreet Bhatti, REALTOR® — Utah Real Estate
        </p>

        <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
          borderRadius: '8px',
          color: '#0A0A0A', fontWeight: '700',
          textDecoration: 'none', fontSize: '14px',
        }}>
          ← Back to English
        </Link>
      </div>
    </main>
  )
}
