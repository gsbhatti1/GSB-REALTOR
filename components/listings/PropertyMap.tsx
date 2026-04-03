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

/**
 * Extract lat/lng from a property — handles multiple API formats:
 *  - Direct Latitude/Longitude fields
 *  - GeoLocation as POINT string: "POINT(-111.8 40.7)"
 *  - GeoLocation as GeoJSON object: { type: "Point", coordinates: [-111.8, 40.7] }
 *  - GeoLocation with nested coordinates array
 */
function extractCoords(property: Property): { lng: number; lat: number } | null {
  // 1. Try direct Latitude/Longitude first
  if (
    typeof property.Latitude === 'number' && !isNaN(property.Latitude) &&
    typeof property.Longitude === 'number' && !isNaN(property.Longitude) &&
    property.Latitude !== 0 && property.Longitude !== 0
  ) {
    return { lat: property.Latitude, lng: property.Longitude }
  }

  // 2. Try GeoLocation field
  const geo = property.GeoLocation
  if (!geo) return null

  try {
    // String: "POINT(-111.891 40.760)"
    if (typeof geo === 'string') {
      const match = geo.match(/POINT\s*\(\s*([^ ]+)\s+([^ ]+)\s*\)/)
      if (match) {
        const lng = parseFloat(match[1])
        const lat = parseFloat(match[2])
        if (!isNaN(lng) && !isNaN(lat)) return { lng, lat }
      }
    }

    // Object: GeoJSON or { coordinates: [lng, lat] }
    if (typeof geo === 'object' && geo !== null) {
      const obj = geo as Record<string, unknown>

      // GeoJSON: { type: "Point", coordinates: [-111.8, 40.7] }
      if (Array.isArray(obj.coordinates) && obj.coordinates.length >= 2) {
        const [lng, lat] = obj.coordinates as number[]
        if (!isNaN(lng) && !isNaN(lat)) return { lng, lat }
      }

      // Nested: { Latitude: ..., Longitude: ... }
      if (typeof obj.Latitude === 'number' && typeof obj.Longitude === 'number') {
        return { lat: obj.Latitude as number, lng: obj.Longitude as number }
      }
    }
  } catch {
    // ignore parse errors
  }

  return null
}

export default function PropertyMap({ properties, onPropertySelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [, setSelectedProperty] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || token === 'pk.your_mapbox_token_here') {
      setMapError('Map unavailable — Mapbox token not configured')
      return
    }

    // Dynamic import to avoid SSR issues
    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = token

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
          const coords = extractCoords(property)
          if (coords) {
            validProperties.push({ property, ...coords })
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

      map.on('error', (e) => {
        console.error('Mapbox error:', e)
        if (e.error?.message?.includes('access token')) {
          setMapError('Map unavailable — invalid Mapbox token')
        }
      })
    }).catch(err => {
      console.error('Failed to load mapbox-gl:', err)
      setMapError('Map unavailable — failed to load map library')
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [properties, onPropertySelect])

  const withCoords = properties.filter(p => extractCoords(p) !== null).length

  if (mapError) {
    return (
      <div style={{
        width: '100%', height: '400px', borderRadius: '12px',
        background: '#111', border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '12px', color: '#888',
      }}>
        <div style={{ fontSize: '40px' }}>🗺️</div>
        <p style={{ fontSize: '14px' }}>{mapError}</p>
        <p style={{ fontSize: '12px', color: '#555' }}>
          Switch to List view to browse properties
        </p>
      </div>
    )
  }

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
