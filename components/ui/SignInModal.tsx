'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  message?: string
}

export default function SignInModal({ isOpen, onClose, onSuccess, message }: Props) {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  if (!isOpen) return null

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#F5F3EE',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: tab,
          email: form.email,
          password: form.password,
          name: form.name,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      if (tab === 'login') {
        if (data.session) {
          localStorage.setItem('gsb_session', JSON.stringify(data.session))
          localStorage.setItem('gsb_user', JSON.stringify(data.user))
        }
        onSuccess?.()
        onClose()
      } else {
        setSuccess('Account created! You can now sign in.')
        setTab('login')
        setForm(f => ({ ...f, password: '' }))
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}
    >
      <div style={{
        background: '#161616', border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '420px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', color: '#888', fontSize: '20px',
            cursor: 'pointer', lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '24px',
            fontWeight: '300', color: '#F5F3EE', marginBottom: '8px',
          }}>
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          {message && (
            <p style={{ color: '#C9A84C', fontSize: '13px', lineHeight: '1.5' }}>
              {message}
            </p>
          )}
        </div>

        {/* Tab toggle */}
        <div style={{
          display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '10px',
          padding: '4px', marginBottom: '24px',
        }}>
          {(['login', 'signup'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSuccess('') }}
              style={{
                flex: 1,
                background: tab === t ? 'rgba(201,168,76,0.12)' : 'transparent',
                border: tab === t ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                borderRadius: '8px', padding: '10px',
                color: tab === t ? '#C9A84C' : '#666',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Google SSO */}
        <button
          type="button"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
            padding: '12px', color: '#888', fontSize: '14px',
            cursor: 'not-allowed', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '20px', opacity: 0.6,
          }}
          title="Coming soon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google (coming soon)
        </button>

        {/* Apple SSO placeholder */}
        <button
          type="button"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
            padding: '12px', color: '#888', fontSize: '14px',
            cursor: 'not-allowed', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '20px', opacity: 0.6,
          }}
          title="Coming soon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#888">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Continue with Apple (coming soon)
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ color: '#444', fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Email *
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              minLength={tab === 'signup' ? 8 : undefined}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              color: '#e55', fontSize: '13px', padding: '10px 14px',
              background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)',
              borderRadius: '8px',
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              color: '#4caf8a', fontSize: '13px', padding: '10px 14px',
              background: 'rgba(76,175,138,0.08)', border: '1px solid rgba(76,175,138,0.2)',
              borderRadius: '8px',
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #C9A84C, #E2C070)',
              border: 'none', borderRadius: '10px', padding: '14px',
              fontSize: '14px', fontWeight: '600', color: '#0A0A0A',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>
      </div>
    </div>
  )
}
