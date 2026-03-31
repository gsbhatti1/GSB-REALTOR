'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const GREETING: Message = {
  role: 'assistant',
  content: "Hey — I'm Gurpreet Bhatti, Utah REALTOR® and USMC Veteran. Buying, selling, investing, or just curious about the market? I'm here 24/7.",
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      if (!open) setUnread(prev => prev + 1)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, had a connection issue. Call me directly — 801-635-8462." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Bubble button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat with Gurpreet"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(201,168,76,0.5)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(201,168,76,0.4)' }}
      >
        {open ? (
          <svg width="22" height="22" fill="none" stroke="#0A0A0A" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" stroke="#0A0A0A" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {/* Unread badge */}
        {!open && unread > 0 && (
          <div style={{
            position: 'absolute', top: '-4px', right: '-4px',
            width: '20px', height: '20px', borderRadius: '50%',
            background: '#ef4444', color: '#fff',
            fontSize: '11px', fontWeight: '700',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            {unread}
          </div>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chatbot-window" style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: 'min(400px, calc(100vw - 48px))',
          height: '520px',
          background: '#111',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'DM Sans, sans-serif',
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #1a1a1a, #111)',
            borderBottom: '1px solid rgba(201,168,76,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A84C, #A8863A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0,
            }}>
              G
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#F5F3EE', lineHeight: '1.2' }}>Gurpreet Bhatti</div>
              <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.04em' }}>REALTOR® · Usually replies instantly</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
              <span style={{ fontSize: '11px', color: '#4ade80' }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #C9A84C, #E2C070)'
                    : 'rgba(255,255,255,0.06)',
                  color: msg.role === 'user' ? '#0A0A0A' : '#F5F3EE',
                  fontSize: '14px',
                  lineHeight: '1.55',
                  fontWeight: msg.role === 'user' ? '500' : '400',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C',
                      animation: 'bounce 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 16px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                "What's my home worth?",
                "Show me homes in West Jordan",
                "How does buying work?",
                "Investment properties",
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(send, 50) }}
                  style={{
                    padding: '6px 12px', fontSize: '12px',
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '100px', color: '#C9A84C',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', gap: '8px', alignItems: 'center',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask Gurpreet anything..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                padding: '10px 14px', fontSize: '14px', color: '#F5F3EE',
                outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #C9A84C, #E2C070)' : 'rgba(255,255,255,0.06)',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s',
              }}
            >
              <svg width="16" height="16" fill="none" stroke={input.trim() && !loading ? '#0A0A0A' : '#555'} strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @media (max-width: 480px) {
          .chatbot-window { width: calc(100vw - 32px) !important; right: 16px !important; }
        }
      `}</style>
    </>
  )
}
