'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GSB Error]', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
        <h1
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '32px',
            fontWeight: '300',
            color: '#F5F3EE',
            marginBottom: '12px',
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#888',
            lineHeight: '1.7',
            marginBottom: '32px',
          }}
        >
          We hit a bump in the road. This could be a temporary issue with our
          listing feed. Try again, or call Gurpreet directly at{' '}
          <a
            href="tel:8016358462"
            style={{ color: '#C9A84C', textDecoration: 'none' }}
          >
            801-635-8462
          </a>
          .
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 32px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              fontSize: '14px',
              color: 'rgba(245,243,238,0.7)',
              textDecoration: 'none',
              fontFamily: 'inherit',
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
