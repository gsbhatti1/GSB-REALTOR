'use client'

import { useState, useEffect } from 'react'
import { saveProperty, unsaveProperty, isPropertySaved } from '@/lib/saved-properties'

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

  useEffect(() => {
    setSaved(isPropertySaved(listingKey))
  }, [listingKey])

  function handleToggleSave() {
    if (saved) {
      unsaveProperty(listingKey)
      setSaved(false)
    } else {
      saveProperty({
        listingKey,
        address,
        city,
        price,
        bedrooms,
        bathrooms,
        photoUrl,
        savedAt: new Date().toISOString(),
      })
      setSaved(true)
    }
  }

  const shareUrl = `https://gsbrealtor.com/listing/${listingKey}`
  const shareText = `Check out this ${bedrooms}bd/${bathrooms}ba home in ${city}, Utah — $${price?.toLocaleString()}`

  const mapQuery = encodeURIComponent(`${address}, ${city}, Utah`)

  return (
    <div>
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
