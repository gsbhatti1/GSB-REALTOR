'use client'

import { useState, useEffect } from 'react'
import { saveProperty, unsaveProperty, isPropertySaved } from '@/lib/saved-properties'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

interface ListingClientSectionProps {
  listingKey: string
  address: string
  city: string
  price: number
  bedrooms: number
  bathrooms: number
  photoUrl: string
}

export default function ListingClientSection({
  listingKey,
  address,
  city,
  price,
  bedrooms,
  bathrooms,
  photoUrl,
}: ListingClientSectionProps) {
  const [saved, setSaved] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setSaved(isPropertySaved(listingKey))
  }, [listingKey])

  async function handleToggleSave() {
    if (saved) {
      unsaveProperty(listingKey)
      setSaved(false)
      return
    }
    // Check if signed in
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setShowSignInPrompt(true)
      return
    }
    saveProperty({
      listingKey, address, city, price, bedrooms, bathrooms, photoUrl,
      savedAt: new Date().toISOString(),
    })
    setSaved(true)
  }

  const shareUrl = `https://gsbrealtor.com/listing/${listingKey}`
  const shareText = `Check out this ${bedrooms}bd/${bathrooms}ba home in ${city}, Utah — $${price?.toLocaleString()}`

  const mapQuery = encodeURIComponent(`${address}, ${city}, Utah`)

  return (
    <div>
      {/* Sign-in prompt modal */}
      {showSignInPrompt && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '20px',
        }} onClick={() => setShowSignInPrompt(false)}>
          <div style={{
            background: '#111', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '16px', padding: '32px', maxWidth: '360px', width: '100%',
            textAlign: 'center',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏠</div>
            <h3 style={{ color: '#F5F3EE', fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', marginBottom: '8px' }}>
              Sign In to Save
            </h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              Create a free account to save properties and get alerts when similar homes hit the market.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => router.push('/signin')} style={{
                background: '#C9A84C', color: '#0A0A0A', border: 'none',
                borderRadius: '8px', padding: '13px', fontWeight: '700',
                fontSize: '15px', cursor: 'pointer', width: '100%',
              }}>Sign In</button>
              <button onClick={() => router.push('/signup')} style={{
                background: 'transparent', color: '#C9A84C',
                border: '1.5px solid rgba(201,168,76,0.5)',
                borderRadius: '8px', padding: '13px', fontWeight: '600',
                fontSize: '15px', cursor: 'pointer', width: '100%',
              }}>Create Account</button>
              <button onClick={() => setShowSignInPrompt(false)} style={{
                background: 'none', color: '#555', border: 'none',
                fontSize: '13px', cursor: 'pointer', marginTop: '4px',
              }}>Continue browsing</button>
            </div>
          </div>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleToggleSave}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px',
          background: saved ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
          border: saved ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.1)',
          color: saved ? '#C9A84C' : '#888',
          borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600',
          marginBottom: '24px',
          transition: 'all 0.2s',
        }}
      >
        {saved ? '❤️ Saved' : '🤍 Save Property'}
      </button>

      {/* Map & Directions */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '20px', fontWeight: '400',
          color: '#F5F3EE', marginBottom: '16px',
        }}>
          Get Directions
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <a
            href={`https://maps.google.com/maps?q=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#4285F4', color: '#fff',
              padding: '10px 20px', borderRadius: '8px',
              fontWeight: '600', fontSize: '14px', textDecoration: 'none',
            }}
          >
            🗺️ Google Maps
          </a>
          <a
            href={`https://maps.apple.com/?q=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#333', color: '#fff',
              padding: '10px 20px', borderRadius: '8px',
              fontWeight: '600', fontSize: '14px', textDecoration: 'none',
            }}
          >
            🍎 Apple Maps
          </a>
          <a
            href={`https://waze.com/ul?q=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#05C8F7', color: '#000',
              padding: '10px 20px', borderRadius: '8px',
              fontWeight: '600', fontSize: '14px', textDecoration: 'none',
            }}
          >
            🔵 Waze
          </a>
        </div>

        {/* Static map embed */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', height: '240px', background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
          <iframe
            src={`https://maps.google.com/maps?q=${mapQuery}&output=embed&zoom=15`}
            width="100%"
            height="240"
            style={{ border: 'none' }}
            loading="lazy"
            title="Property location map"
          />
        </div>
      </div>

      {/* Share Bar */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '20px', fontWeight: '400',
          color: '#F5F3EE', marginBottom: '16px',
        }}>
          Share This Property
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              background: '#1877F2', color: '#fff',
              borderRadius: '8px', textDecoration: 'none',
              fontSize: '13px', fontWeight: '600',
            }}
          >
            Share on Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              background: '#000', color: '#fff',
              borderRadius: '8px', textDecoration: 'none',
              fontSize: '13px', fontWeight: '600',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            Share on X
          </a>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(shareUrl)
              alert('Link copied!')
            }}
            style={{
              padding: '8px 16px',
              background: 'rgba(201,168,76,0.15)',
              color: '#C9A84C',
              border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600',
            }}
          >
            📋 Copy Link
          </button>
        </div>
      </div>
    </div>
  )
}
