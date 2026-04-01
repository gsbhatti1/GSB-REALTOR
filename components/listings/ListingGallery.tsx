'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MediaItem {
  MediaURL: string
}

interface ListingGalleryProps {
  photos: MediaItem[]
  address: string
}

export default function ListingGallery({ photos, address }: ListingGalleryProps) {
  const [activePhoto, setActivePhoto] = useState(0)

  if (photos.length === 0) {
    return (
      <div style={{
        height: 'clamp(300px, 50vw, 560px)',
        background: '#111',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="64" height="64" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', background: '#000', borderRadius: '0' }}>
      {/* Main photo */}
      <div style={{ position: 'relative', height: 'clamp(300px, 50vw, 560px)' }}>
        <Image
          src={photos[activePhoto].MediaURL}
          alt={`${address} - Photo ${activePhoto + 1}`}
          fill
          style={{ objectFit: 'cover', opacity: 0.95 }}
          priority={activePhoto === 0}
        />

        {/* Photo counter */}
        <div style={{
          position: 'absolute', bottom: '16px', right: '16px',
          background: 'rgba(0,0,0,0.7)', color: '#fff',
          padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 2,
        }}>
          📷 {activePhoto + 1} / {photos.length}
        </div>

        {/* Prev arrow */}
        {photos.length > 1 && activePhoto > 0 && (
          <button
            onClick={() => setActivePhoto(p => Math.max(0, p - 1))}
            style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff',
              width: '44px', height: '44px', borderRadius: '50%',
              cursor: 'pointer', fontSize: '22px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', zIndex: 2,
              transition: 'background 0.2s',
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
        )}

        {/* Next arrow */}
        {photos.length > 1 && activePhoto < photos.length - 1 && (
          <button
            onClick={() => setActivePhoto(p => Math.min(photos.length - 1, p + 1))}
            style={{
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff',
              width: '44px', height: '44px', borderRadius: '50%',
              cursor: 'pointer', fontSize: '22px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', zIndex: 2,
              transition: 'background 0.2s',
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div style={{
          display: 'flex', gap: '4px', padding: '8px',
          overflowX: 'auto', background: '#0A0A0A',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(201,168,76,0.3) transparent',
        }}>
          {photos.map((photo, i) => (
            <div
              key={i}
              onClick={() => setActivePhoto(i)}
              style={{
                flexShrink: 0, width: '80px', height: '60px',
                position: 'relative', borderRadius: '4px',
                overflow: 'hidden', cursor: 'pointer',
                border: i === activePhoto ? '2px solid #C9A84C' : '2px solid transparent',
                opacity: i === activePhoto ? 1 : 0.55,
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.MediaURL}
                alt={`Thumbnail ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
