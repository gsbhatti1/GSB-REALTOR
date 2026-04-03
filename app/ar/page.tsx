import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'عقارات يوتا | GSB Realtor — Gurpreet Bhatti',
  description:
    'غوربريت باتي، وكيل عقارات مرخص في يوتا ونيفادا وايومنغ. متخصص في العقارات التجارية والسكنية. يخدم المجتمع العربي. اتصل: 801-635-8462.',
  alternates: { canonical: 'https://gsbrealtor.com/ar' },
}

async function submitArabicLead(formData: FormData) {
  'use server'
  const body = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    lead_type: 'contact_form',
    source: 'ar-page',
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

export default function ArabicPage() {
  return (
    <>
      <Navbar />
      <main
        style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}
        dir="rtl"
      >

        {/* Language Toggle Banner */}
        <div style={{
          background: 'rgba(201,168,76,0.08)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          padding: '10px 32px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '13px', color: '#888', marginLeft: '12px' }}>
            أنت تشاهد النسخة العربية
          </span>
          <Link href="/" style={{
            fontSize: '13px', color: '#C9A84C',
            textDecoration: 'none', fontWeight: '600',
          }}>
            🇺🇸 See in English →
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
          {/* Hero background photo */}
          <Image
            src="/images/gurpreet-standing.jpg"
            alt="Gurpreet Bhatti"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.18)' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: '11px', letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              عقارات يوتا
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(40px, 5.5vw, 80px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.1',
              letterSpacing: '-0.01em',
              marginBottom: '8px',
            }}>
              عقارات يوتا
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
              lineHeight: '1.1',
              letterSpacing: '-0.01em',
              marginBottom: '32px',
            }}>
              بشكل مختلف.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              color: 'rgba(245,243,238,0.65)',
              maxWidth: '600px',
              lineHeight: '1.85',
              marginBottom: '48px',
            }}>
              غوربريت باتي، وكيل عقارات مرخص في يوتا ونيفادا وايومنغ،
              ومحارب أمريكي سابق. خبير في العقارات التجارية والسكنية.
              يخدم المجتمع العربي باللغة العربية.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px', justifyContent: 'flex-end' }}>
              <Link href="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em',
              }}>
                ابحث عن منزلك ←
              </Link>
              <a href="tel:8016358462" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                اتصل الآن: 801-635-8462
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {[
                { value: '17,000+', label: 'عقار نشط' },
                { value: 'UT · NV · WY', label: 'مرخص في' },
                { value: '< ساعة', label: 'وقت الرد' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '28px', fontWeight: '600', color: '#C9A84C', lineHeight: '1',
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    fontSize: '11px', color: '#555', textTransform: 'uppercase',
                    letterSpacing: '0.08em', marginTop: '4px',
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section style={{ padding: '96px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{
                fontSize: '11px', letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px',
              }}>
                ما نقدمه
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: '400', color: '#F5F3EE',
              }}>
                خدماتنا
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              {[
                {
                  icon: '🏠',
                  title: 'شراء',
                  body: 'ابحث عن منزل أحلامك في يوتا. أكثر من 17,000 عقار نشط. غوربريت يرافقك من البحث حتى إتمام الصفقة.',
                  href: '/search',
                  cta: 'ابحث عن عقار ←',
                },
                {
                  icon: '💰',
                  title: 'بيع',
                  body: 'بع عقارك بأفضل سعر في السوق. تقييم مجاني، تسويق احترافي، وتفاوض متمرس في كل عرض.',
                  href: '/sell',
                  cta: 'بع عقاري ←',
                },
                {
                  icon: '📈',
                  title: 'استثمار',
                  body: 'أدوات استثمارية احترافية: حاسبة معدل الرسملة، تحليل التدفق النقدي، وتحليل عقود NNN — مجاناً.',
                  href: '/investor',
                  cta: 'اكتشف الأدوات ←',
                },
                {
                  icon: '🏢',
                  title: 'تجاري',
                  body: 'مراكز تسوق، مكاتب، مستودعات، وعقارات متعددة الاستخدامات في يوتا. مرخص في ثلاث ولايات.',
                  href: '/commercial',
                  cta: 'العقارات التجارية ←',
                },
              ].map(service => (
                <div key={service.title} style={{
                  padding: '36px 32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '16px',
                  display: 'flex', flexDirection: 'column',
                  textAlign: 'right',
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{service.icon}</div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '26px', color: '#F5F3EE', marginBottom: '12px',
                  }}>
                    {service.title}
                  </h3>
                  <p style={{
                    fontSize: '14px', color: '#777', lineHeight: '1.8',
                    marginBottom: '24px', flex: 1,
                  }}>
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

        {/* About Gurpreet */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '11px', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px',
                }}>
                  وكيلك العقاري
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: '400', color: '#F5F3EE',
                  lineHeight: '1.05', marginBottom: '24px',
                }}>
                  عن غوربريت
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.85', marginBottom: '20px' }}>
                  غوربريت باتي وكيل عقارات موثوق في يوتا. يخدم المجتمع العربي باللغة العربية.
                  متخصص في صفقات NNN والعقارات التجارية في منطقة Intermountain West.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.85', marginBottom: '32px' }}>
                  مرخص في يوتا ونيفادا وايومنغ. محارب أمريكي سابق في سلاح مشاة البحرية،
                  يجلب الانضباط والنزاهة لكل صفقة عقارية.
                  اتصل الآن: 801-635-8462
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'مرخص في يوتا ونيفادا وايومنغ',
                    'متخصص في العقارات السكنية والتجارية',
                    'محارب أمريكي سابق (USMC)',
                    'ضمان الرد خلال ساعة',
                    'خدمة بدون ضغط — بنزاهة دائمة',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '14px', color: '#888' }}>{item}</span>
                      <span style={{ color: '#C9A84C', fontSize: '16px' }}>✓</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <Image
                  src="/images/gurpreet-headshot-smile.jpg"
                  alt="Gurpreet Bhatti — REALTOR® يوتا"
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
                    REALTOR® · محارب سابق
                  </div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Dynasty Point Referral Group</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>UT Lic# 12907042-SA00</div>
                  <a href="tel:8016358462" style={{
                    display: 'block', marginTop: '12px',
                    color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '20px', textDecoration: 'none',
                  }}>
                    📞 801-635-8462
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
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
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '11px', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px',
                }}>
                  تواصل معنا
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: '300', color: '#F5F3EE',
                  lineHeight: '1.05', marginBottom: '24px',
                }}>
                  هل أنت مستعد؟<br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>لنتحدث.</span>
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '28px' }}>
                  لا روبوت، لا وسيط، لا تأخير. عندما تتصل أو ترسل رسالة،
                  تتحدث مباشرة مع غوربريت. في كل مرة. هذا وعد.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                  <a href="tel:8016358462" style={{
                    color: '#C9A84C', textDecoration: 'none',
                    fontSize: '24px', fontFamily: 'Cormorant Garamond, serif',
                  }}>
                    📞 801-635-8462
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
                    🇺🇸 See in English →
                  </Link>
                </div>
              </div>

              <div style={{
                padding: '40px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: '16px',
              }}>
                <div style={{ marginBottom: '24px', textAlign: 'right' }}>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '4px',
                  }}>
                    أرسل رسالة
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    سيرد غوربريت خلال ساعة واحدة.
                  </p>
                </div>
                <form action={submitArabicLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input
                      placeholder="الاسم الأول"
                      name="firstName"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', textAlign: 'right' }}
                    />
                    <input
                      placeholder="اسم العائلة"
                      name="lastName"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', textAlign: 'right' }}
                    />
                  </div>
                  <input
                    placeholder="رقم الهاتف"
                    name="phone"
                    type="tel"
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', textAlign: 'right' }}
                  />
                  <input
                    placeholder="البريد الإلكتروني"
                    name="email"
                    type="email"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', textAlign: 'right' }}
                  />
                  <textarea
                    placeholder="كيف يمكنني مساعدتك؟"
                    name="message"
                    rows={3}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', textAlign: 'right' }}
                  />
                  <button
                    type="submit"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C070)', border: 'none', borderRadius: '8px', padding: '14px 28px', fontSize: '14px', fontWeight: '600', color: '#0A0A0A', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em' }}
                  >
                    إرسال الرسالة ←
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Cities */}
        <section style={{ padding: '64px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              fontSize: '11px', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px',
            }}>
              نخدم كامل يوتا — مدن المجتمع العربي
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {[
                'Millcreek', 'Taylorsville', 'Murray', 'Salt Lake City',
                'West Jordan', 'Sandy', 'South Jordan', 'West Valley City',
                'Kearns', 'Draper', 'Herriman', 'Riverton',
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

        {/* Mini Footer */}
        <section style={{ padding: '40px 32px', background: '#080808', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>بحث</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <a href="/search" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>جميع العقارات</a>
                <a href="/sell" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>بيع عقار</a>
                <a href="/commercial" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>عقارات تجارية</a>
                <a href="/investor" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>أدوات الاستثمار</a>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>اتصل بنا</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <a href="tel:8016358462" style={{ color: '#C9A84C', fontSize: '14px', textDecoration: 'none' }}>📞 801-635-8462</a>
                <a href="/contact" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>نموذج الاتصال</a>
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
