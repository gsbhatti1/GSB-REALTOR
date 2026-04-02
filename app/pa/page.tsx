import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ਯੂਟਾਹ ਰੀਅਲ ਐਸਟੇਟ | GSB Realtor — ਗੁਰਪ੍ਰੀਤ ਭੱਟੀ',
  description:
    'ਗੁਰਪ੍ਰੀਤ ਭੱਟੀ ਨਾਲ ਯੂਟਾਹ, ਨੇਵਾਡਾ ਅਤੇ ਵਾਇਓਮਿੰਗ ਵਿੱਚ ਘਰ ਖਰੀਦੋ ਜਾਂ ਵੇਚੋ। REALTOR® ਅਤੇ ਅਮਰੀਕੀ ਮਰੀਨ ਦਿੱਗਜ। ਹੁਣੇ ਕਾਲ ਕਰੋ: 801-635-8462',
  alternates: { canonical: 'https://gsbrealtor.com/pa' },
}

async function submitPunjabiLead(formData: FormData) {
  'use server'
  const body = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    lead_type: 'contact_form',
    source: 'pa-page',
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gsbrealtor.com'
  try {
    await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    /* silent */
  }
}

export default function PunjabiPage() {
  return (
    <>
      <Navbar />
      <main
        style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}
      >
        {/* Language Toggle Banner */}
        <div
          style={{
            background: 'rgba(201,168,76,0.08)',
            borderBottom: '1px solid rgba(201,168,76,0.15)',
            padding: '10px 32px',
            textAlign: 'center',
          }}
        >
          <span
            style={{ fontSize: '13px', color: '#888', marginRight: '12px' }}
          >
            ਤੁਸੀਂ ਪੰਜਾਬੀ ਸੰਸਕਰਣ ਦੇਖ ਰਹੇ ਹੋ
          </span>
          <Link
            href="/"
            style={{
              fontSize: '13px',
              color: '#C9A84C',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            🇺🇸 English ਵਿੱਚ ਦੇਖੋ →
          </Link>
        </div>

        {/* Hero */}
        <section
          style={{
            padding: 'clamp(64px, 8vw, 120px) 32px 80px',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0f0f 100%)',
            borderBottom: '1px solid rgba(201,168,76,0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                marginBottom: '24px',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              ਯੂਟਾਹ ਰੀਅਲ ਐਸਟੇਟ
            </div>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(36px, 5.5vw, 76px)',
                fontWeight: '300',
                color: '#F5F3EE',
                lineHeight: '1.05',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              ਯੂਟਾਹ ਵਿੱਚ ਰੀਅਲ ਐਸਟੇਟ
            </h1>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(36px, 5.5vw, 76px)',
                fontWeight: '600',
                fontStyle: 'italic',
                background:
                  'linear-gradient(135deg, #C9A84C, #E2C070, #A8863A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.05',
                letterSpacing: '-0.02em',
                marginBottom: '32px',
              }}
            >
              ਵੱਖਰੇ ਢੰਗ ਨਾਲ।
            </h2>
            <p
              style={{
                fontSize: 'clamp(15px, 1.6vw, 18px)',
                color: 'rgba(245,243,238,0.65)',
                maxWidth: '560px',
                lineHeight: '1.85',
                marginBottom: '48px',
              }}
            >
              ਗੁਰਪ੍ਰੀਤ ਭੱਟੀ, ਯੂਟਾਹ, ਨੇਵਾਡਾ ਅਤੇ ਵਾਇਓਮਿੰਗ ਵਿੱਚ ਲਾਇਸੰਸਸ਼ੁਦਾ
              REALTOR® ਅਤੇ ਅਮਰੀਕੀ ਮਰੀਨ ਦਿੱਗਜ। ਪੰਜਾਬੀ ਭਾਈਚਾਰੇ ਦੀ ਸੇਵਾ
              ਵਿੱਚ ਸਮਰਪਿਤ।
            </p>

            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '56px',
              }}
            >
              <Link
                href="/search"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                  color: '#0A0A0A',
                  fontWeight: '600',
                  fontSize: '14px',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                ਘਰ ਲੱਭੋ →
              </Link>
              <a
                href="tel:8016358462"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: 'rgba(245,243,238,0.8)',
                  fontSize: '14px',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                ਹੁਣੇ ਕਾਲ ਕਰੋ: 801-635-8462
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {[
                { value: '17K+', label: 'ਐਕਟਿਵ ਪ੍ਰਾਪਰਟੀਆਂ' },
                { value: 'UT · WY · NV', label: 'ਲਾਇਸੰਸ ਰਾਜ' },
                { value: '< 1 hr', label: 'ਜਵਾਬ ਦਾ ਸਮਾਂ' },
                { value: '100%', label: 'ਨਿੱਜੀ ਸੇਵਾ' },
              ].map(s => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#C9A84C',
                      lineHeight: '1',
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#555',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginTop: '4px',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '64px',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#C9A84C',
                    marginBottom: '16px',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  ਮੇਰੇ ਬਾਰੇ
                </div>
                <h2
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(32px, 4vw, 52px)',
                    fontWeight: '400',
                    color: '#F5F3EE',
                    lineHeight: '1.05',
                    marginBottom: '24px',
                  }}
                >
                  ਗੁਰਪ੍ਰੀਤ ਭੱਟੀ,
                  <br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>
                    REALTOR®
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#888',
                    lineHeight: '1.9',
                    marginBottom: '20px',
                  }}
                >
                  ਗੁਰਪ੍ਰੀਤ ਭੱਟੀ ਯੂਟਾਹ ਵਿੱਚ ਇੱਕ ਭਰੋਸੇਮੰਦ REALTOR® ਹਨ। ਉਹ
                  ਪੰਜਾਬੀ ਭਾਈਚਾਰੇ ਦੀ ਸੇਵਾ ਕਰਦੇ ਹਨ ਅਤੇ ਹਰ ਮੁਲਾਕਾਤ ਵਿੱਚ
                  ਇਮਾਨਦਾਰੀ ਅਤੇ ਅਨੁਸ਼ਾਸਨ ਲਿਆਉਂਦੇ ਹਨ। ਅਮਰੀਕੀ ਮਰੀਨ ਕੋਰ ਦੇ
                  ਦਿੱਗਜ ਵਜੋਂ, ਉਹ ਹਰ ਸੌਦੇ ਨੂੰ ਇੱਕ ਮਿਸ਼ਨ ਵਾਂਗ ਸੰਭਾਲਦੇ ਹਨ।
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#888',
                    lineHeight: '1.9',
                    marginBottom: '32px',
                  }}
                >
                  ਚਾਹੇ ਤੁਸੀਂ ਪਹਿਲੀ ਵਾਰ ਘਰ ਖਰੀਦ ਰਹੇ ਹੋ, ਵੇਚ ਰਹੇ ਹੋ, ਜਾਂ
                  ਨਿਵੇਸ਼ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ — ਗੁਰਪ੍ਰੀਤ ਤੁਹਾਡੇ ਨਾਲ ਕਦਮ-ਕਦਮ
                  ਚੱਲਦੇ ਹਨ। 801-635-8462 ਤੇ ਕਾਲ ਕਰੋ।
                </p>

                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  {[
                    'ਯੂਟਾਹ, ਨੇਵਾਡਾ ਅਤੇ ਵਾਇਓਮਿੰਗ ਵਿੱਚ ਲਾਇਸੰਸਸ਼ੁਦਾ',
                    'ਰਿਹਾਇਸ਼ੀ ਅਤੇ ਵਪਾਰਕ ਰੀਅਲ ਐਸਟੇਟ ਮਾਹਿਰ',
                    'ਅਮਰੀਕੀ ਮਰੀਨ ਕੋਰ ਦਿੱਗਜ (USMC)',
                    '1 ਘੰਟੇ ਵਿੱਚ ਜਵਾਬ ਦੀ ਗਾਰੰਟੀ',
                    'ਪੰਜਾਬੀ ਵਿੱਚ ਸੇਵਾ ਉਪਲਬਧ',
                  ].map(item => (
                    <div
                      key={item}
                      style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                    >
                      <span style={{ color: '#C9A84C', fontSize: '16px', marginTop: '2px' }}>
                        ✓
                      </span>
                      <span style={{ fontSize: '14px', color: '#888' }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <Image
                  src="/images/gurpreet-headshot-smile.jpg"
                  alt="ਗੁਰਪ੍ਰੀਤ ਭੱਟੀ — REALTOR® ਯੂਟਾਹ"
                  width={280}
                  height={280}
                  style={{
                    borderRadius: '16px',
                    border: '2px solid rgba(201,168,76,0.3)',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(10,10,10,0.9)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '18px',
                      color: '#F5F3EE',
                      marginBottom: '4px',
                    }}
                  >
                    ਗੁਰਪ੍ਰੀਤ ਭੱਟੀ
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#C9A84C',
                      letterSpacing: '0.08em',
                      marginBottom: '8px',
                    }}
                  >
                    REALTOR® · USMC Veteran
                  </div>
                  <div style={{ fontSize: '11px', color: '#555' }}>
                    Dynasty Point Referral Group
                  </div>
                  <div style={{ fontSize: '11px', color: '#555' }}>
                    UT Lic# 12907042-SA00
                  </div>
                  <a
                    href="tel:8016358462"
                    style={{
                      display: 'block',
                      marginTop: '12px',
                      color: '#C9A84C',
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '20px',
                      textDecoration: 'none',
                    }}
                  >
                    📞 801.635.8462
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section style={{ padding: '96px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  marginBottom: '16px',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                ਸਾਡੀਆਂ ਸੇਵਾਵਾਂ
              </div>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(28px, 3.5vw, 48px)',
                  fontWeight: '400',
                  color: '#F5F3EE',
                }}
              >
                ਅਸੀਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
              }}
            >
              {[
                {
                  icon: '🏠',
                  title: 'ਖਰੀਦੋ',
                  body: 'ਯੂਟਾਹ ਵਿੱਚ ਆਪਣਾ ਸੁਪਨਿਆਂ ਦਾ ਘਰ ਲੱਭੋ। 17,000 ਤੋਂ ਵੱਧ ਐਕਟਿਵ ਪ੍ਰਾਪਰਟੀਆਂ ਤੱਕ ਪਹੁੰਚ। ਗੁਰਪ੍ਰੀਤ ਖੋਜ ਤੋਂ ਲੈ ਕੇ ਕਲੋਜ਼ਿੰਗ ਤੱਕ ਮਾਰਗਦਰਸ਼ਨ ਕਰਦੇ ਹਨ।',
                  href: '/search',
                  cta: 'ਘਰ ਲੱਭੋ →',
                },
                {
                  icon: '💰',
                  title: 'ਵੇਚੋ',
                  body: 'ਆਪਣੀ ਪ੍ਰਾਪਰਟੀ ਸਭ ਤੋਂ ਵਧੀਆ ਕੀਮਤ ਤੇ ਵੇਚੋ। ਮੁਫ਼ਤ ਮੁਲਾਂਕਣ, ਪੇਸ਼ੇਵਰ ਮਾਰਕੀਟਿੰਗ ਅਤੇ ਮਾਹਿਰ ਗੱਲਬਾਤ।',
                  href: '/sell',
                  cta: 'ਘਰ ਵੇਚੋ →',
                },
                {
                  icon: '📈',
                  title: 'ਨਿਵੇਸ਼',
                  body: 'ਕੈਪ ਰੇਟ ਕੈਲਕੁਲੇਟਰ, ਕੈਸ਼ ਫਲੋ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ NNN ਲੀਜ਼ ਵਿਸ਼ਲੇਸ਼ਣ — ਸਭ ਮੁਫ਼ਤ। ਨਿਵੇਸ਼ ਦੇ ਮੌਕੇ ਲੱਭੋ।',
                  href: '/investor',
                  cta: 'ਟੂਲਜ਼ ਦੇਖੋ →',
                },
                {
                  icon: '🏢',
                  title: 'ਵਪਾਰਕ',
                  body: 'ਦੁਕਾਨਾਂ, ਦਫ਼ਤਰ, ਉਦਯੋਗਿਕ ਅਤੇ ਮਿਕਸਡ-ਯੂਜ਼ ਪ੍ਰਾਪਰਟੀਆਂ। ਤਿੰਨ ਰਾਜਾਂ ਵਿੱਚ ਲਾਇਸੰਸਸ਼ੁਦਾ।',
                  href: '/commercial',
                  cta: 'ਵਪਾਰਕ ਪ੍ਰਾਪਰਟੀਆਂ →',
                },
              ].map(service => (
                <div
                  key={service.title}
                  style={{
                    padding: '36px 32px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(201,168,76,0.1)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>
                    {service.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '26px',
                      color: '#F5F3EE',
                      marginBottom: '12px',
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#777',
                      lineHeight: '1.8',
                      marginBottom: '24px',
                      flex: 1,
                    }}
                  >
                    {service.body}
                  </p>
                  <Link
                    href={service.href}
                    style={{
                      display: 'inline-block',
                      color: '#C9A84C',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      letterSpacing: '0.04em',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {service.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section
          style={{
            padding: '96px 32px',
            background:
              'linear-gradient(135deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)',
            borderTop: '1px solid rgba(201,168,76,0.12)',
            borderBottom: '1px solid rgba(201,168,76,0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(rgba(201,168,76,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '64px',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#C9A84C',
                    marginBottom: '16px',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  ਸੰਪਰਕ ਕਰੋ
                </div>
                <h2
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(32px, 4vw, 52px)',
                    fontWeight: '300',
                    color: '#F5F3EE',
                    lineHeight: '1.05',
                    marginBottom: '24px',
                  }}
                >
                  ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?
                  <br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>
                    ਗੱਲ ਕਰੀਏ।
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#888',
                    lineHeight: '1.8',
                    marginBottom: '28px',
                  }}
                >
                  ਕੋਈ ਰੋਬੋਟ ਨਹੀਂ, ਕੋਈ ਸਹਾਇਕ ਨਹੀਂ। ਜਦੋਂ ਤੁਸੀਂ ਕਾਲ ਕਰਦੇ
                  ਹੋ, ਸਿੱਧਾ ਗੁਰਪ੍ਰੀਤ ਨਾਲ ਗੱਲਬਾਤ ਹੁੰਦੀ ਹੈ। ਹਰ ਵਾਰ।
                </p>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <a
                    href="tel:8016358462"
                    style={{
                      color: '#C9A84C',
                      textDecoration: 'none',
                      fontSize: '24px',
                      fontFamily: 'Cormorant Garamond, serif',
                    }}
                  >
                    📞 801.635.8462
                  </a>
                  <a
                    href="mailto:gsbhatti1@yahoo.com"
                    style={{
                      color: '#888',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    ✉️ gsbhatti1@yahoo.com
                  </a>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    🏢 Dynasty Point Referral Group · UT Lic# 12907042-SA00
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <Link
                    href="/"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#888',
                      textDecoration: 'none',
                      fontSize: '13px',
                    }}
                  >
                    🇺🇸 ← English ਵਿੱਚ ਦੇਖੋ
                  </Link>
                </div>
              </div>

              <div
                style={{
                  padding: '40px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: '16px',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h3
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '28px',
                      fontWeight: '400',
                      color: '#F5F3EE',
                      marginBottom: '4px',
                    }}
                  >
                    ਸੁਨੇਹਾ ਭੇਜੋ
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    ਗੁਰਪ੍ਰੀਤ ਇੱਕ ਘੰਟੇ ਵਿੱਚ ਜਵਾਬ ਦਿੰਦੇ ਹਨ।
                  </p>
                </div>
                <form
                  action={submitPunjabiLead}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <input
                      placeholder="ਨਾਮ"
                      name="firstName"
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '14px',
                        color: '#F5F3EE',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                    <input
                      placeholder="ਉਪਨਾਮ"
                      name="lastName"
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '14px',
                        color: '#F5F3EE',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <input
                    placeholder="ਫ਼ੋਨ ਨੰਬਰ"
                    name="phone"
                    type="tel"
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: '#F5F3EE',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                  <input
                    placeholder="ਈਮੇਲ"
                    name="email"
                    type="email"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: '#F5F3EE',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                  <textarea
                    placeholder="ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?"
                    name="message"
                    rows={3}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: '#F5F3EE',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px 28px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#0A0A0A',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ਸੁਨੇਹਾ ਭੇਜੋ →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* City Links */}
        <section style={{ padding: '64px 32px', background: '#0A0A0A' }}>
          <div
            style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}
          >
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                marginBottom: '20px',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              ਅਸੀਂ ਪੂਰੇ ਯੂਟਾਹ ਵਿੱਚ ਸੇਵਾ ਕਰਦੇ ਹਾਂ
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              {[
                'Salt Lake City',
                'West Jordan',
                'Sandy',
                'South Jordan',
                'Taylorsville',
                'Murray',
                'Draper',
                'Herriman',
                'Riverton',
                'Lehi',
                'Provo',
                'Ogden',
              ].map(city => (
                <Link
                  key={city}
                  href={`/search?city=${encodeURIComponent(city)}`}
                  style={{
                    padding: '8px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: '#888',
                    textDecoration: 'none',
                  }}
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
