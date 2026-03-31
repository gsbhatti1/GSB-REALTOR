import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getBlogPost, getAllSlugs, BLOG_POSTS } from '@/lib/blog-posts'
import type { Metadata } from 'next'

type Params = { slug: string }

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} | GSB Realtor Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | GSB Realtor`,
      description: post.excerpt,
    },
  }
}

const TAG_COLORS: Record<string, string> = {
  'Market Update':      '#2563EB',
  'Commercial':         '#7C3AED',
  'Buyer Guide':        '#059669',
  'Neighborhood Guide': '#D97706',
  'Investor Guide':     '#DC2626',
}

// Render plain text content with basic markdown-like formatting
function renderContent(content: string) {
  const paragraphs = content.split('\n\n')
  return paragraphs.map((para, i) => {
    const trimmed = para.trim()
    if (!trimmed) return null

    // H2 headings
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(22px, 2.5vw, 30px)',
          fontWeight: '600', color: '#F5F3EE',
          marginTop: '48px', marginBottom: '16px',
          lineHeight: '1.2',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}>
          {trimmed.replace('## ', '')}
        </h2>
      )
    }

    // Main title (single #)
    if (trimmed.startsWith('# ')) {
      return null // Title rendered separately
    }

    // Bullet lists
    if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter(l => l.startsWith('- '))
      return (
        <ul key={i} style={{ margin: '16px 0', paddingLeft: '20px' }}>
          {items.map((item, j) => (
            <li key={j} style={{
              fontSize: '16px', color: '#888', lineHeight: '1.8',
              marginBottom: '6px', listStyleType: 'disc',
            }}>
              {renderInline(item.replace('- ', ''))}
            </li>
          ))}
        </ul>
      )
    }

    // Numbered lists (1. 2. 3.)
    if (/^\d+\./.test(trimmed)) {
      const items = trimmed.split('\n').filter(l => /^\d+\./.test(l))
      return (
        <ol key={i} style={{ margin: '16px 0', paddingLeft: '20px' }}>
          {items.map((item, j) => (
            <li key={j} style={{
              fontSize: '16px', color: '#888', lineHeight: '1.8',
              marginBottom: '6px',
            }}>
              {renderInline(item.replace(/^\d+\.\s*/, ''))}
            </li>
          ))}
        </ol>
      )
    }

    // FAQ Q: / A: patterns (treated as paragraph pairs inside FAQ section)
    if (trimmed.startsWith('**Q:') || trimmed.startsWith('**A:')) {
      const isQ = trimmed.startsWith('**Q:')
      return (
        <div key={i} style={{ marginBottom: '4px' }}>
          <p style={{
            fontSize: '15px',
            color: isQ ? '#F5F3EE' : '#888',
            lineHeight: '1.8',
            fontWeight: isQ ? '600' : '400',
            margin: '0',
          }}>
            {renderInline(trimmed)}
          </p>
        </div>
      )
    }

    // Regular paragraph
    return (
      <p key={i} style={{
        fontSize: '16px', color: '#888', lineHeight: '1.9',
        marginBottom: '20px',
      }}>
        {renderInline(trimmed)}
      </p>
    )
  })
}

// Handle inline bold (**text**) and links [text](url)
function renderInline(text: string): React.ReactNode {
  // Split on **bold** patterns and [link](url) patterns
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Check for bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Check for link
    const linkMatch = remaining.match(/\[(.+?)\]\((https?:\/\/.+?)\)/)

    const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity
    const linkIdx = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity

    if (boldIdx === Infinity && linkIdx === Infinity) {
      parts.push(remaining)
      break
    }

    if (boldIdx <= linkIdx && boldMatch) {
      if (boldIdx > 0) parts.push(remaining.slice(0, boldIdx))
      parts.push(<strong key={key++} style={{ color: '#F5F3EE', fontWeight: '600' }}>{boldMatch[1]}</strong>)
      remaining = remaining.slice(boldIdx + boldMatch[0].length)
    } else if (linkMatch) {
      if (linkIdx > 0) parts.push(remaining.slice(0, linkIdx))
      parts.push(
        <a key={key++} href={linkMatch[2]} style={{ color: '#C9A84C', textDecoration: 'none' }}>
          {linkMatch[1]}
        </a>
      )
      remaining = remaining.slice(linkIdx + linkMatch[0].length)
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}

export default function BlogPostPage({ params }: { params: Params }) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  // Related posts (exclude current)
  const related = BLOG_POSTS.filter(p => p.slug !== params.slug).slice(0, 3)

  // Split content to separate FAQ section
  const contentParts = post.content.split('---')
  const mainContent = contentParts[0] || post.content
  const faqContent = contentParts[1] || ''

  return (
    <>
      <Navbar />
      <style>{`
        @media (max-width: 480px) {
          .blog-post-content p { font-size: 15px !important; line-height: 1.8 !important; }
          .blog-post-content li { font-size: 15px !important; }
          .blog-post-faq { padding: 20px !important; }
          .blog-post-cta { padding: 24px !important; }
          .blog-related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(48px, 6vw, 80px) 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{
              marginBottom: '28px', fontSize: '13px', color: '#555',
              display: 'flex', gap: '8px', alignItems: 'center',
            }}>
              <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/blog" style={{ color: '#555', textDecoration: 'none' }}>Blog</Link>
              <span>/</span>
              <span style={{ color: '#888' }}>{post.tag}</span>
            </div>

            {/* Tag + date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{
                fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: TAG_COLORS[post.tag] || '#C9A84C',
                background: `${TAG_COLORS[post.tag] || '#C9A84C'}18`,
                padding: '4px 12px', borderRadius: '100px',
                border: `1px solid ${TAG_COLORS[post.tag] || '#C9A84C'}30`,
              }}>
                {post.tag}
              </span>
              <time dateTime={post.dateISO} style={{ fontSize: '13px', color: '#555' }}>
                {post.date}
              </time>
            </div>

            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: '400', color: '#F5F3EE', lineHeight: '1.1',
              marginBottom: '24px',
            }}>
              {post.title}
            </h1>
            <p style={{
              fontSize: '17px', color: '#888', lineHeight: '1.8',
              maxWidth: '680px',
            }}>
              {post.excerpt}
            </p>
          </div>
        </section>

        {/* Article body */}
        <section style={{ padding: '64px 32px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Author byline */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              marginBottom: '48px', paddingBottom: '32px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(201,168,76,0.15)',
                border: '2px solid rgba(201,168,76,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cormorant Garamond, serif', fontSize: '18px',
                color: '#C9A84C', fontWeight: '600', flexShrink: 0,
              }}>
                GB
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#F5F3EE', marginBottom: '2px' }}>
                  Gurpreet Bhatti
                </div>
                <div style={{ fontSize: '12px', color: '#555' }}>
                  Utah REALTOR® · USMC Veteran · UT Lic# 12907042-SA00
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="blog-post-content" style={{ lineHeight: '1.8' }}>
              {renderContent(mainContent)}
            </div>

            {/* FAQ section */}
            {faqContent.trim() && (
              <div className="blog-post-faq" style={{
                marginTop: '56px',
                padding: '32px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '12px',
              }}>
                <div style={{
                  fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em',
                  textTransform: 'uppercase', marginBottom: '8px',
                }}>
                  Frequently Asked Questions
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '26px', fontWeight: '600',
                  color: '#F5F3EE', marginBottom: '28px',
                }}>
                  Common Questions
                </h2>
                <div style={{ lineHeight: '1.8' }}>
                  {renderContent(faqContent)}
                </div>
              </div>
            )}

            {/* CTA block */}
            <div className="blog-post-cta" style={{
              marginTop: '56px',
              padding: '40px',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em',
                textTransform: 'uppercase', marginBottom: '12px',
              }}>
                Ready to Take the Next Step?
              </div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(22px, 2.5vw, 30px)',
                fontWeight: '400', color: '#F5F3EE',
                marginBottom: '16px', lineHeight: '1.2',
              }}>
                Talk to Gurpreet — Utah&apos;s Commercial & Residential Expert
              </h3>
              <p style={{ fontSize: '15px', color: '#888', marginBottom: '28px', lineHeight: '1.7' }}>
                Licensed in UT, NV, and WY. Call or text anytime. Gurpreet responds fast.
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
                <a href="https://gsbrealtor.com" style={{
                  display: 'inline-block',
                  background: 'transparent',
                  color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                  padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}>
                  Visit gsbrealtor.com
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section style={{
            padding: '64px 32px',
            background: '#0D0D0D',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ marginBottom: '36px' }}>
                <div style={{
                  fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
                  textTransform: 'uppercase', marginBottom: '8px',
                }}>
                  More from the Blog
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(22px, 2.5vw, 32px)',
                  fontWeight: '400', color: '#F5F3EE',
                }}>
                  Related Articles
                </h2>
              </div>
              <div className="blog-related-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {related.map(relPost => (
                  <Link key={relPost.slug} href={`/blog/${relPost.slug}`} style={{ textDecoration: 'none' }}>
                    <article style={{
                      padding: '24px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      height: '100%',
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px',
                      }}>
                        <span style={{
                          fontSize: '10px', color: TAG_COLORS[relPost.tag] || '#C9A84C',
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                          {relPost.tag}
                        </span>
                        <span style={{ fontSize: '11px', color: '#555' }}>{relPost.date}</span>
                      </div>
                      <h3 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '17px', fontWeight: '600',
                        color: '#F5F3EE', lineHeight: '1.3', marginBottom: '10px',
                      }}>
                        {relPost.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                        {relPost.excerpt.slice(0, 120)}...
                      </p>
                    </article>
                  </Link>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '36px' }}>
                <Link href="/blog" style={{
                  display: 'inline-block',
                  padding: '12px 28px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px', fontSize: '14px',
                  color: 'rgba(245,243,238,0.7)', textDecoration: 'none',
                }}>
                  ← All Articles
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}
