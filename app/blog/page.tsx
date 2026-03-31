import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BLOG_POSTS } from '@/lib/blog-posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Utah Real Estate Blog | Market Updates & Guides | GSB Realtor',
  description: 'Utah real estate market updates, buyer guides, investor analysis, and neighborhood spotlights from Gurpreet Bhatti, Utah REALTOR® and USMC Veteran.',
}

const TAG_COLORS: Record<string, string> = {
  'Market Update':     '#2563EB',
  'Commercial':        '#7C3AED',
  'Buyer Guide':       '#059669',
  'Neighborhood Guide':'#D97706',
  'Investor Guide':    '#DC2626',
}

export default function BlogIndexPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(60px, 7vw, 96px) 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{
              fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '20px',
            }}>
              Utah Real Estate · Insights
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: '300', color: '#F5F3EE', lineHeight: '1.0',
              marginBottom: '16px',
            }}>
              The GSB Realtor Blog
            </h1>
            <p style={{
              fontSize: '16px', color: '#888', lineHeight: '1.8',
              maxWidth: '560px', margin: '0 auto',
            }}>
              Market updates, buyer and seller guides, neighborhood spotlights, and
              investor analysis from Gurpreet Bhatti — Utah REALTOR® and USMC Veteran.
            </p>
          </div>
        </section>

        {/* Blog grid */}
        <section style={{ padding: '72px 32px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {BLOG_POSTS.map(post => (
                <article key={post.slug} style={{
                  display: 'flex', flexDirection: 'column',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                className="blog-card"
                >
                  {/* Color bar */}
                  <div style={{
                    height: '3px',
                    background: TAG_COLORS[post.tag] || '#C9A84C',
                  }} />

                  <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Tag + date */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      marginBottom: '16px',
                    }}>
                      <span style={{
                        fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: TAG_COLORS[post.tag] || '#C9A84C',
                        background: `${TAG_COLORS[post.tag] || '#C9A84C'}18`,
                        padding: '3px 10px', borderRadius: '100px',
                        border: `1px solid ${TAG_COLORS[post.tag] || '#C9A84C'}30`,
                      }}>
                        {post.tag}
                      </span>
                      <time dateTime={post.dateISO} style={{ fontSize: '12px', color: '#555' }}>
                        {post.date}
                      </time>
                    </div>

                    {/* Title */}
                    <h2 style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '20px', fontWeight: '600',
                      color: '#F5F3EE', lineHeight: '1.3',
                      marginBottom: '12px',
                    }}>
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p style={{
                      fontSize: '14px', color: '#777', lineHeight: '1.7',
                      marginBottom: '24px', flex: 1,
                    }}>
                      {post.excerpt}
                    </p>

                    {/* CTA */}
                    <Link href={`/blog/${post.slug}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '13px', color: '#C9A84C',
                      textDecoration: 'none', fontWeight: '500',
                    }}>
                      Read Article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: '72px 32px',
          background: '#0D0D0D',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{
              fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '16px',
            }}>
              Have Questions?
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: '300', color: '#F5F3EE', lineHeight: '1.1',
              marginBottom: '20px',
            }}>
              Talk to Gurpreet Directly
            </h2>
            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '36px' }}>
              Every article is based on real Utah market experience. If you have questions
              about the current market, a specific neighborhood, or a commercial deal —
              Gurpreet gives straight answers, not sales pitches.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="tel:8016358462" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                letterSpacing: '0.04em',
              }}>
                📞 Call 801.635.8462
              </a>
              <Link href="/contact" style={{
                display: 'inline-block',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Send a Message
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />

      <style>{`
        .blog-card:hover {
          border-color: rgba(201,168,76,0.25) !important;
          background: rgba(201,168,76,0.03) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  )
}
