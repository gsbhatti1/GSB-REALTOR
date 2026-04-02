import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Record | Sold Properties | GSB Realtor — Gurpreet Bhatti',
  description: '$7.3M+ in residential sales. Commercial deals across Utah, Arizona, and Texas. Gurpreet Bhatti, Utah REALTOR® and USMC Veteran with a proven track record.',
}

interface SoldProperty {
  address: string
  city: string
  price: number | null
  type: string
  date: string
  beds?: number | null
  baths?: number | null
  highlight: boolean
  photo?: string | null
  note?: string
}

const SOLD: SoldProperty[] = [
  // RESIDENTIAL (from MLS)
  {
    address: '14232 S Jemma Dr',
    city: 'Bluffdale, UT 84065',
    price: 2750000,
    type: 'Residential',
    date: 'August 2023',
    beds: null, baths: null,
    highlight: true,
    photo: null,
  },
  {
    address: '2970 E Juliet Way',
    city: 'Salt Lake City, UT 84121',
    price: 1277500,
    type: 'Residential',
    date: 'July 2024',
    beds: null, baths: null,
    highlight: false,
    photo: null,
  },
  {
    address: '6318 S Lake Fork Cir',
    city: 'Taylorsville, UT 84129',
    price: 1000000,
    type: 'Residential',
    date: 'March 2024',
    beds: null, baths: null,
    highlight: false,
    photo: null,
  },
  {
    address: '2970 W 8870 S',
    city: 'West Jordan, UT 84088',
    price: 985000,
    type: 'Residential',
    date: 'December 2025',
    beds: null, baths: null,
    highlight: false,
    photo: null,
  },
  {
    address: '11167 S Village Grove Ln',
    city: 'South Jordan, UT 84095',
    price: 572750,
    type: 'Residential',
    date: 'July 2023',
    beds: null, baths: null,
    highlight: false,
    photo: null,
  },
  {
    address: '756 W Kirkbride Ave',
    city: 'South Salt Lake, UT 84119',
    price: 442000,
    type: 'Residential',
    date: 'February 2024',
    beds: null, baths: null,
    highlight: false,
    photo: null,
  },
  {
    address: '5720 S 900 E #12',
    city: 'Salt Lake City, UT 84121',
    price: 270000,
    type: 'Residential',
    date: 'June 2023',
    beds: null, baths: null,
    highlight: false,
    photo: null,
  },
  // COMMERCIAL
  {
    address: '10509 S River Heights Dr',
    city: 'South Jordan, UT 84095',
    price: null,
    type: 'Commercial — Office Condos',
    date: '2025',
    highlight: true,
    photo: null,
    note: 'SOJO Office Condos · Multi-unit commercial complex · Units from 2,500–15,000 sq ft',
  },
  {
    address: '5500 S Redwood Road',
    city: 'Taylorsville, UT',
    price: null,
    type: 'Commercial — Retail Strip',
    date: '2025',
    highlight: false,
    photo: null,
    note: 'Shops on Redwood · Multi-tenant retail · Tenants include Starbucks, AT&T',
  },
  {
    address: '9210 E Via de Ventura',
    city: 'Scottsdale, AZ',
    price: null,
    type: 'Commercial — NNN Retail',
    date: '2025',
    highlight: false,
    photo: null,
    note: 'MOD Pizza NNN · Single-tenant freestanding building · Passive income investment',
  },
  {
    address: '301 N Alton Blvd',
    city: 'Alton, TX',
    price: null,
    type: 'Commercial — Strip Center',
    date: '2026',
    highlight: false,
    photo: null,
    note: 'Alton Plaza · Multi-tenant retail strip · Anchor tenants: Pappas Pizza, Drive Insurance',
  },
]

const RESIDENTIAL = SOLD.filter(p => p.type === 'Residential')
const COMMERCIAL = SOLD.filter(p => p.type.startsWith('Commercial'))

function formatPrice(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

// Subtle architectural SVG pattern for card backgrounds
function ArchPattern({ seed = 0 }: { seed?: number }) {
  const offsets = [0, 30, 60, 90, 120, 150].map(v => (v + seed * 17) % 180)
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={`arch-${seed}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <line x1="0" y1={offsets[0]} x2="60" y2={offsets[1]} stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1={offsets[2]} y1="0" x2={offsets[3]} y2="60" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="30" cy="30" r="12" stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
          <rect x="20" y="20" width="20" height="20" stroke="#C9A84C" strokeWidth="0.4" fill="none" transform={`rotate(45 30 30)`}/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#arch-${seed})`}/>
    </svg>
  )
}

