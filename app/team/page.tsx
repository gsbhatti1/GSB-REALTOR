'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const HUMANS = [
  {
    name: 'Gurpreet Bhatti',
    title: 'Founder & Lead REALTOR®',
    dept: 'Leadership',
    bio: 'USMC Veteran, licensed REALTOR® in UT, NV & WY. Built GSB Realtor from the ground up into a full AI-powered real estate platform. Residential, commercial, and investment specialist.',
    photo: '/images/gurpreet-headshot.jpg',
    tags: ['Founder', 'REALTOR®', 'USMC Veteran', 'Commercial', 'UT · NV · WY'],
    badge: '⭐',
    badgeLabel: 'Founder',
    badgeColor: '#C9A84C',
    phone: '801-635-8462',
  },
  {
    name: 'Matthew Dulle',
    title: 'Managing Broker',
    dept: 'Brokerage',
    bio: 'Managing Broker ensuring every GSB Realtor transaction is handled with full compliance, professionalism, and precision. The backbone of the brokerage operation.',
    photo: null,
    tags: ['Managing Broker', 'Compliance', 'Transaction Oversight', 'Brokerage'],
    badge: '🏛️',
    badgeLabel: 'Broker',
    badgeColor: '#6B7280',
    phone: '801-635-8462',
  },
  {
    name: 'Reza',
    title: 'IT Director',
    dept: 'Technology',
    bio: 'Leads the technology infrastructure behind the GSB Realtor platform — servers, databases, API integrations, security, and the automation systems that run 24/7.',
    photo: null,
    tags: ['IT Director', 'Infrastructure', 'Security', 'APIs', 'Automation'],
    badge: '💻',
    badgeLabel: 'Technology',
    badgeColor: '#06B6D4',
    phone: '801-635-8462',
  },
  {
    name: 'Sofia Reyes',
    title: 'AI Systems Manager',
    dept: 'Operations',
    bio: 'Manages all n8n automation workflows — lead routing, video generation pipelines, email sequences, and the Telegram reporting system. Keeps the AI agents running smoothly.',
    photo: '/images/team/agent-sofia.jpg',
    tags: ['n8n Workflows', 'AI Pipelines', 'Automation', 'Lead Routing', 'Operations'],
    badge: '🤖',
    badgeLabel: 'AI Ops',
    badgeColor: '#8B5CF6',
    phone: '801-635-8462',
  },
  {
    name: 'Ashley Winters',
    title: 'Platform Operations Manager',
    dept: 'Operations',
    bio: 'Oversees day-to-day platform operations — monitoring deployments, coordinating with the tech team, managing the MLS data feeds, and ensuring uptime across all systems.',
    photo: '/images/team/agent-ashley.jpg',
    tags: ['Platform Operations', 'MLS Data', 'Deployment', 'Vercel', 'Monitoring'],
    badge: '⚙️',
    badgeLabel: 'Operations',
    badgeColor: '#3B82F6',
    phone: '801-635-8462',
  },
  {
    name: 'Isabella Rodriguez',
    title: 'Digital Marketing Manager',
    dept: 'Marketing',
    bio: 'Manages social media strategy, content calendar, SEO campaigns, and the daily automated content across Instagram, TikTok, X, Facebook, and YouTube. Spanish-language community outreach lead.',
    photo: '/images/team/agent-isabella.jpg',
    tags: ['Social Media', 'SEO', 'Spanish Outreach', 'Content Strategy', 'YouTube'],
    badge: '📱',
    badgeLabel: 'Marketing',
    badgeColor: '#10B981',
    phone: '801-635-8462',
  },
  {
    name: 'Parisa Tehrani',
    title: 'Data & Analytics Lead',
    dept: 'Analytics',
    bio: 'Manages market data analysis, lead scoring systems, MLS data pipelines, and the business intelligence dashboards that track platform performance across all channels.',
    photo: '/images/team/agent-parisa.jpg',
    tags: ['Data Analytics', 'Lead Scoring', 'MLS Intelligence', 'Reporting', 'Farsi'],
    badge: '📊',
    badgeLabel: 'Analytics',
    badgeColor: '#F59E0B',
    phone: '801-635-8462',
  },
]

