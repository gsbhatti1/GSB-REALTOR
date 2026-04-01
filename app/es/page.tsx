import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bienes Raíces en Utah | GSB Realtor — Gurpreet Bhatti',
  description: 'Compra, vende e invierte en bienes raíces en Utah con Gurpreet Bhatti, REALTOR® y Veterano del USMC. Servicio en español. Llame al 801-635-8462.',
  alternates: { canonical: 'https://gsbrealtor.com/es' },
}

async function submitSpanishLead(formData: FormData) {
  'use server'
  // Server action — saves lead via /api/leads
  const body = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    lead_type: 'contact_form',
    source: 'es-page',
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gsbrealtor.com'
  try {
    await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch { /* silent */ }
}

export default function SpanishPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}>

        {/* Language Toggle Banner */}
        <div style={{
          background: 'rgba(201,168,76,0.08)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          padding: '10px 32px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '13px', color: '#888', marginRight: '12px' }}>
            Está viendo la versión en español
          </span>
          <Link href="/" style={{
            fontSize: '13px', color: '#C9A84C',
            textDecoration: 'none', fontWeight: '600',
          }}>
            Switch to English →
          </Link>
        </div>

        {/* Hero */}
        <section style={{
          padding: 'clamp(64px, 8vw, 120px) 32px 80px',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0f0f 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>
              Bienes Raíces en Utah
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(40px, 5.5vw, 80px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}>
              Bienes Raíces en Utah
            </h1>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(40px, 5.5vw, 80px)',
              fontWeight: '600',
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #C9A84C, #E2C070, #A8863A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              marginBottom: '32px',
            }}>
              Diferente.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              color: 'rgba(245,243,238,0.65)',
              maxWidth: '500px',
              lineHeight: '1.75',
              marginBottom: '48px',
            }}>
              Veterano del Cuerpo de Marines. Especialista en propiedades comerciales y residenciales.
              El único agente en Utah que trata su inversión como una misión —
              con la disciplina para cerrarla.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}>
              <Link href="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em',
              }}>
                Buscar Casas en Utah →
              </Link>
              <a href="tel:8016358462" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Llame Ahora: 801.635.8462
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {[
                { value: '17K+', label: 'Propiedades Activas' },
                { value: 'UT · WY · NV', label: 'Licenciado en' },
                { value: '< 1 hr', label: 'Tiempo de Respuesta' },
                { value: '100%', label: 'Atención Personalizada' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '600', color: '#C9A84C', lineHeight: '1' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Gurpreet en Español */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                  Su Agente
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: '400', color: '#F5F3EE',
                  lineHeight: '1.05', marginBottom: '24px',
                }}>
                  Gurpreet Bhatti,<br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>REALTOR®</span>
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.85', marginBottom: '20px' }}>
                  Gurpreet Bhatti es un REALTOR® licenciado en Utah, Nevada y Wyoming, con especialización en
                  propiedades residenciales, comerciales e inversiones. Como veterano del Cuerpo de Marines de los
                  Estados Unidos, aporta disciplina, integridad y compromiso total a cada transacción.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.85', marginBottom: '32px' }}>
                  Ya sea que esté comprando su primera casa en Salt Lake City, vendiendo una propiedad comercial
                  en West Jordan, o buscando su próxima inversión en Utah, Gurpreet le proporciona la orientación
                  experta y el servicio personalizado que merece — sin intermediarios, sin excusas.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'Licenciado en Utah, Nevada y Wyoming',
                    'Especialista en propiedades comerciales y residenciales',
                    'Veterano del Cuerpo de Marines (USMC)',
                    'Respuesta en menos de 1 hora garantizada',
                    'Sin presión — servicio honesto siempre',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ color: '#C9A84C', fontSize: '16px' }}>✓</span>
                      <span style={{ fontSize: '14px', color: '#888' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <Image
                  src="/images/gurpreet-headshot.jpg"
                  alt="Gurpreet Bhatti — REALTOR® Utah"
                  width={280}
                  height={280}
                  style={{ borderRadius: '16px', border: '2px solid rgba(201,168,76,0.3)', objectFit: 'cover' }}
                />
                <div style={{
                  padding: '20px 24px',
                  background: 'rgba(10,10,10,0.9)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '12px',
                  textAlign: 'center', width: '100%',
                }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#F5F3EE', marginBottom: '4px' }}>
                    Gurpreet Bhatti
                  </div>
                  <div style={{ fontSize: '12px', color: '#C9A84C', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    REALTOR® · Veterano USMC
                  </div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Dynasty Point Referral Group</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>UT Lic# 12907042-SA00</div>
                  <a href="tel:8016358462" style={{
                    display: 'block', marginTop: '12px',
                    color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '20px', textDecoration: 'none',
                  }}>
                    📞 801.635.8462
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services en Español */}
        <section style={{ padding: '96px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                Nuestros Servicios
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: '400', color: '#F5F3EE',
              }}>
                ¿Cómo Podemos Ayudarle?
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              {[
                {
                  icon: '🏠',
                  title: 'Comprar',
                  body: 'Encuentre la casa perfecta en Utah. Acceso a más de 17,000 propiedades activas. Gurpreet le guía desde la búsqueda hasta el cierre, sin presiones.',
                  href: '/search',
                  cta: 'Buscar Casas →',
                },
                {
                  icon: '💰',
                  title: 'Vender',
                  body: 'Venda su propiedad al mejor precio del mercado. Valoración gratuita, marketing profesional con IA, y negociación experta en cada oferta.',
                  href: '/sell',
                  cta: 'Vender Mi Casa →',
                },
                {
                  icon: '📈',
                  title: 'Inversiones',
                  body: 'Herramientas de inversión de nivel institucional: calculadoras de cap rate, flujo de caja, y análisis de arrendamiento NNN — completamente gratis.',
                  href: '/investor',
                  cta: 'Ver Herramientas →',
                },
                {
                  icon: '🏢',
                  title: 'Comercial',
                  body: 'Centros comerciales, oficinas, locales industriales y propiedades de uso mixto en Utah. Licenciado en los tres estados del Intermountain West.',
                  href: '/commercial',
                  cta: 'Propiedades Comerciales →',
                },
              ].map(service => (
                <div key={service.title} style={{
                  padding: '36px 32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '16px',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{service.icon}</div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '26px', color: '#F5F3EE', marginBottom: '12px',
                  }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8', marginBottom: '24px', flex: 1 }}>
                    {service.body}
                  </p>
                  <Link href={service.href} style={{
                    display: 'inline-block',
                    color: '#C9A84C', textDecoration: 'none',
                    fontSize: '13px', fontWeight: '600',
                    letterSpacing: '0.04em',
                  }}>
                    {service.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA en Español */}
        <section style={{
          padding: '96px 32px',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)',
          borderTop: '1px solid rgba(201,168,76,0.12)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(201,168,76,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                  Contáctenos
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: '300', color: '#F5F3EE',
                  lineHeight: '1.05', marginBottom: '24px',
                }}>
                  ¿Listo para Empezar?<br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Hablemos.</span>
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '28px' }}>
                  Sin robots, sin asistentes, sin demoras. Cuando llame o escriba,
                  habla directamente con Gurpreet. Cada vez. Esa es la promesa.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href="tel:8016358462" style={{
                    color: '#C9A84C', textDecoration: 'none',
                    fontSize: '24px', fontFamily: 'Cormorant Garamond, serif',
                  }}>
                    📞 801.635.8462
                  </a>
                  <a href="mailto:gsbhatti1@yahoo.com" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>
                    ✉️ gsbhatti1@yahoo.com
                  </a>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    🏢 Dynasty Point Referral Group · UT Lic# 12907042-SA00
                  </div>
                </div>

                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <Link href="/" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: '#888', textDecoration: 'none', fontSize: '13px',
                  }}>
                    ← View English version
                  </Link>
                </div>
              </div>

              <div style={{
                padding: '40px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: '16px',
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '4px' }}>
                    Envíe un Mensaje
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666' }}>Gurpreet responde en menos de una hora.</p>
                </div>
                <form action={submitSpanishLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input
                      placeholder="Nombre"
                      name="firstName"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <input
                      placeholder="Apellido"
                      name="lastName"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <input
                    placeholder="Teléfono"
                    name="phone"
                    type="tel"
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <input
                    placeholder="Correo electrónico"
                    name="email"
                    type="email"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <textarea
                    placeholder="¿En qué le puedo ayudar?"
                    name="message"
                    rows={3}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                  <button
                    type="submit"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C070)', border: 'none', borderRadius: '8px', padding: '14px 28px', fontSize: '14px', fontWeight: '600', color: '#0A0A0A', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em' }}
                  >
                    Enviar Mensaje →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Ciudad links */}
        <section style={{ padding: '64px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              Servimos a Toda Utah
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {[
                'Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan',
                'Taylorsville', 'Murray', 'Draper', 'Herriman',
                'Riverton', 'Lehi', 'Provo', 'Ogden',
              ].map(city => (
                <Link
                  key={city}
                  href={`/search?city=${encodeURIComponent(city)}`}
                  style={{
                    padding: '8px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    fontSize: '13px', color: '#888',
                    textDecoration: 'none',
                  }}
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Spanish Mini-Footer */}
        <section style={{ padding: '40px 32px', background: '#080808', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Buscar</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/search" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Todas las propiedades</a>
                <a href="/sell" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Vender mi casa</a>
                <a href="/commercial" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Comercial</a>
                <a href="/investor" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Herramientas de inversión</a>
              </div>
            </div>
            <div>
              <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Contacto</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="tel:8016358462" style={{ color: '#C9A84C', fontSize: '14px', textDecoration: 'none' }}>📞 801-635-8462</a>
                <a href="/contact" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Formulario de contacto</a>
                <span style={{ color: '#555', fontSize: '12px' }}>UT Lic# 12907042-SA00</span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
