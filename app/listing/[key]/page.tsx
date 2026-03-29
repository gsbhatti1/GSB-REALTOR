import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/ui/LeadForm'
import { getProperty, formatPrice } from '@/lib/mls'
import type { Metadata } from 'next'

interface Props {
  params: { key: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.key)
  if (!property) return { title: 'Property Not Found' }

  return {
    title: `${property.UnparsedAddress} — ${formatPrice(property.ListPrice)}`,
    description: `${property.BedroomsTotal} bed, ${property.BathroomsTotalInteger} bath, ${property.LivingArea?.toLocaleString()} sqft home for sale in ${property.City}, Utah. Listed at ${formatPrice(property.ListPrice)}.`,
    openGraph: {
      images: property.Media?.[0]?.MediaURL ? [property.Media[0].MediaURL] : [],
    },
  }
}

export default async function ListingPage({ params }: Props) {
  const property = await getProperty(params.key)

  if (!property) notFound()

  const photos = property.Media || []
  const mainPhoto = photos[0]?.MediaURL || '/images/no-photo.jpg'

  const details = [
    { label: 'Beds',         value: property.BedroomsTotal ?? '—' },
    { label: 'Baths',        value: property.BathroomsTotalInteger ?? '—' },
    { label: 'Sq Ft',        value: property.LivingArea ? property.LivingArea.toLocaleString() : '—' },
    { label: 'Lot (acres)',  value: property.LotSizeAcres?.toFixed(2) ?? '—' },
    { label: 'Year Built',   value: property.YearBuilt ?? '—' },
    { label: 'Garage',       value: property.GarageSpaces ? `${property.GarageSpaces} car` : '—' },
    { label: 'Type',         value: property.PropertyType ?? '—' },
    { label: 'Status',       value: property.StandardStatus ?? '—' },
    { label: 'Days on MLS',  value: property.DaysOnMarket ?? '—' },
    { label: 'MLS #',        value: property.ListingId ?? property.ListingKey },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.UnparsedAddress,
    description: property.PublicRemarks,
    url: `https://gsbrealtor.com/listing/${property.ListingKey}`,
    image: mainPhoto,
    offers: {
      '@type': 'Offer',
      price: property.ListPrice,
      priceCurrency: 'USD',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.UnparsedAddress,
      addressLocality: property.City,
      addressRegion: 'UT',
      postalCode: property.PostalCode,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />
      <main style={{ paddingTop: '80px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* ── Photo Gallery ── */}
        <div style={{ position: 'relative', height: 'clamp(300px, 50vw, 560px)', background: '#111', overflow: 'hidden' }}>
          <img
            src={mainPhoto}
            alt={property.UnparsedAddress}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
          />
          {/* Photo count badge */}
          {photos.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              color: '#F5F3EE',
            }}>
              📷 {photos.length} photos
            </div>
          )}
          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              display: 'flex',
              gap: '8px',
            }}>
              {photos.slice(1, 5).map((photo, i) => (
                <img
                  key={i}
                  src={photo.MediaURL}
                  alt={`Photo ${i + 2}`}
                  style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: '6px', opacity: 0.8, border: '1px solid rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Main Content ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr min(400px, 100%)', gap: '64px', alignItems: 'start' }}>

            {/* Left: Listing info */}
            <div>
              {/* Breadcrumb */}
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>
                <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
                {' / '}
                <Link href="/search" style={{ color: '#555', textDecoration: 'none' }}>Search</Link>
                {' / '}
                <Link href={`/search?city=${property.City}`} style={{ color: '#555', textDecoration: 'none' }}>{property.City}</Link>
                {' / '}
                <span style={{ color: '#888' }}>{property.UnparsedAddress}</span>
              </div>

              {/* Status badge */}
              <div style={{
                display: 'inline-block',
                background: property.StandardStatus === 'Active' ? 'rgba(74,222,128,0.1)' : 'rgba(201,168,76,0.1)',
                border: `1px solid ${property.StandardStatus === 'Active' ? 'rgba(74,222,128,0.3)' : 'rgba(201,168,76,0.3)'}`,
                borderRadius: '100px',
                padding: '4px 14px',
                fontSize: '12px',
                color: property.StandardStatus === 'Active' ? '#4ade80' : '#C9A84C',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                {property.StandardStatus}
              </div>

              {/* Address + Price */}
              <h1 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: '400',
                color: '#F5F3EE',
                marginBottom: '8px',
                lineHeight: '1.1',
              }}>
                {property.UnparsedAddress}
              </h1>
              <p style={{ fontSize: '16px', color: '#888', marginBottom: '24px' }}>
                {property.City}, Utah {property.PostalCode}
              </p>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: '600',
                color: '#C9A84C',
                marginBottom: '40px',
              }}>
                {formatPrice(property.ListPrice)}
              </div>

              {/* Quick stats */}
              <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '40px',
                paddingBottom: '40px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                {property.BedroomsTotal && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontFamily: 'Cormorant Garamond, serif', color: '#F5F3EE' }}>{property.BedroomsTotal}</div>
                    <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Beds</div>
                  </div>
                )}
                {property.BathroomsTotalInteger && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontFamily: 'Cormorant Garamond, serif', color: '#F5F3EE' }}>{property.BathroomsTotalInteger}</div>
                    <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Baths</div>
                  </div>
                )}
                {property.LivingArea && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontFamily: 'Cormorant Garamond, serif', color: '#F5F3EE' }}>{property.LivingArea.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sq Ft</div>
                  </div>
                )}
                {property.LotSizeAcres && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontFamily: 'Cormorant Garamond, serif', color: '#F5F3EE' }}>{property.LotSizeAcres.toFixed(2)}</div>
                    <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Acres</div>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.PublicRemarks && (
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#F5F3EE', marginBottom: '16px', fontWeight: '400' }}>
                    About This Property
                  </h2>
                  <p style={{ fontSize: '15px', color: '#999', lineHeight: '1.8' }}>
                    {property.PublicRemarks}
                  </p>
                </div>
              )}

              {/* Details grid */}
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#F5F3EE', marginBottom: '20px', fontWeight: '400' }}>
                  Property Details
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden' }}>
                  {details.map(d => (
                    <div key={d.label} style={{ background: '#0D0D0D', padding: '16px 20px' }}>
                      <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{d.label}</div>
                      <div style={{ fontSize: '15px', color: '#F5F3EE' }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent info */}
              {property.ListAgentFullName && (
                <div style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#666',
                }}>
                  Listed by {property.ListAgentFullName}
                  {property.ListOfficeName && ` · ${property.ListOfficeName}`}
                  {' · '}MLS # {property.ListingId}
                </div>
              )}
            </div>

            {/* Right: Lead form (sticky) */}
            <div style={{ position: 'sticky', top: '96px' }}>
              <LeadForm
                leadType="tour_request"
                title="Schedule a Tour"
                subtitle="Gurpreet will get back to you within the hour."
                propertyId={property.ListingKey}
                propertyAddress={property.UnparsedAddress}
              />

              {/* Quick contact */}
              <div style={{ marginTop: '16px', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>Or reach Gurpreet directly</p>
                <a href="tel:8016358462" style={{ display: 'block', color: '#C9A84C', textDecoration: 'none', fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', marginBottom: '4px' }}>
                  801.635.8462
                </a>
                <p style={{ fontSize: '11px', color: '#444' }}>USMC Veteran · REALTOR® · UT Lic# 12907042-SA00</p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
