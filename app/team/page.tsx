import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Team | GSB Realtor — Utah Real Estate Experts',
  description: 'Meet the GSB Realtor team — led by Gurpreet Bhatti, USMC Veteran and Utah REALTOR®. Residential, commercial, and investment specialists serving all of Utah.',
}

const TEAM = [
  {
    name: 'Gurpreet Bhatti',
    title: 'Founder & Lead REALTOR®',
    role: 'Residential · Commercial · Investment',
    bio: 'USMC Veteran and Utah REALTOR® with licenses in UT, NV & WY. Commercial specialist: NNN leases, tenant placement, strip malls. 15+ years turning real estate goals into reality.',
    photo: '/images/gurpreet-headshot.jpg',
    license: 'UT #12907042-SA00 | NV #S.0201351 | WY #RE-17041',
    phone: '801-635-8462',
    email: 'gsbhatti1@gmail.com',
    specialties: ['NNN Leases', 'Commercial', 'Residential', 'Investment', 'Veteran Buyer Specialist'],
    badge: '⭐ Founder',
    badgeColor: '#C9A84C',
  },
  {
    name: 'Matthew Dulle',
    title: 'Broker',
    role: 'Brokerage Oversight · Compliance',
    bio: 'Managing Broker overseeing all GSB Realtor transactions. Decades of Utah real estate experience ensuring every deal closes smoothly, professionally, and in full compliance.',
    photo: null, // Real photo coming
    license: 'Broker License',
    phone: '801-635-8462',
    email: 'matt@gsbrealtor.com',
    specialties: ['Brokerage Management', 'Compliance', 'Transaction Oversight', 'Contract Review'],
    badge: '🏛️ Broker',
    badgeColor: '#6B7280',
  },
  {
    name: 'Sofia Reyes',
    title: 'REALTOR® — Residential Specialist',
    role: 'Buyer Representation · First-Time Buyers',
    bio: 'Dedicated to helping first-time buyers navigate the Utah market with confidence. Fluent in the nuances of Salt Lake Valley neighborhoods — from Herriman to Sandy.',
    photo: '/images/team/agent-sofia.jpg',
    license: 'UT License',
    phone: '801-635-8462',
    email: 'sofia@gsbrealtor.com',
    specialties: ['First-Time Buyers', 'Buyer Representation', 'Sandy', 'South Jordan', 'Draper'],
    badge: '🏠 Residential',
    badgeColor: '#3B82F6',
  },
  {
    name: 'Ashley Winters',
    title: 'REALTOR® — Luxury & Relocation',
    role: 'Luxury Homes · Corporate Relocation',
    bio: 'Luxury home specialist with expertise in Utah\'s premium markets. Helps families relocating from California, Texas, and the Pacific Northwest find their perfect Utah home.',
    photo: '/images/team/agent-ashley.jpg',
    license: 'UT License',
    phone: '801-635-8462',
    email: 'ashley@gsbrealtor.com',
    specialties: ['Luxury Homes', 'Corporate Relocation', 'Draper', 'Park City', 'Silicon Slopes'],
    badge: '💎 Luxury',
    badgeColor: '#8B5CF6',
  },
  {
    name: 'Isabella Rodriguez',
    title: 'REALTOR® — Spanish Language Specialist',
    role: 'Bilingual · Hispanic Community · Investment',
    bio: 'Fluent in Spanish and deeply connected to Utah\'s Hispanic community. Specializes in helping Spanish-speaking families buy, sell, and invest in Utah real estate.',
    photo: '/images/team/agent-isabella.jpg',
    license: 'UT License',
    phone: '801-635-8462',
    email: 'isabella@gsbrealtor.com',
    specialties: ['Spanish Bilingual', 'West Valley City', 'West Jordan', 'Kearns', 'Magna'],
    badge: '🌎 Bilingual',
    badgeColor: '#10B981',
  },
  {
    name: 'Parisa Tehrani',
    title: 'REALTOR® — Commercial & Investment',
    role: 'Commercial Leasing · Investment Properties',
    bio: 'Commercial real estate specialist focused on investment-grade assets, retail leasing, and NNN properties across the Wasatch Front. Fluent in Farsi.',
    photo: '/images/team/agent-parisa.jpg',
    license: 'UT License',
    phone: '801-635-8462',
    email: 'parisa@gsbrealtor.com',
    specialties: ['Commercial Leasing', 'NNN Properties', 'Investment', 'Farsi Bilingual', 'Salt Lake County'],
    badge: '🏢 Commercial',
    badgeColor: '#F59E0B',
  },
  {
    name: 'Reza [Last Name]',
    title: 'IT Director',
    role: 'Platform Technology · Digital Infrastructure',
    bio: 'Technology director powering the GSB Realtor digital platform — from the AI-powered search engine to the automation systems that keep the platform running 24/7.',
    photo: null, // Real photo coming
    license: null,
    phone: '801-635-8462',
    email: 'reza@gsbrealtor.com',
    specialties: ['Platform Development', 'AI Integration', 'Automation', 'Data Infrastructure'],
    badge: '💻 Technology',
    badgeColor: '#06B6D4',
  },
]

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(64px, 8vw, 100px) 32px 60px',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              The Team
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.0',
              marginBottom: '24px',
            }}>
              People Behind<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>The Platform</span>
            </h1>
            <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.8', maxWidth: '560px', margin: '0 auto' }}>
              A team built for one purpose — to make Utah real estate faster, smarter,
              and more accessible for every buyer, seller, and investor in the state.
            </p>
          </div>
        </section>

        {/* Team Grid */}
        <section style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '32px',
          }}>
            {TEAM.map((member) => (
              <div key={member.name} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.3)'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              }}>

                {/* Photo */}
                <div style={{ position: 'relative', height: '320px', background: '#111' }}>
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  ) : (
                    <div style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                    }}>
                      <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.4 }}>👤</div>
                      <div style={{ color: '#444', fontSize: '13px', textAlign: 'center', padding: '0 20px' }}>
                        Photo coming soon
                      </div>
                    </div>
                  )}
                  {/* Role badge */}
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                    border: `1px solid ${member.badgeColor}40`,
                    borderRadius: '20px', padding: '4px 12px',
                    fontSize: '11px', color: member.badgeColor, fontWeight: '600',
                    letterSpacing: '0.04em',
                  }}>
                    {member.badge}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '28px' }}>
                  <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '26px', fontWeight: '400',
                    color: '#F5F3EE', marginBottom: '4px',
                  }}>
                    {member.name}
                  </h2>
                  <div style={{ color: '#C9A84C', fontSize: '13px', fontWeight: '600', marginBottom: '4px', letterSpacing: '0.03em' }}>
                    {member.title}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.02em' }}>
                    {member.role}
                  </div>
                  <p style={{ fontSize: '13px', color: '#777', lineHeight: '1.8', marginBottom: '20px' }}>
                    {member.bio}
                  </p>

                  {/* Specialties */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {member.specialties.map(s => (
                      <span key={s} style={{
                        background: 'rgba(201,168,76,0.08)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        color: '#C9A84C', fontSize: '11px',
                        padding: '3px 10px', borderRadius: '20px',
                        letterSpacing: '0.02em',
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* License */}
                  {member.license && (
                    <div style={{ fontSize: '11px', color: '#444', marginBottom: '16px', fontFamily: 'monospace' }}>
                      {member.license}
                    </div>
                  )}

                  {/* Contact */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a href={`tel:${member.phone.replace(/-/g, '')}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: '#C9A84C', color: '#0A0A0A',
                      padding: '8px 16px', borderRadius: '8px',
                      fontSize: '12px', fontWeight: '700', textDecoration: 'none',
                    }}>
                      📞 Call
                    </a>
                    <a href={`mailto:${member.email}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#F5F3EE',
                      padding: '8px 16px', borderRadius: '8px',
                      fontSize: '12px', fontWeight: '600', textDecoration: 'none',
                    }}>
                      ✉️ Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Banner */}
        <section style={{
          padding: '80px 32px',
          background: 'linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '300', color: '#F5F3EE', marginBottom: '16px' }}>
              Built on <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Trust</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.8', marginBottom: '36px' }}>
              Every transaction handled by GSB Realtor is backed by Utah&apos;s most advanced real estate platform,
              a team of licensed specialists, and a USMC Veteran&apos;s commitment to mission.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{
                background: '#C9A84C', color: '#0A0A0A',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: '700', fontSize: '14px', textDecoration: 'none',
              }}>
                Work With Us →
              </Link>
              <Link href="/search" style={{
                border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: '600', fontSize: '14px', textDecoration: 'none',
              }}>
                Search Listings
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
