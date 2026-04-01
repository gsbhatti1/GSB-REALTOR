'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getSavedProperties, unsaveProperty, SavedProperty } from '@/lib/saved-properties'

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedProperty[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSaved(getSavedProperties())
  }, [])

  function handleRemove(listingKey: string) {
    unsaveProperty(listingKey)
    setSaved(getSavedProperties())
  }

  function handleClearAll() {
    saved.forEach(p => unsaveProperty(p.listingKey))
    setSaved([])
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '100px', background: '#0A0A0A', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: '400',
                color: '#F5F3EE',
                marginBottom: '8px',
              }}>
                ❤️ Saved Homes
              </h1>
              <p style={{ fontSize: '15px', color: '#666' }}>
                {mounted && saved.length > 0
                  ? `${saved.length} saved propert${saved.length === 1 ? 'y' : 'ies'}`
                  : 'Your favorites, all in one place'}
              </p>
            </div>
            {mounted && saved.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#888',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Content */}
          {!mounted ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#555' }}>Loading…</div>
          ) : saved.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤍</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#F5F3EE', fontWeight: '400', marginBottom: '12px' }}>
                No saved properties yet
              </h2>
              <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                Browse homes and tap the ❤️ to save them here for easy reference.
              </p>
              <Link href="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '12px 28px', borderRadius: '8px', textDecoration: 'none',
                letterSpacing: '0.04em',
              }}>
                Browse Homes
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {saved.map((property) => (
                <div key={property.listingKey} style={{
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}>
                  {/* Photo */}
                  <Link href={`/listing/${property.listingKey}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{ position: 'relative', height: '200px', background: '#1a1a1a', overflow: 'hidden' }}>
                      {property.photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={property.photoUrl}
                          alt={property.address}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #161616, #1f1f1f)' }}>
                          <svg width="48" height="48" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ padding: '20px' }}>
                    <div style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#C9A84C',
                      marginBottom: '8px',
                    }}>
                      ${property.price.toLocaleString()}
                    </div>
                    <Link href={`/listing/${property.listingKey}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontSize: '14px', color: '#F5F3EE', fontWeight: '500', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {property.address}
                      </div>
                      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
                        {property.city}, Utah
                      </div>
                    </Link>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {property.bedrooms > 0 && <span style={{ fontSize: '12px', color: '#888' }}>🛏 {property.bedrooms} bd</span>}
                      {property.bathrooms > 0 && <span style={{ fontSize: '12px', color: '#888' }}>🚿 {property.bathrooms} ba</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/listing/${property.listingKey}`} style={{
                        flex: 1, textAlign: 'center',
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                        color: '#0A0A0A', fontWeight: '600', fontSize: '13px',
                        borderRadius: '8px', textDecoration: 'none',
                      }}>
                        View Details
                      </Link>
                      <button
                        onClick={() => handleRemove(property.listingKey)}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#888', borderRadius: '8px',
                          cursor: 'pointer', fontSize: '16px',
                          transition: 'all 0.2s',
                        }}
                        title="Remove from saved"
                      >
                        🗑️
                      </button>
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#444', textAlign: 'right' }}>
                      Saved {new Date(property.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
