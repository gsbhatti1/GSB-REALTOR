import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bất Động Sản Utah | GSB Realtor — Gurpreet Bhatti',
  description:
    'Gurpreet Bhatti, Môi Giới Bất Động Sản được cấp phép tại Utah, Nevada và Wyoming. Cựu chiến binh Thủy Quân Lục Chiến Hoa Kỳ. Gọi ngay: 801-635-8462.',
  alternates: { canonical: 'https://gsbrealtor.com/vi' },
}

async function submitVietnameseLead(formData: FormData) {
  'use server'
  const body = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    lead_type: 'contact_form',
    source: 'vi-page',
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

export default function VietnamesePage() {
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
            Bạn đang xem phiên bản tiếng Việt
          </span>
          <Link href="/" style={{
            fontSize: '13px', color: '#C9A84C',
            textDecoration: 'none', fontWeight: '600',
          }}>
            🇺🇸 Xem bằng tiếng Anh →
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
            <div style={{
              fontSize: '11px', letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Bất Động Sản Utah
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
              Bất Động Sản Utah
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
              Khác Biệt.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              color: 'rgba(245,243,238,0.65)',
              maxWidth: '560px',
              lineHeight: '1.75',
              marginBottom: '48px',
            }}>
              Gurpreet Bhatti, Môi Giới Bất Động Sản được cấp phép tại Utah,
              Nevada và Wyoming. Cựu chiến binh Thủy Quân Lục Chiến Hoa Kỳ.
              Chuyên gia về nhà ở và bất động sản thương mại.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}>
              <Link href="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em',
              }}>
                Tìm Nhà Ngay →
              </Link>
              <a href="tel:8016358462" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Gọi Ngay: 801-635-8462
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {[
                { value: '17,000+', label: 'Căn Nhà Đang Bán' },
                { value: 'UT · NV · WY', label: 'Phục Vụ 3 Tiểu Bang' },
                { value: '< 1 Giờ', label: 'Thời Gian Phản Hồi' },
              ].map(s => (
                <div key={s.label}>
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
                Những Gì Chúng Tôi Cung Cấp
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: '400', color: '#F5F3EE',
              }}>
                Dịch Vụ Của Chúng Tôi
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              {[
                {
                  icon: '🏠',
                  title: 'Mua Nhà',
                  body: 'Tìm ngôi nhà mơ ước của bạn tại Utah. Hơn 17,000 căn nhà đang bán. Gurpreet đồng hành cùng bạn từ tìm kiếm đến ký hợp đồng.',
                  href: '/search',
                  cta: 'Tìm Kiếm Nhà →',
                },
                {
                  icon: '💰',
                  title: 'Bán Nhà',
                  body: 'Bán nhà của bạn với giá tốt nhất thị trường. Định giá miễn phí, tiếp thị chuyên nghiệp và đàm phán từng đề nghị.',
                  href: '/sell',
                  cta: 'Bán Nhà Của Tôi →',
                },
                {
                  icon: '📈',
                  title: 'Đầu Tư',
                  body: 'Công cụ đầu tư chuyên nghiệp: máy tính cap rate, phân tích dòng tiền và phân tích hợp đồng NNN — hoàn toàn miễn phí.',
                  href: '/investor',
                  cta: 'Xem Công Cụ →',
                },
                {
                  icon: '🏢',
                  title: 'Thương Mại',
                  body: 'Trung tâm mua sắm, văn phòng, kho xưởng và bất động sản đa năng tại Utah. Được cấp phép tại ba tiểu bang.',
                  href: '/commercial',
                  cta: 'Bất Động Sản Thương Mại →',
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
              <div>
                <div style={{
                  fontSize: '11px', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px',
                }}>
                  Môi Giới Của Bạn
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: '400', color: '#F5F3EE',
                  lineHeight: '1.05', marginBottom: '24px',
                }}>
                  Về Gurpreet
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.85', marginBottom: '20px' }}>
                  Gurpreet Bhatti là Môi Giới Bất Động Sản được cấp phép tại Utah, Nevada và Wyoming,
                  chuyên về nhà ở, bất động sản thương mại và đầu tư.
                  Là cựu chiến binh Thủy Quân Lục Chiến Hoa Kỳ, ông mang đến sự kỷ luật,
                  trung thực và cam kết trong từng giao dịch.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.85', marginBottom: '32px' }}>
                  Dù bạn đang mua ngôi nhà đầu tiên ở West Valley City, bán nhà ở Taylorsville,
                  hay tìm kiếm cơ hội đầu tư tại Utah — Gurpreet sẽ hướng dẫn bạn
                  với dịch vụ chuyên nghiệp và cá nhân hóa. Không trung gian, không lý do.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'Được cấp phép tại Utah, Nevada và Wyoming',
                    'Chuyên gia nhà ở và thương mại',
                    'Cựu chiến binh Thủy Quân Lục Chiến Hoa Kỳ (USMC)',
                    'Đảm bảo phản hồi trong 1 giờ',
                    'Không áp lực — luôn trung thực',
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
                  src="/images/gurpreet-headshot-smile.jpg"
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
                    REALTOR® · Cựu Chiến Binh
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
              <div>
                <div style={{
                  fontSize: '11px', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px',
                }}>
                  Liên Hệ
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: '300', color: '#F5F3EE',
                  lineHeight: '1.05', marginBottom: '24px',
                }}>
                  Sẵn Sàng Chưa?<br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Hãy Nói Chuyện.</span>
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '28px' }}>
                  Không robot, không trợ lý, không chậm trễ. Khi bạn gọi hoặc nhắn tin,
                  bạn nói chuyện trực tiếp với Gurpreet. Mọi lúc. Đây là cam kết.
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
                    🇺🇸 Xem bằng tiếng Anh →
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
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '4px',
                  }}>
                    Gửi Tin Nhắn
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666' }}>Gurpreet sẽ phản hồi trong vòng một giờ.</p>
                </div>
                <form action={submitVietnameseLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input
                      placeholder="Tên"
                      name="firstName"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <input
                      placeholder="Họ"
                      name="lastName"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <input
                    placeholder="Số điện thoại"
                    name="phone"
                    type="tel"
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <input
                    placeholder="Email"
                    name="email"
                    type="email"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <textarea
                    placeholder="Tôi có thể giúp gì cho bạn?"
                    name="message"
                    rows={3}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                  <button
                    type="submit"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C070)', border: 'none', borderRadius: '8px', padding: '14px 28px', fontSize: '14px', fontWeight: '600', color: '#0A0A0A', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em' }}
                  >
                    Gửi Tin Nhắn →
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
              Phục Vụ Toàn Utah — Cộng Đồng Việt Nam
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {[
                'West Valley City', 'Taylorsville', 'Kearns', 'Murray',
                'Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan',
                'Millcreek', 'Herriman', 'Riverton', 'Draper',
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
            <div>
              <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Tìm Kiếm</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/search" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Tất Cả Bất Động Sản</a>
                <a href="/sell" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Bán Nhà</a>
                <a href="/commercial" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Thương Mại</a>
                <a href="/investor" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Công Cụ Đầu Tư</a>
              </div>
            </div>
            <div>
              <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Liên Hệ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="tel:8016358462" style={{ color: '#C9A84C', fontSize: '14px', textDecoration: 'none' }}>📞 801-635-8462</a>
                <a href="/contact" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>Biểu Mẫu Liên Hệ</a>
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
