'use client'
import { useEffect, useRef, useState } from 'react'

interface Property {
  ListingKey: string
  ListPrice: number
  UnparsedAddress: string
  City: string
  BedroomsTotal: number
  BathroomsTotalInteger: number
  Latitude?: number
  Longitude?: number
  GeoLocation?: unknown
}

interface Props {
  properties: Property[]
  onPropertySelect?: (key: string) => void
}

export default function PropertyMap({ properties, onPropertySelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [, setSelectedProperty] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    // Dynamic import to avoid SSR issues
    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

      const map = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-111.891, 40.760], // Salt Lake City
        zoom: 10,
      })

      mapRef.current = map

      map.on('load', () => {
        const validProperties: Array<{ property: Property; lng: number; lat: number }> = []

        for (const property of properties) {
          let lng: number | undefined
          let lat: number | undefined

          try {
            // Try Latitude/Longitude fields first
            if (property.Latitude && property.Longitude) {
              lat = property.Latitude
              lng = property.Longitude
            } else if (property.GeoLocation) {
              const geo = property.GeoLocation as string | { coordinates?: [number, number] }
              if (typeof geo === 'string' && geo.includes('POINT')) {
                const match = geo.match(/POINT\(([^ ]+) ([^ ]+)\)/)
                if (match) {
                  lng = parseFloat(match[1])
                  lat = parseFloat(match[2])
                }
              } else if (typeof geo === 'object' && geo !== null && 'coordinates' in geo && geo.coordinates) {
                ;[lng, lat] = geo.coordinates
              }
            }
          } catch {
            // ignore parse errors
          }

          if (lng !== undefined && lat !== undefined && !isNaN(lng) && !isNaN(lat)) {
            validProperties.push({ property, lng, lat })
          }
        }

        validProperties.forEach(({ property, lng, lat }) => {
          const price = property.ListPrice
          const label =
            price >= 1_000_000
              ? `$${(price / 1_000_000).toFixed(1)}M`
              : `$${Math.round(price / 1000)}K`

          const el = document.createElement('div')
          el.innerHTML = `<div style="
            background: #C9A84C; color: #0A0A0A;
            padding: 4px 8px; border-radius: 20px;
            font-size: 11px; font-weight: 700;
            cursor: pointer; white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            border: 2px solid rgba(255,255,255,0.2);
            transition: all 0.15s;
          ">${label}</div>`

          el.addEventListener('click', () => {
            setSelectedProperty(property.ListingKey)
            onPropertySelect?.(property.ListingKey)
          })

          new mapboxgl.default.Marker({ element: el })
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.default.Popup({ offset: 25 }).setHTML(`
                <div style="background:#111;color:#F5F3EE;padding:12px;border-radius:8px;min-width:200px;">
                  <div style="color:#C9A84C;font-weight:700;font-size:16px;">
                    $${property.ListPrice?.toLocaleString()}
                  </div>
                  <div style="font-size:13px;margin-top:4px;">${property.UnparsedAddress || ''}</div>
                  <div style="color:#888;font-size:12px;">${property.City || ''}, UT</div>
                  ${property.BedroomsTotal ? `<div style="color:#888;font-size:12px;margin-top:4px;">${property.BedroomsTotal}bd / ${property.BathroomsTotalInteger}ba</div>` : ''}
                  <a href="/listing/${property.ListingKey}" style="display:inline-block;margin-top:8px;background:#C9A84C;color:#000;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;">View Details →</a>
                </div>
              `)
            )
            .addTo(map)
        })

        // Fit map to markers if there are any
        if (validProperties.length > 0) {
          const bounds = new mapboxgl.default.LngLatBounds()
          validProperties.forEach(({ lng, lat }) => bounds.extend([lng, lat]))
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { padding: 50, maxZoom: 14 })
          }
        }
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [properties, onPropertySelect])

  const withCoords = properties.filter(p => {
    if (p.Latitude && p.Longitude) return true
    if (p.GeoLocation) return true
    return false
  }).length

  return (
    <>
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css"
        rel="stylesheet"
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(10,10,10,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#888',
            fontSize: '12px',
          }}
        >
          {withCoords} properties shown on map
        </div>
      </div>
    </>
  )
}
