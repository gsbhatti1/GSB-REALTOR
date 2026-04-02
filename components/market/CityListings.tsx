'use client'

import { useState, useEffect } from 'react'
import PropertyCard from '@/components/listings/PropertyCard'
import Link from 'next/link'

interface Props {
  cityName: string
  citySlug: string
}

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

export default function CityListings({ cityName, citySlug }: Props) {
  const [properties, setProperties] = useState<any[]>([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({
      city:    cityName,
      orderBy: 'ListPrice desc',
      top:     '12',
      skip:    '0',
    })
    fetch(`/api/search?${params}`)
      .then(r => r.json())
      .then(d => {
        setProperties(d.properties || [])
        setTotal(d.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cityName])

  // Stats derived from loaded properties
  const prices    = properties.map((p: any) => p.ListPrice).filter(Boolean)
  const avgPrice  = prices.length ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length) : 0
  const medPrice  = prices.length ? [...prices].sort((a: number, b: number) => a - b)[Math.floor(prices.length / 2)] : 0

  return (
    <>
      {/* Live stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { val: loading ? '...' : total.toLocaleString(), label: 'Active Listings', sub: 'Live from WFRMLS' },
          { val: loading ? '...' : (avgPrice  ? formatPrice(avgPrice)  : '—'), label: 'Average Price',  sub: 'Active listings' },
          { val: loading ? '...' : (medPrice  ? formatPrice(medPrice)  : '—'), label: 'Median Price',   sub: 'Current market' },
          { val: 'Utah',                                                         label: 'MLS Source',    sub: 'WFRMLS Official' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
          }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '28px', fontWeight: '600',
              color: '#C9A84C', lineHeight: '1', marginBottom: '6px',
            }}>
              {s.val}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#F5F3EE', marginBottom: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: '#555' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Listings section */}
      <div style={{ marginTop: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Live from WFRMLS
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '400', color: '#F5F3EE' }}>
              {loading ? `${cityName} Listings` : `${properties.length} Featured ${cityName} Homes`}
            </h2>
          </div>
          <Link href={`/search?city=${encodeURIComponent(cityName)}`} style={{
            padding: '10px 24px', background: 'transparent', fontSize: '13px',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
            color: 'rgba(245,243,238,0.7)', textDecoration: 'none',
          }}>
            View All {total > 0 ? `${total}+` : ''} Listings →
          </Link>
        </div>

        {loading ? (
          // Skeleton grid
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: '#111', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="skeleton" style={{ height: '220px' }} />
                <div style={{ padding: '20px' }}>
                  <div className="skeleton" style={{ height: '20px', borderRadius: '4px', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ height: '14px', borderRadius: '4px', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {properties.map((property: any, i: number) => (
              <PropertyCard key={property.ListingKey} property={property} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '64px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(201,168,76,0.15)' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏠</div>
            <p style={{ color: '#555', fontSize: '15px', marginBottom: '16px' }}>
              No active listings in {cityName} right now — the market moves fast.
            </p>
            <Link href={`/search?city=${encodeURIComponent(cityName)}`} style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '14px' }}>
              Search All Utah Listings →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
