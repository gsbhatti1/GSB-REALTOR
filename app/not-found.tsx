import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: '80vh',
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          paddingTop: '72px',
        }}
      >
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '80px',
              fontWeight: '300',
              color: 'rgba(201,168,76,0.25)',
              lineHeight: 1,
              marginBottom: '16px',
            }}
          >
            404
          </div>
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '32px',
              fontWeight: '300',
              color: '#F5F3EE',
              marginBottom: '12px',
            }}
          >
            Page Not Found
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#888',
              lineHeight: '1.7',
              marginBottom: '36px',
            }}
          >
            This property might have moved. Let&apos;s get you back on track —
            search for homes or get in touch with Gurpreet.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/search"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A',
                fontWeight: '600',
                fontSize: '14px',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Search Homes
            </Link>
            <Link
              href="/contact"
              className="btn-ghost"
              style={{ padding: '14px 28px' }}
            >
              Contact Gurpreet
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
