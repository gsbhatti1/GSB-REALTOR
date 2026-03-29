import Link from 'next/link'
import { MLSProperty, formatPrice, getPropertyThumbnail, getPropertyAddress } from '@/lib/mls'

interface PropertyCardProps {
  property: MLSProperty
  priority?: boolean
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const photo   = getPropertyThumbnail(property)
  const address = getPropertyAddress(property)

  return (
    <Link href={`/listing/${property.ListingKey}`} className="property-card-link">
      <div className="property-card">

        {/* Photo */}
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#1a1a1a' }}>
          {photo && photo !== '/images/no-photo.jpg' ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo}
              alt={address}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            <div style={{
              height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #161616, #1f1f1f)',
            }}>
              <svg width="48" height="48" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          )}

          {/* Status badge */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: property.StandardStatus === 'Active' ? 'rgba(34,197,94,0.9)' : 'rgba(201,168,76,0.9)',
            color: '#000', fontSize: '10px', fontWeight: '700',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: '4px',
          }}>
            {property.StandardStatus}
          </div>

          {/* Property type */}
          {property.PropertySubType && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)',
              color: '#C9A84C', fontSize: '10px', fontWeight: '600',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: '4px',
            }}>
              {property.PropertySubType}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '20px' }}>
          <div className="price-tag">{formatPrice(property.ListPrice)}</div>
          <div style={{ fontSize: '14px', color: '#F5F3EE', fontWeight: '500', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {address}
          </div>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
            {property.City}, UT {property.PostalCode}
          </div>
          <div style={{ display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {(property.BedroomsTotal ?? 0) > 0 && <span style={{ fontSize: '12px', color: '#888' }}>🛏 {property.BedroomsTotal} bd</span>}
            {(property.BathroomsTotalInteger ?? 0) > 0 && <span style={{ fontSize: '12px', color: '#888' }}>🚿 {property.BathroomsTotalInteger} ba</span>}
            {(property.LivingArea ?? 0) > 0 && <span style={{ fontSize: '12px', color: '#888' }}>📐 {property.LivingArea?.toLocaleString()} sf</span>}
          </div>
        </div>

      </div>
    </Link>
  )
}