const AI_AGENTS = [
  {
    name: 'Lead Qualifier',
    icon: '🎯',
    status: 'Active',
    description: 'Qualifies every website visitor in real time — asks budget, city, timeline. Scores leads HOT/WARM/COLD and notifies Gurpreet instantly via Telegram.',
    platform: 'n8n + Groq AI',
    runs: '24/7',
  },
  {
    name: 'Video Generator',
    icon: '🎬',
    status: 'Active',
    description: 'Receives listing data, writes a professional property tour script, and generates a Gurpreet AI avatar video via HeyGen in ~90 seconds.',
    platform: 'n8n + HeyGen',
    runs: 'On demand',
  },
  {
    name: 'YouTube Publisher',
    icon: '▶️',
    status: 'Active',
    description: 'Takes completed HeyGen videos and automatically uploads them to @GSBRealtorUtah with optimized title, description, tags, and public settings.',
    platform: 'n8n + YouTube API',
    runs: 'On demand',
  },
  {
    name: 'Daily Lead Report',
    icon: '📋',
    status: 'Active',
    description: "Runs every morning at 5:30 AM MT. Pulls yesterday's leads from Supabase and sends a full summary to Telegram — names, phones, sources, hot prospects.",
    platform: 'Vercel Cron',
    runs: 'Daily 5:30 AM',
  },
  {
    name: 'Site Health Monitor',
    icon: '🏥',
    status: 'Active',
    description: 'Checks all 11 critical pages and APIs every morning at 6:00 AM MT. Sends a green/red status report to Telegram with response times for every endpoint.',
    platform: 'Vercel Cron',
    runs: 'Daily 6:00 AM',
  },
  {
    name: 'Social Content Agent',
    icon: '📱',
    status: 'Active',
    description: 'Generates platform-specific social posts every morning at 7:00 AM MT for Facebook, Instagram, X, TikTok, and LinkedIn — ready to copy-paste.',
    platform: 'Vercel Cron + Groq',
    runs: 'Daily 7:00 AM',
  },
  {
    name: 'Property Search Agent',
    icon: '🔍',
    status: 'Active',
    description: 'Parses natural language queries like "3-bed homes in West Jordan under $450K" and returns live WFRMLS listings in real time directly inside the chat.',
    platform: 'Groq + WFRMLS',
    runs: 'On demand',
  },
  {
    name: 'Email Drip Agent',
    icon: '✉️',
    status: 'Active',
    description: 'Manages 14-day automated follow-up sequences for every new lead. Sends Day 1, Day 3, Day 7, and Day 14 emails with market updates and CTAs.',
    platform: 'Vercel + Resend',
    runs: 'Scheduled',
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
              lineHeight: '1.05',
              marginBottom: '24px',
            }}>
              Humans + AI<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Working Together</span>
            </h1>
            <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.8', maxWidth: '540px', margin: '0 auto' }}>
              A small human team backed by 8 AI agents running 24/7.
              This is how one agent competes with a 50-person brokerage.
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.01)',
        }}>
          {[
            { label: 'Team Members', value: '7' },
            { label: 'AI Agents Running', value: '8' },
            { label: 'Hours Active Per Day', value: '24' },
            { label: 'Live MLS Listings', value: '17K+' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '24px 48px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', color: '#C9A84C', fontWeight: '300' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Human Team */}
        <section style={{ padding: '80px 32px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
              Human Team
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '300', color: '#F5F3EE' }}>
              The People Behind the Platform
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '28px',
          }}>
            {HUMANS.map((member) => (
              <div key={member.name} className="team-card" style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                {/* Photo */}
                <div style={{ position: 'relative', height: '280px', background: '#111' }}>
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  ) : (
                    <div style={{
                      height: '100%', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                    }}>
                      <div style={{ fontSize: '56px', marginBottom: '12px', opacity: 0.3 }}>👤</div>
                      <div style={{ color: '#333', fontSize: '12px' }}>Photo coming soon</div>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: '14px', left: '14px',
                    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                    borderRadius: '20px', padding: '4px 12px',
                    fontSize: '11px', color: member.badgeColor, fontWeight: '600',
                    border: `1px solid ${member.badgeColor}40`,
                    letterSpacing: '0.04em',
                  }}>
                    {member.badge} {member.badgeLabel}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
                    {member.dept}
                  </div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '22px', fontWeight: '400',
                    color: '#F5F3EE', marginBottom: '4px',
                  }}>
                    {member.name}
                  </h3>
                  <div style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '600', marginBottom: '12px', letterSpacing: '0.03em' }}>
                    {member.title}
                  </div>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '16px' }}>
                    {member.bio}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                    {member.tags.map(tag => (
                      <span key={tag} style={{
                        background: 'rgba(201,168,76,0.07)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        color: '#888', fontSize: '10px',
                        padding: '3px 8px', borderRadius: '20px',
                      }}>{tag}</span>
                    ))}
                  </div>
                  <a href={`tel:${member.phone.replace(/-/g, '')}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: '#C9A84C', color: '#0A0A0A',
                    padding: '8px 16px', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '700', textDecoration: 'none',
                  }}>
                    📞 {member.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Agents */}
        <section style={{
          padding: '80px 32px',
          background: 'rgba(201,168,76,0.02)',
          borderTop: '1px solid rgba(201,168,76,0.08)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '48px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
                AI Automation
              </div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '300', color: '#F5F3EE', marginBottom: '12px' }}>
                Our AI Agents
              </h2>
              <p style={{ fontSize: '15px', color: '#666', maxWidth: '500px', lineHeight: '1.7' }}>
                8 autonomous agents handling lead qualification, video production, social media, reporting, and more — running while the team sleeps.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {AI_AGENTS.map((agent) => (
                <div key={agent.name} className="agent-card" style={{
                  padding: '28px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px', flexShrink: 0,
                    }}>
                      {agent.icon}
                    </div>
                    <div>
                      <div style={{ color: '#F5F3EE', fontWeight: '600', fontSize: '15px' }}>{agent.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                        <span style={{ fontSize: '11px', color: '#10B981' }}>{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '16px' }}>
                    {agent.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
                      color: '#06B6D4', fontSize: '10px', padding: '3px 8px', borderRadius: '20px',
                    }}>
                      {agent.platform}
                    </span>
                    <span style={{ fontSize: '11px', color: '#444' }}>{agent.runs}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ padding: '80px 32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '300', color: '#F5F3EE', marginBottom: '16px' }}>
              Ready to Work With<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>The Full Team?</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px', lineHeight: '1.7' }}>
              One call reaches the whole operation — human expertise backed by AI that never sleeps.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:8016358462" style={{
                background: '#C9A84C', color: '#0A0A0A',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: '700', fontSize: '14px', textDecoration: 'none',
              }}>
                📞 Call 801-635-8462
              </a>
              <Link href="/contact" style={{
                border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
                padding: '14px 32px', borderRadius: '8px',
                fontWeight: '600', fontSize: '14px', textDecoration: 'none',
              }}>
                Send a Message
              </Link>
            </div>
          </div>
        </section>

      </main>

      <style>{`
        .team-card { transition: border-color 0.3s, transform 0.3s; }
        .team-card:hover { border-color: rgba(201,168,76,0.3) !important; transform: translateY(-4px); }
        .agent-card { transition: border-color 0.3s, transform 0.3s; }
        .agent-card:hover { border-color: rgba(6,182,212,0.3) !important; transform: translateY(-2px); }
      `}</style>

      <Footer />
    </>
  )
}
