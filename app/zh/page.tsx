import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '犹他州房地产 | GSB Realtor — Gurpreet Bhatti',
  description: '在犹他州买房、卖房、投资房产，联系Gurpreet Bhatti，持牌REALTOR®及美国海军陆战队退伍军人。提供中文服务。电话：801-635-8462。',
  alternates: { canonical: 'https://gsbrealtor.com/zh' },
}

async function submitChineseLead(formData: FormData) {
  'use server'
  const body = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    lead_type: 'contact_form',
    source: 'zh-page',
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

export default function ChinesePage() {
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
            您正在查看中文版本
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
              犹他州房地产
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
              犹他州房地产
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
              与众不同。
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              color: 'rgba(245,243,238,0.65)',
              maxWidth: '560px',
              lineHeight: '1.75',
              marginBottom: '48px',
            }}>
              美国海军陆战队退伍军人。专注住宅及商业房产。
              犹他州唯一将您的投资视为使命的经纪人——
              以军人的纪律为您完成每一笔交易。
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}>
              <Link href="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em',
              }}>
                搜索犹他州房产 →
              </Link>
              <a href="tel:8016358462" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px',
                textDecoration: 'none', letterSpacing: '0.04em',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                立即致电：801.635.8462
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {[
                { value: '17K+', label: '在售房源' },
                { value: 'UT·WY·NV', label: '持牌州' },
                { value: '< 1小时', label: '响应时间' },
                { value: '100%', label: '个性化服务' },
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

        {/* 服务 */}
        <section style={{ padding: '96px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                我们的服务
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: '400', color: '#F5F3EE',
              }}>
                我能为您做什么？
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              {[
                {
                  icon: '🏠',
                  title: '购买',
                  body: '在犹他州找到理想房产。提供超过17,000套在售房源。Gurpreet从搜房到过户全程陪同，无任何压力。',
                  href: '/search',
                  cta: '搜索房产 →',
                },
                {
                  icon: '💰',
                  title: '出售',
                  body: '以市场最优价格出售您的房产。免费评估、AI专业营销，以及每次报价的专业谈判。',
                  href: '/sell',
                  cta: '出售我的房产 →',
                },
                {
                  icon: '📈',
                  title: '投资',
                  body: '机构级投资工具：资本化率计算器、现金流分析及NNN租约分析——完全免费。',
                  href: '/investor',
                  cta: '查看工具 →',
                },
                {
                  icon: '🏢',
                  title: '商业地产',
                  body: '犹他州购物中心、办公楼、工业厂房及综合用途物业。在Intermountain West三个州均持有执照。',
                  href: '/commercial',
                  cta: '商业房产 →',
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

        {/* 关于 Gurpreet */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                  您的经纪人
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: '400', color: '#F5F3EE',
                  lineHeight: '1.05', marginBottom: '24px',
                }}>
                  Gurpreet Bhatti，<br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>REALTOR®</span>
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.85', marginBottom: '20px' }}>
                  Gurpreet Bhatti 是持牌犹他州、内华达州和怀俄明州的REALTOR®，
                  专注于住宅、商业地产及投资领域。作为美国海军陆战队退伍军人，
                  他将纪律、诚信和全力以赴的精神带入每一笔房产交易。
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.85', marginBottom: '32px' }}>
                  无论是在盐湖城购买您的第一套住宅、在西乔丹出售商业地产，
                  还是寻找犹他州的下一个投资机会，Gurpreet 都将为您提供
                  专业指导和个性化服务——无中间商，无借口。
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    '持牌犹他州、内华达州和怀俄明州',
                    '住宅及商业地产专家',
                    '美国海军陆战队退伍军人（USMC）',
                    '1小时内回复保证',
                    '无压力销售——始终诚信服务',
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
                  alt="Gurpreet Bhatti — 犹他州REALTOR®"
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
                    REALTOR® · 退伍军人
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

        {/* 联系我们 */}
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
                  联系我们
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(32px, 4vw, 52px)',
                  fontWeight: '300', color: '#F5F3EE',
                  lineHeight: '1.05', marginBottom: '24px',
                }}>
                  准备好开始了吗？<br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>让我们谈谈。</span>
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '28px' }}>
                  无机器人，无助理，无延迟。当您来电或发信息时，
                  直接与Gurpreet本人交流。每一次都如此。这是承诺。
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
                    发送消息
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666' }}>Gurpreet 将在一小时内回复您。</p>
                </div>
                <form action={submitChineseLead} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input
                      placeholder="名字"
                      name="firstName"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <input
                      placeholder="姓氏"
                      name="lastName"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <input
                    placeholder="电话"
                    name="phone"
                    type="tel"
                    required
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <input
                    placeholder="电子邮件"
                    name="email"
                    type="email"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <textarea
                    placeholder="我能为您做什么？"
                    name="message"
                    rows={3}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                  <button
                    type="submit"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C070)', border: 'none', borderRadius: '8px', padding: '14px 28px', fontSize: '14px', fontWeight: '600', color: '#0A0A0A', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em' }}
                  >
                    发送消息 →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 城市列表 */}
        <section style={{ padding: '64px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              服务整个犹他州
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

        {/* 中文迷你页脚 */}
        <section style={{ padding: '40px 32px', background: '#080808', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>搜索</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/search" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>所有房产</a>
                <a href="/sell" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>出售房产</a>
                <a href="/commercial" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>商业地产</a>
                <a href="/investor" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>投资工具</a>
              </div>
            </div>
            <div>
              <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>联系方式</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="tel:8016358462" style={{ color: '#C9A84C', fontSize: '14px', textDecoration: 'none' }}>📞 801-635-8462</a>
                <a href="/contact" style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}>联系表单</a>
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
