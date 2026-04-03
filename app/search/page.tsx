'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/listings/PropertyCard'
import PropertyMap from '@/components/listings/PropertyMap'

const UTAH_CITIES = [
  'Salt Lake City','West Jordan','Sandy','South Jordan','Taylorsville','Murray',
  'Draper','Herriman','Riverton','Lehi','West Valley City','Millcreek',
  'Cottonwood Heights','Midvale','Holladay','Bountiful','North Salt Lake',
  'Farmington','Kaysville','Layton','Ogden','Roy','Clearfield','Provo',
  'Orem','Springville','Spanish Fork','American Fork','Highland','Alpine',
  'Saratoga Springs','Eagle Mountain','St. George','Washington','Hurricane',
  'Cedar City','Logan','Heber City','Park City','Payson','Tooele',
]

const PROPERTY_TYPES = [
  { label: 'All', value: '' },
  { label: 'Residential', value: 'Residential' },
  { label: 'Commercial', value: 'Commercial Sale' },
  { label: 'Multi-Unit', value: 'ResidentialIncome' },
  { label: 'Land', value: 'Land' },
  { label: 'Res Lease', value: 'Residential Lease' },
]

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    city:         searchParams.get('city')         || '',
    minPrice:     searchParams.get('minPrice')     || '',
    maxPrice:     searchParams.get('maxPrice')     || '',
    beds:         searchParams.get('beds')         || '',
    baths:        searchParams.get('baths')        || '',
    type:         searchParams.get('type')         || '',
    propertyType: searchParams.get('propertyType') || '',
    orderBy:      searchParams.get('orderBy')      || 'ListPrice desc',
  })

  const [properties, setProperties] = useState<any[]>([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(0)
  const [hasMore, setHasMore]       = useState(false)
  const [viewMode, setViewMode]       = useState<'list' | 'map'>('list')
  const PER_PAGE = 24

  // Alert modal state
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [alertForm, setAlertForm] = useState({ name: '', email: '', phone: '' })
  const [alertSubmitting, setAlertSubmitting] = useState(false)
  const [alertSuccess, setAlertSuccess] = useState(false)
  const [alertError, setAlertError] = useState('')

  const fetchListings = useCallback(async (f: typeof filters, pageNum: number, append = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (f.city)         params.set('city', f.city)
      if (f.minPrice)     params.set('minPrice', f.minPrice)
      if (f.maxPrice)     params.set('maxPrice', f.maxPrice)
      if (f.beds)         params.set('beds', f.beds)
      if (f.baths)        params.set('baths', f.baths)
      // Property type tab takes precedence; fall back to the old 'type' filter
      if (f.propertyType) params.set('type', f.propertyType)
      else if (f.type)    params.set('type', f.type)
      if (f.orderBy)      params.set('orderBy', f.orderBy)
      params.set('top', String(PER_PAGE))
      params.set('skip', String(pageNum * PER_PAGE))

      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()

      if (append) {
        setProperties(prev => [...prev, ...(data.properties || [])])
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

  useEffect(() => { fetchListings(filters, 0) }, [])

  const applyFilters = () => {
    setPage(0)
    fetchListings(filters, 0)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    router.replace(`/search?${params}`, { scroll: false })
  }

  const update = (key: string, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const handleAlertSubmit = async () => {
    if (!alertForm.email) {
      setAlertError('Email is required')
      return
    }
    setAlertSubmitting(true)
    setAlertError('')
    try {
      const cities = filters.city ? [filters.city] : ['Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan']
      const res = await fetch('/api/listing-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: alertForm.email,
          name: alertForm.name,
          phone: alertForm.phone,
          cities,
          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
          minBeds: filters.beds ? Number(filters.beds) : undefined,
          propertyTypes: filters.propertyType ? [filters.propertyType] : undefined,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setAlertError(data.error)
      } else {
        setAlertSuccess(true)
      }
    } catch {
      setAlertError('Something went wrong. Please try again.')
    } finally {
      setAlertSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    padding: '10px 14px', fontSize: '14px', color: '#F5F3EE',
    outline: 'none', fontFamily: 'inherit', height: '42px',
  }

  const modalInputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
    padding: '12px 14px', fontSize: '14px', color: '#F5F3EE',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#0A0A0A' }}>
        {/* Filter Bar */}
        <div style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', position: 'sticky', top: '72px', zIndex: 40 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            {/* Property Type Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {PROPERTY_TYPES.map(pt => (
                <button
                  key={pt.value}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, propertyType: pt.value }))
                    setTimeout(() => {
                      setPage(0)
                      fetchListings({ ...filters, propertyType: pt.value }, 0)
                      const params = new URLSearchParams()
                      Object.entries({ ...filters, propertyType: pt.value }).forEach(([k, v]) => { if (v) params.set(k, v) })
                      router.replace(`/search?${params}`, { scroll: false })
                    }, 100)
                  }}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '24px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: filters.propertyType === pt.value ? '#C9A84C' : 'rgba(255,255,255,0.06)',
                    color: filters.propertyType === pt.value ? '#0A0A0A' : '#888',
                    border: `1px solid ${filters.propertyType === pt.value ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                    fontFamily: 'inherit',
                  }}
                >
                  {pt.label}
                </button>
              ))}
            </div>

            {/* Search Filters Row */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>City</label>
                <select
                  value={filters.city}
                  onChange={e => { update('city', e.target.value); setTimeout(() => applyFilters(), 100) }}
                  style={{
                    ...inputStyle,
                    background: '#111',
                    color: filters.city ? '#F5F3EE' : '#666',
                  }}
                >
                  <option value="" style={{ background: '#111', color: '#666' }}>Any city...</option>
                  {UTAH_CITIES.map(city => (
                    <option key={city} value={city} style={{ background: '#111', color: '#F5F3EE' }}>{city}</option>
                  ))}
                </select>
              </div>
              {/* Near Me button */}
              <div style={{ alignSelf: 'flex-end' }}>
                <button
                  onClick={() => {
                    if ('geolocation' in navigator) {
                      navigator.geolocation.getCurrentPosition(async (pos) => {
                        try {
                          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`, { headers: { 'Accept-Language': 'en' } })
                          const data = await res.json()
                          const city = data.address?.city || data.address?.town
                          if (city) {
                            const match = UTAH_CITIES.find(c => c.toLowerCase() === city.toLowerCase())
                            if (match) { update('city', match); setTimeout(applyFilters, 200) }
                          }
                        } catch {
                          // ignore
                        }
                      })
                    }
                  }}
                  style={{
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: '#C9A84C',
                    padding: '0 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    height: '42px',
                    whiteSpace: 'nowrap',
                    fontFamily: 'inherit'
                  }}
                >
                  📍 Near Me
                </button>
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Min Price</label>
                <select value={filters.minPrice} onChange={e => update('minPrice', e.target.value)} style={inputStyle}>
                  <option value="">No Min</option>
                  {[100,150,200,250,300,350,400,500,600,750,1000].map(n => <option key={n} value={n*1000}>${n}K</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Max Price</label>
                <select value={filters.maxPrice} onChange={e => update('maxPrice', e.target.value)} style={inputStyle}>
                  <option value="">No Max</option>
                  {[200,300,400,500,600,750,1000,1500,2000].map(n => <option key={n} value={n*1000}>${n}K</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 100px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Beds</label>
                <select value={filters.beds} onChange={e => update('beds', e.target.value)} style={inputStyle}>
                  <option value="">Any</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 100px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Baths</label>
                <select value={filters.baths} onChange={e => update('baths', e.target.value)} style={inputStyle}>
                  <option value="">Any</option>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Type</label>
                <select value={filters.type} onChange={e => update('type', e.target.value)} style={inputStyle}>
                  <option value="">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Condominium">Condo/Townhouse</option>
                  <option value="Commercial Sale">Commercial</option>
                  <option value="Land">Land</option>
                </select>
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Sort</label>
                <select value={filters.orderBy} onChange={e => update('orderBy', e.target.value)} style={inputStyle}>
                  <option value="ListPrice desc">Price: High to Low</option>
                  <option value="ListPrice asc">Price: Low to High</option>
                  <option value="ModificationTimestamp desc">Newest</option>
                </select>
              </div>
              <button onClick={applyFilters} style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C070)', border: 'none', borderRadius: '8px', padding: '0 28px', height: '42px', fontSize: '14px', fontWeight: '600', color: '#0A0A0A', cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-end' }}>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ marginBottom: '24px' }}>
            {/* Map / List toggle */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={() => setViewMode('list')} style={{
                padding: '8px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '13px',
                background: viewMode === 'list' ? '#C9A84C' : 'rgba(255,255,255,0.06)',
                color: viewMode === 'list' ? '#0A0A0A' : '#888',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}>☰ List</button>
              <button onClick={() => setViewMode('map')} style={{
                padding: '8px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '13px',
                background: viewMode === 'map' ? '#C9A84C' : 'rgba(255,255,255,0.06)',
                color: viewMode === 'map' ? '#0A0A0A' : '#888',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}>🗺️ Map</button>
            </div>

            {loading && properties.length === 0 ? (
              <span style={{ color: '#555', fontSize: '14px' }}>Searching Utah MLS...</span>
            ) : (
              <span style={{ color: '#888', fontSize: '14px' }}>
                <span style={{ color: '#C9A84C', fontWeight: '600', fontSize: '18px' }}>{total.toLocaleString()}</span> Utah properties found
                {filters.city && <span> in <strong style={{ color: '#F5F3EE' }}>{filters.city}</strong></span>}
              </span>
            )}
          </div>

          {/* Get Notified Alert Widget */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>
              🔔 Get emailed when new homes appear in {filters.city || 'Utah'}
            </span>
            <button
              onClick={() => setAlertModalOpen(true)}
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#C9A84C',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '600',
                fontFamily: 'inherit',
              }}
            >
              Set Up Alert
            </button>
          </div>

          {/* Map view */}
          {viewMode === 'map' && (
            <PropertyMap properties={properties} />
          )}

          {/* List view */}
          {viewMode === 'list' && (
            loading && properties.length === 0 ? (
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
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#888', marginBottom: '8px' }}>No listings found</h3>
                <p style={{ fontSize: '14px' }}>Try adjusting your filters or searching a different city.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                  {properties.map((property, i) => (
                    <PropertyCard key={property.ListingKey} property={property} priority={i < 6} />
                  ))}
                </div>
                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: '48px' }}>
                    <button onClick={() => { const next = page + 1; setPage(next); fetchListings(filters, next, true) }} disabled={loading} style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '8px', padding: '14px 40px', color: '#C9A84C', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {loading ? 'Loading...' : `Load More (${total - properties.length} remaining)`}
                    </button>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </main>
      <Footer />

      {/* Listing Alert Modal */}
      {alertModalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setAlertModalOpen(false) }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
        >
          <div style={{
            background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
            padding: '32px', width: '100%', maxWidth: '460px', position: 'relative',
          }}>
            {/* Close button */}
            <button
              onClick={() => setAlertModalOpen(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', color: '#888', fontSize: '20px',
                cursor: 'pointer', lineHeight: 1,
              }}
            >
              ✕
            </button>

            {alertSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#C9A84C', marginBottom: '8px' }}>
                  Alert Set Up!
                </h3>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                  You&apos;ll receive email alerts when new properties appear in{' '}
                  <strong style={{ color: '#F5F3EE' }}>{filters.city || 'Utah'}</strong>.
                  Check your inbox for a confirmation.
                </p>
                <button
                  onClick={() => { setAlertModalOpen(false); setAlertSuccess(false) }}
                  style={{
                    marginTop: '20px', background: '#C9A84C', border: 'none', borderRadius: '8px',
                    padding: '12px 28px', fontSize: '14px', fontWeight: '600', color: '#0A0A0A',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#F5F3EE', marginBottom: '4px' }}>
                  🔔 Get Listing Alerts
                </h3>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px', lineHeight: '1.5' }}>
                  We&apos;ll email you when new homes matching your search appear in{' '}
                  <strong style={{ color: '#C9A84C' }}>{filters.city || 'Utah'}</strong>.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={alertForm.name}
                      onChange={e => setAlertForm(prev => ({ ...prev, name: e.target.value }))}
                      style={modalInputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={alertForm.email}
                      onChange={e => setAlertForm(prev => ({ ...prev, email: e.target.value }))}
                      style={modalInputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="801-555-0100"
                      value={alertForm.phone}
                      onChange={e => setAlertForm(prev => ({ ...prev, phone: e.target.value }))}
                      style={modalInputStyle}
                    />
                  </div>
                </div>

                {/* Summary of criteria */}
                <div style={{
                  marginTop: '20px', padding: '14px', background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.15)', borderRadius: '10px',
                }}>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: '1.6' }}>
                    <strong style={{ color: '#C9A84C' }}>Alert criteria:</strong>{' '}
                    {filters.city || 'All Utah'}{' '}
                    {filters.propertyType ? `· ${PROPERTY_TYPES.find(pt => pt.value === filters.propertyType)?.label}` : ''}{' '}
                    {filters.minPrice ? `· From $${Number(filters.minPrice).toLocaleString()}` : ''}{' '}
                    {filters.maxPrice ? `· Up to $${Number(filters.maxPrice).toLocaleString()}` : ''}{' '}
                    {filters.beds ? `· ${filters.beds}+ beds` : ''}
                  </p>
                </div>

                {alertError && (
                  <p style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '12px' }}>{alertError}</p>
                )}

                <button
                  onClick={handleAlertSubmit}
                  disabled={alertSubmitting}
                  style={{
                    width: '100%', marginTop: '20px',
                    background: alertSubmitting ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg, #C9A84C, #E2C070)',
                    border: 'none', borderRadius: '8px', padding: '14px',
                    fontSize: '15px', fontWeight: '600', color: '#0A0A0A',
                    cursor: alertSubmitting ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {alertSubmitting ? 'Setting up alert...' : 'Notify Me of New Listings →'}
                </button>

                <p style={{ fontSize: '11px', color: '#555', textAlign: 'center', marginTop: '12px' }}>
                  No spam. Unsubscribe any time.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px' }}>Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
