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

// Utah ZIP code centroids — covers all major MLS areas
const ZIP_COORDS: Record<string, [number, number]> = {
  // Salt Lake City
  '84101': [-111.8910, 40.7608], '84102': [-111.8734, 40.7587], '84103': [-111.8818, 40.7785],
  '84104': [-111.9278, 40.7542], '84105': [-111.8610, 40.7467], '84106': [-111.8610, 40.7267],
  '84107': [-111.8880, 40.6970], '84108': [-111.8234, 40.7634], '84109': [-111.8234, 40.7234],
  '84111': [-111.8834, 40.7534], '84112': [-111.8434, 40.7634], '84115': [-111.8934, 40.7134],
  '84116': [-111.9334, 40.7834], '84117': [-111.8334, 40.6834], '84118': [-111.9534, 40.6834],
  '84119': [-111.9534, 40.7134], '84120': [-111.9734, 40.7034], '84121': [-111.8134, 40.6534],
  '84123': [-111.9034, 40.6634], '84124': [-111.8134, 40.7034],
  // West Jordan
  '84081': [-112.0018, 40.6097], '84084': [-111.9718, 40.6297], '84088': [-111.9418, 40.6097],
  // Sandy / Draper / South Jordan
  '84070': [-111.8834, 40.5797], '84092': [-111.8434, 40.5697], '84093': [-111.8234, 40.5597],
  '84094': [-111.8634, 40.5697], '84095': [-111.9734, 40.5597], '84096': [-112.0134, 40.5297],
  // Provo / Orem
  '84601': [-111.6597, 40.2338], '84602': [-111.6497, 40.2438], '84604': [-111.6297, 40.2738],
  '84606': [-111.6497, 40.2138], '84097': [-111.6997, 40.2938], '84057': [-111.7197, 40.2538],
  '84058': [-111.7397, 40.2338],
  // Ogden
  '84401': [-111.9733, 41.2230], '84403': [-111.9533, 41.1930], '84404': [-112.0133, 41.2430],
  '84405': [-111.9933, 41.1730],
  // Park City / Summit County
  '84060': [-111.4980, 40.6461], '84098': [-111.5480, 40.6861],
  // Lehi / American Fork
  '84043': [-111.8497, 40.3922], '84003': [-111.7997, 40.3722],
  // Murray / Midvale / Taylorsville
  '84047': [-111.9080, 40.6270],
  // St George
  '84770': [-113.5684, 37.0965], '84790': [-113.5284, 37.0665],
  // Logan
  '84321': [-111.8338, 41.7370],
  // Moab
  '84532': [-109.5498, 38.5733],
  // Generic Utah fallback
  'default': [-111.8910, 40.7608],
}

function getCoordsForProperty(prop: Property): [number, number] {
  const zip = prop.PostalCode?.trim().slice(0, 5)
  const base = (zip && ZIP_COORDS[zip]) ? ZIP_COORDS[zip] : ZIP_COORDS['default']
  // Add small random offset so pins don't stack exactly on top of each other
  const jitter = 0.008
  return [
    base[0] + (Math.random() - 0.5) * jitter,
    base[1] + (Math.random() - 0.5) * jitter,
  ]
}

function formatPrice(price: number): string {
  if (!price) return ''
  return price >= 1_000_000
    ? `$${(price / 1_000_000).toFixed(1)}M`
    : `$${Math.round(price / 1000)}K`
}

export default function PropertyMap({ properties, onPropertySelect }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [pinCount, setPinCount] = useState(0)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || token === 'pk.your_mapbox_token_here') {
      setMapError('Map unavailable')
      return
    }

    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = token

      // Auto-center on first property's city
      const firstZip = properties[0]?.PostalCode?.trim().slice(0, 5)
      const center: [number, number] = (firstZip && ZIP_COORDS[firstZip])
        ? ZIP_COORDS[firstZip]
        : [-111.891, 40.760]

      const map = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center,
        zoom: properties.length < 50 ? 11 : 9,
      })

      mapRef.current = map

      map.on('load', () => {
        let count = 0
        // Show ALL properties — up to 500 at a time using ZIP centroid coordinates
        const toPin = properties.slice(0, 500)

        toPin.forEach((prop) => {
          const [lng, lat] = getCoordsForProperty(prop)

          // Price label marker
          const el = document.createElement('div')
          el.style.cssText = `
            background: linear-gradient(135deg, #C9A84C, #E2C070);
            color: #0A0A0A;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            transition: transform 0.15s;
          `
          el.textContent = formatPrice(prop.ListPrice) || prop.City || ''
          el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.1)' })
          el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
          el.addEventListener('click', (e) => {
            e.stopPropagation()
            onPropertySelect?.(prop.ListingKey)
            // Popup opens automatically via Mapbox — don't navigate on click
          })

          const address = [prop.StreetNumber, prop.StreetName, prop.StreetSuffix].filter(Boolean).join(' ')

          new mapboxgl.default.Marker({ element: el })
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.default.Popup({ offset: 25, maxWidth: '240px' }).setHTML(`
                <div style="font-family: DM Sans, sans-serif; padding: 8px; background: #fff; border-radius: 6px;">
                  <div style="font-weight: 800; font-size: 16px; color: #0A0A0A; margin-bottom: 2px;">
                    ${formatPrice(prop.ListPrice)}
                  </div>
                  <div style="font-size: 12px; color: #555; margin-bottom: 6px;">
                    ${address ? address + ', ' : ''}${prop.City}, UT ${prop.PostalCode || ''}
                  </div>
                  ${prop.BedroomsTotal ? `<div style="font-size: 12px; color: #333;">${prop.BedroomsTotal} bd · ${prop.BathroomsTotalInteger || '?'} ba</div>` : ''}
                  <a href="/listing/${prop.ListingKey}" target="_blank"
                    style="display: block; margin-top: 8px; padding: 7px 12px; background: #C9A84C;
                    color: #0A0A0A; text-decoration: none; border-radius: 6px; font-weight: 700;
                    font-size: 13px; text-align: center;">
                    View Listing →
                  </a>
                </div>
              `)
            )
            .addTo(map)
          count++
        })

        setPinCount(count)
      })
    })

    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [properties, onPropertySelect])

  if (mapError) {
    return (
      <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#888' }}>
        Map unavailable
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css" rel="stylesheet" />
      <div ref={mapContainer} style={{ height: '600px', width: '100%', borderRadius: '12px' }} />
      {pinCount > 0 && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 10,
          background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)',
          color: '#C9A84C', fontSize: '12px', padding: '6px 14px', borderRadius: '8px',
          border: '1px solid rgba(201,168,76,0.3)',
        }}>
          {pinCount} of {properties.length} listings on map
        </div>
      )}
    </div>
  )
}
