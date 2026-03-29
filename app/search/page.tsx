'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/listings/PropertyCard'

// ─── Types ────────────────────────────────────────────────────────────────

interface SearchFilters {
  city: string
  minPrice: string
  maxPrice: string
  beds: string
  baths: string
  type: string
  orderBy: string
}

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Condominium', label: 'Condo / Townhouse' },
  { value: 'Commercial Sale', label: 'Commercial' },
  { value: 'Land', label: 'Land' },
  { value: 'Multi-Family', label: 'Multi-Family' },
]

const UTAH_CITIES = [
  'Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan',
  'Taylorsville', 'Murray', 'Provo', 'Orem', 'Ogden', 'Layton',
  'St. George', 'Logan', 'Draper', 'Herriman', 'Riverton', 'Lehi',
  'West Valley City', 'Millcreek', 'Cottonwood Heights', 'Holladay',
]

// ─── Page Component ───────────────────────────────────────────────────────

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<SearchFilters>({
    city:     searchParams.get('city')     || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    beds:     searchParams.get('beds')     || '',
    baths:    searchParams.get('baths')    || '',
    type:     searchParams.get('type')     || '',
    orderBy:  searchParams.get('orderBy')  || 'ModificationTimestamp desc',
  })

  const [properties, setProperties] = useState<any[]>([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(0)
  const [hasMore, setHasMore]       = useState(false)
  const PER_PAGE = 24

  // ─── Fetch listings ──────────────────────────────────────────────────

  const fetchListings = useCallback(async (f: SearchFilters, pageNum: number, append = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (f.city)     params.set('city', f.city)
      if (f.minPrice) params.set('minPrice', f.minPrice)
      if (f.maxPrice) params.set('maxPrice', f.maxPrice)
      if (f.beds)     params.set('beds', f.beds)
      if (f.baths)    params.set('baths', f.baths)
      if (f.type)     params.set('type', f.type)
      if (f.orderBy)  params.set('orderBy', f.orderBy)
      params.set('top', String(PER_PAGE))
      params.set('skip', String(pageNum * PER_PAGE))

      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()

      if (append) {
        setProperties(prev => [...prev, ...data.properties])
      } else {
        setProperties(data.properties || [])
      }
      setTotal(data.total || 0)
      setHasMore(data.hasMore || false)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchListings(filters, 0)
  }, []) // eslint-disable-line

  // ─── Apply filters ───────────────────────────────────────────────────

  const applyFilters = () => {
    setPage(0)
    fetchListings(filters, 0)
    // Update URL without page reload
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    router.replace(`/search?${params}`, { scroll: false })
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchListings(filters, nextPage, true)
  }

  const update = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '80px', background: '#0A0A0A' }}>

        {/* ── Filter Bar ── */}
        <div style={{
          background: '#111',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 24px',
          position: 'sticky',
          top: '72px',
          zIndex: 40,
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>

            {/* City */}
            <div style={{ flex: '1 1 160px' }}>
              <label style={labelStyle}>City</label>
              <input
                list="cities"
                value={filters.city}
                onChange={e => update('city', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                placeholder="Any city..."
                style={inputStyle}
              />
              <datalist id="cities">
                {UTAH_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Price range */}
            <div style={{ flex: '1 1 120px' }}>
              <label style={labelStyle}>Min Price</label>
              <select value={filters.minPrice} onChange={e => update('minPrice', e.target.value)} style={inputStyle}>
                <option value="">No Min</option>
                {[100,150,200,250,300,350,400,500,600,750,1000].map(n => (
                  <option key={n} value={n * 1000}>${n}K</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 120px' }}>
              <label style={labelStyle}>Max Price</label>
              <select value={filters.maxPrice} onChange={e => update('maxPrice', e.target.value)} style={inputStyle}>
                <option value="">No Max</option>
                {[200,300,400,500,600,750,1000,1500,2000,3000].map(n => (
                  <option key={n} value={n * 1000}>${n}K</option>
                ))}
              </select>
            </div>

            {/* Beds */}
            <div style={{ flex: '1 1 100px' }}>
              <label style={labelStyle}>Beds</label>
              <select value={filters.beds} onChange={e => update('beds', e.target.value)} style={inputStyle}>
                <option value="">Any</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>

            {/* Baths */}
            <div style={{ flex: '1 1 100px' }}>
              <label style={labelStyle}>Baths</label>
              <select value={filters.baths} onChange={e => update('baths', e.target.value)} style={inputStyle}>
                <option value="">Any</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>

            {/* Type */}
            <div style={{ flex: '1 1 140px' }}>
              <label style={labelStyle}>Type</label>
              <select value={filters.type} onChange={e => update('type', e.target.value)} style={inputStyle}>
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Sort */}
            <div style={{ flex: '1 1 160px' }}>
              <label style={labelStyle}>Sort By</label>
              <select value={filters.orderBy} onChange={e => update('orderBy', e.target.value)} style={inputStyle}>
                <option value="ModificationTimestamp desc">Newest</option>
                <option value="ListPrice asc">Price: Low to High</option>
                <option value="ListPrice desc">Price: High to Low</option>
                <option value="DaysOnMarket asc">Days on Market</option>
              </select>
            </div>

            {/* Search button */}
            <button
              onClick={applyFilters}
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                border: 'none',
                borderRadius: '8px',
                padding: '0 28px',
                height: '42px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#0A0A0A',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                alignSelf: 'flex-end',
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

          {/* Count + summary */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              {loading && properties.length === 0 ? (
                <div style={{ color: '#555', fontSize: '14px' }}>Searching Utah MLS...</div>
              ) : (
                <div style={{ color: '#888', fontSize: '14px' }}>
                  <span style={{ color: '#C9A84C', fontWeight: '600', fontSize: '18px' }}>
                    {total.toLocaleString()}
                  </span>{' '}
                  Utah properties found
                  {filters.city && <span> in <strong style={{ color: '#F5F3EE' }}>{filters.city}</strong></span>}
                </div>
              )}
            </div>
            {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? null : (
              <button style={{ fontSize: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 16px', color: '#888', cursor: 'pointer' }}>
                🗺 Map View (coming soon)
              </button>
            )}
          </div>

          {/* Property grid */}
          {loading && properties.length === 0 ? (
            // Skeleton loader
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ background: '#111', borderRadius: '16px', overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: '220px' }} />
                  <div style={{ padding: '20px' }}>
                    <div className="skeleton" style={{ height: '20px', borderRadius: '4px', marginBottom: '12px' }} />
                    <div className="skeleton" style={{ height: '14px', borderRadius: '4px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '96px 32px', color: '#555' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#888', marginBottom: '8px' }}>
                No listings found
              </h3>
              <p style={{ fontSize: '14px' }}>Try adjusting your filters or searching a different city.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {properties.map((property, i) => (
                  <PropertyCard key={property.ListingKey} property={property} priority={i < 6} />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(201,168,76,0.4)',
                      borderRadius: '8px',
                      padding: '14px 40px',
                      color: '#C9A84C',
                      fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >
                    {loading ? 'Loading...' : `Load More (${total - properties.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

// ─── Micro styles ──────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#555',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '14px',
  color: '#F5F3EE',
  outline: 'none',
  fontFamily: 'inherit',
  height: '42px',
}
