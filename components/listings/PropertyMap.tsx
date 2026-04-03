'use client'
import { useEffect, useRef, useState } from 'react'

interface Property {
  ListingKey: string
  ListPrice: number
  City: string
  StreetNumber?: string
  StreetName?: string
  StreetSuffix?: string
  PostalCode?: string
  BedroomsTotal?: number
  BathroomsTotalInteger?: number
  GeoLocation?: unknown
}

interface Props {
  properties: Property[]
  onPropertySelect?: (key: string) => void
}

export default function PropertyMap({ properties, onPropertySelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [geocoded, setGeocoded] = useState(0)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || token === 'pk.your_mapbox_token_here') {
      setMapError('Map unavailable')
      return
    }

    import('mapbox-gl').then(async (mapboxgl) => {
      mapboxgl.default.accessToken = token

      const map = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-111.891, 40.760],
        zoom: 9,
      })

      mapRef.current = map

      map.on('load', async () => {
        // Geocode all properties on current page (max 24)
        const toGeocode = properties.slice(0, 24)
        let count = 0

        await Promise.all(toGeocode.map(async (prop) => {
          const address = `${prop.StreetNumber || ''} ${prop.StreetName || ''} ${prop.StreetSuffix || ''}, ${prop.City || ''}, UT ${prop.PostalCode || ''}`
          try {
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address.trim())}.json?access_token=${token}&country=US&limit=1`
            )
            const data = await res.json()
            const coords = data.features?.[0]?.center
            if (coords) {
              const [lng, lat] = coords
              count++

              // Create marker element
              const el = document.createElement('div')
              el.style.cssText = `
                background: linear-gradient(135deg, #C9A84C, #E2C070);
                color: #0A0A0A;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 700;
                font-family: DM Sans, sans-serif;
                cursor: pointer;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              `
              const price = prop.ListPrice
              el.textContent = price
                ? price >= 1_000_000
                  ? `$${(price / 1_000_000).toFixed(1)}M`
                  : `$${(price / 1000).toFixed(0)}K`
                : prop.City || ''

              el.addEventListener('click', () => {
                onPropertySelect?.(prop.ListingKey)
              })

              new mapboxgl.default.Marker({ element: el })
                .setLngLat([lng, lat])
                .setPopup(
                  new mapboxgl.default.Popup({ offset: 25 }).setHTML(`
                    <div style="font-family: DM Sans, sans-serif; color: #0A0A0A; padding: 4px;">
                      <div style="font-weight: 700; font-size: 14px;">$${prop.ListPrice >= 1000000 ? (prop.ListPrice / 1000000).toFixed(2) + 'M' : (prop.ListPrice / 1000).toFixed(0) + 'K'}</div>
                      <div style="font-size: 12px; color: #555;">${prop.City}, UT</div>
                    </div>
                  `)
                )
                .addTo(map)
            }
          } catch {
            // silently skip failed geocodes
          }
        }))

        setGeocoded(count)
      })
    })

    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [properties, onPropertySelect])

  if (mapError) {
    return (
      <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#888' }}>
        {mapError}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css"
        rel="stylesheet"
      />
      <div ref={mapContainer} style={{ height: '600px', width: '100%', borderRadius: '12px' }} />
      {geocoded > 0 && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 10,
          background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)',
          color: '#C9A84C', fontSize: '12px', padding: '6px 12px', borderRadius: '8px',
          border: '1px solid rgba(201,168,76,0.3)',
        }}>
          {geocoded} of {properties.length} listings pinned
        </div>
      )}
    </div>
  )
}