export default function TrackRecordPage() {
  return (
    <>
      <Navbar />

      <style>{`
        /* ── Track Record page styles ── */
        .tr-hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
        }
        .tr-res-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .tr-res-featured {
          grid-column: span 2;
        }
        .tr-comm-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .tr-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }
        .tr-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.25) !important;
        }
        .tr-stat-item {
          background: rgba(201,168,76,0.04);
          border: 1px solid rgba(201,168,76,0.12);
          padding: 32px 28px;
          text-align: center;
        }
        .tr-stat-item:first-child { border-radius: 12px 0 0 12px; }
        .tr-stat-item:last-child  { border-radius: 0 12px 12px 0; }
        .tr-cta-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #C9A84C; color: #0A0A0A;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase;
          padding: 16px 32px; border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .tr-cta-btn-primary:hover { background: #e0bc60; transform: translateY(-1px); }
        .tr-cta-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #C9A84C;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase;
          padding: 16px 32px; border-radius: 8px; border: 1.5px solid rgba(201,168,76,0.5);
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .tr-cta-btn-ghost:hover {
          border-color: #C9A84C;
          background: rgba(201,168,76,0.07);
          transform: translateY(-1px);
        }
        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 0;
        }
        @media (max-width: 1024px) {
          .tr-res-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .tr-res-featured { grid-column: span 2 !important; }
          .tr-hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .tr-stat-item:first-child { border-radius: 12px 0 0 0; }
          .tr-stat-item:nth-child(2) { border-radius: 0 12px 0 0; }
          .tr-stat-item:nth-child(3) { border-radius: 0 0 0 12px; }
          .tr-stat-item:last-child  { border-radius: 0 0 12px 0; }
        }
        @media (max-width: 768px) {
          .tr-res-grid { grid-template-columns: 1fr !important; }
          .tr-res-featured { grid-column: span 1 !important; }
          .tr-comm-grid { grid-template-columns: 1fr !important; }
          .tr-hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .tr-cta-row { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
          .tr-cta-row a { justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .tr-hero-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* ── HERO ── */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#0A0A0A',
          padding: 'clamp(72px, 10vw, 140px) clamp(24px, 5vw, 80px) clamp(60px, 8vw, 100px)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>

          {/* Background grid lines */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, opacity: 0.035,
            backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}/>

          {/* Radial glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '-20%', right: '-10%',
            width: '60vw', height: '60vw',
            background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}/>

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

            <div className="section-label" style={{ marginBottom: '24px' }}>
              Gurpreet Bhatti · REALTOR® · USMC Veteran
            </div>

            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(54px, 8vw, 112px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '0.92',
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}>
              Proven
            </h1>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(54px, 8vw, 112px)',
              fontWeight: '700',
              color: '#C9A84C',
              lineHeight: '0.92',
              letterSpacing: '-0.02em',
              fontStyle: 'italic',
              marginBottom: '36px',
            }}>
              Results.
            </h1>

            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              color: '#888',
              lineHeight: '1.8',
              maxWidth: '560px',
              marginBottom: '64px',
            }}>
              From Bluffdale luxury to commercial strip centers — Gurpreet Bhatti closes deals across Utah and beyond.
            </p>

            {/* Stats bar */}
            <div className="tr-hero-stats" style={{ maxWidth: '860px' }}>
              <div className="tr-stat-item">
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  fontWeight: '600',
                  color: '#C9A84C',
                  lineHeight: '1',
                  marginBottom: '8px',
                }}>
                  $7.3M+
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#666',
                }}>
                  Residential Volume
                </div>
              </div>
              <div className="tr-stat-item">
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  fontWeight: '600',
                  color: '#C9A84C',
                  lineHeight: '1',
                  marginBottom: '8px',
                }}>
                  11
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#666',
                }}>
                  Closed Deals
                </div>
              </div>
              <div className="tr-stat-item">
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  fontWeight: '600',
                  color: '#C9A84C',
                  lineHeight: '1',
                  marginBottom: '8px',
                }}>
                  2023–2026
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#666',
                }}>
                  Active Years
                </div>
              </div>
              <div className="tr-stat-item">
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  fontWeight: '600',
                  color: '#C9A84C',
                  lineHeight: '1',
                  marginBottom: '8px',
                }}>
                  UT · AZ · TX
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#666',
                }}>
                  States
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RESIDENTIAL SOLD GRID ── */}
        <section style={{
          maxWidth: '1340px',
          margin: '0 auto',
          padding: 'clamp(60px, 8vw, 100px) clamp(24px, 4vw, 60px)',
        }}>

          {/* Section heading */}
          <div style={{ marginBottom: '48px' }}>
            <div className="section-label" style={{ marginBottom: '12px' }}>Residential Sales</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: '400',
              color: '#F5F3EE',
              lineHeight: '1.1',
              marginBottom: '0',
            }}>
              Residential Track Record
            </h2>
            <div style={{
              width: '48px', height: '2px',
              background: 'linear-gradient(90deg, #C9A84C, transparent)',
              marginTop: '16px',
            }}/>
          </div>

          <div className="tr-res-grid">
            {RESIDENTIAL.map((prop, i) => {
              const isFeatured = prop.highlight
              return (
                <div
                  key={prop.address}
                  className={`tr-card-hover${isFeatured ? ' tr-res-featured' : ''}`}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    background: 'linear-gradient(145deg, #111 0%, #161616 100%)',
                    border: `1px solid ${isFeatured ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isFeatured ? '0 8px 40px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.4)',
                    minHeight: isFeatured ? '360px' : '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: isFeatured ? '32px 36px' : '26px 28px',
                  }}
                >
                  {/* Architectural pattern */}
                  <ArchPattern seed={i} />

                  {/* Gold corner accent for featured */}
                  {isFeatured && (
                    <div aria-hidden="true" style={{
                      position: 'absolute', top: 0, right: 0,
                      width: '160px', height: '160px',
                      background: 'radial-gradient(circle at top right, rgba(201,168,76,0.12), transparent 70%)',
                    }}/>
                  )}

                  {/* Top row: SOLD badge + type + featured label */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      background: '#C9A84C',
                      color: '#0A0A0A',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      padding: '5px 12px',
                      borderRadius: '4px',
                    }}>
                      SOLD
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      {isFeatured && (
                        <div style={{
                          background: 'rgba(201,168,76,0.1)',
                          border: '1px solid rgba(201,168,76,0.3)',
                          color: '#C9A84C',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '9px',
                          fontWeight: '700',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          borderRadius: '4px',
                        }}>
                          Featured Sale
                        </div>
                      )}
                      <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: '#666',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        Residential
                      </div>
                    </div>
                  </div>

                  {/* Middle: Address */}
                  <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 0 16px' }}>
                    <div style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: isFeatured ? 'clamp(22px, 2.5vw, 30px)' : 'clamp(18px, 1.8vw, 22px)',
                      fontWeight: '500',
                      color: '#F5F3EE',
                      lineHeight: '1.2',
                      marginBottom: '6px',
                    }}>
                      {prop.address}
                    </div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      color: '#666',
                      letterSpacing: '0.05em',
                    }}>
                      {prop.city}
                    </div>
                  </div>

                  {/* Bottom row: Price + Date */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1,
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div>
                      <div style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: isFeatured ? 'clamp(28px, 3vw, 40px)' : 'clamp(22px, 2.5vw, 30px)',
                        fontWeight: '600',
                        color: '#C9A84C',
                        lineHeight: '1',
                        letterSpacing: '-0.01em',
                      }}>
                        {prop.price !== null ? formatPrice(prop.price) : 'Price Withheld'}
                      </div>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '10px',
                        color: '#555',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginTop: '4px',
                      }}>
                        Sale Price
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      color: '#555',
                      textAlign: 'right',
                    }}>
                      {prop.date}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div style={{
          maxWidth: '1340px', margin: '0 auto',
          padding: '0 clamp(24px, 4vw, 60px)',
        }}>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }}/>
        </div>

        {/* ── COMMERCIAL SECTION ── */}
        <section style={{
          maxWidth: '1340px',
          margin: '0 auto',
          padding: 'clamp(60px, 8vw, 100px) clamp(24px, 4vw, 60px)',
        }}>

          <div style={{ marginBottom: '48px' }}>
            <div className="section-label" style={{ marginBottom: '12px' }}>Beyond Residential</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: '400',
              color: '#F5F3EE',
              lineHeight: '1.1',
            }}>
              Commercial Track Record
            </h2>
            <div style={{
              width: '48px', height: '2px',
              background: 'linear-gradient(90deg, #C9A84C, transparent)',
              marginTop: '16px',
            }}/>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.8',
              maxWidth: '500px',
              marginTop: '20px',
            }}>
              Office condos, NNN investments, and retail strips — Gurpreet brings institutional-level deal expertise to every commercial transaction.
            </p>
          </div>

          <div className="tr-comm-grid">
            {COMMERCIAL.map((prop, i) => {
              const isFeatured = prop.highlight
              const typeColor = prop.type.includes('NNN') ? '#B8956A' :
                prop.type.includes('Office') ? '#7A9BAF' :
                prop.type.includes('Strip') || prop.type.includes('Retail') ? '#8FAF7A' : '#C9A84C'
              return (
                <div
                  key={prop.address}
                  className="tr-card-hover"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    background: 'linear-gradient(145deg, #0e0e0e 0%, #141414 100%)',
                    border: `1px solid ${isFeatured ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                    padding: '28px 32px',
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <ArchPattern seed={i + 10} />

                  {/* Left accent bar */}
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '3px',
                    background: `linear-gradient(to bottom, ${typeColor}, transparent)`,
                    borderRadius: '0 2px 2px 0',
                  }}/>

                  {/* Top: SOLD + type tags */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      background: '#C9A84C',
                      color: '#0A0A0A',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '10px',
                      fontWeight: '800',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      padding: '5px 12px',
                      borderRadius: '4px',
                    }}>
                      SOLD
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid rgba(${typeColor === '#C9A84C' ? '201,168,76' : '255,255,255'},0.12)`,
                      color: typeColor,
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.1em',
                      padding: '4px 10px',
                      borderRadius: '4px',
                    }}>
                      {prop.type.replace('Commercial — ', '')}
                    </div>
                  </div>

                  {/* Middle: Address */}
                  <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 0 14px' }}>
                    <div style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 'clamp(20px, 2vw, 26px)',
                      fontWeight: '500',
                      color: '#F5F3EE',
                      lineHeight: '1.2',
                      marginBottom: '6px',
                    }}>
                      {prop.address}
                    </div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      color: '#666',
                      letterSpacing: '0.05em',
                      marginBottom: '14px',
                    }}>
                      {prop.city}
                    </div>
                    {prop.note && (
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '12px',
                        color: '#888',
                        lineHeight: '1.7',
                        background: 'rgba(255,255,255,0.03)',
                        borderLeft: `2px solid ${typeColor}33`,
                        padding: '8px 12px',
                        borderRadius: '0 6px 6px 0',
                      }}>
                        {prop.note}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Price withheld + Date */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1,
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#555',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
                          <line x1="6" y1="4" x2="6" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="8" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        Price Withheld
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      color: '#555',
                    }}>
                      {prop.date}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── SOCIAL PROOF STRIP ── */}
        <section style={{
          background: '#080808',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          padding: 'clamp(40px, 5vw, 64px) clamp(24px, 4vw, 60px)',
        }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', gap: '32px',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {[
              { icon: '⚖️', text: 'Licensed Utah REALTOR®' },
              { icon: '🏛️', text: 'USMC Veteran — Mission-Driven' },
              { icon: '🏙️', text: 'Residential + Commercial' },
              { icon: '🗺️', text: 'Utah · Arizona · Texas' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: '#888',
                letterSpacing: '0.05em',
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#0A0A0A',
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
          textAlign: 'center',
        }}>
          {/* Gold radial glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px', height: '400px',
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}/>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>

            <div className="section-label" style={{ marginBottom: '20px' }}>
              Let&apos;s Make It Happen
            </div>

            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: '400',
              color: '#F5F3EE',
              lineHeight: '1.05',
              marginBottom: '8px',
            }}>
              Ready to be the next
            </h2>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: '700',
              color: '#C9A84C',
              lineHeight: '1.05',
              fontStyle: 'italic',
              marginBottom: '28px',
            }}>
              success story?
            </h2>

            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              color: '#666',
              lineHeight: '1.8',
              marginBottom: '48px',
              maxWidth: '460px',
              margin: '0 auto 48px',
            }}>
              Whether you&apos;re selling a home or acquiring a commercial asset, Gurpreet brings military precision and real estate expertise to every closing.
            </p>

            <div className="tr-cta-row" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/sell" className="tr-cta-btn-primary">
                Sell Your Home
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="tel:8016358462" className="tr-cta-btn-ghost">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M13.5 10.5v2a1 1 0 01-1.09.99 15.36 15.36 0 01-6.69-2.38 15.13 15.13 0 01-4.65-4.65 15.36 15.36 0 01-2.38-6.72A1 1 0 011.69 1h2a1 1 0 011 .86 10.43 10.43 0 00.57 2.28 1 1 0 01-.22 1.05L3.91 6.31a12.1 12.1 0 004.65 4.65l1.12-1.12a1 1 0 011.05-.22 10.43 10.43 0 002.28.57 1 1 0 01.49 1.31z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                Call 801-635-8462
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
