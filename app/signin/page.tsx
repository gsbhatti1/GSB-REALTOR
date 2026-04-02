'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '14px 16px',
  fontSize: '15px',
  color: '#F5F3EE',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

export default function SignInPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.')
        return
      }

      if (data.session) {
        localStorage.setItem('gsb_session', JSON.stringify(data.session))
        localStorage.setItem('gsb_user', JSON.stringify(data.user))
      }
      router.push('/account')
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    })
    if (oauthError) setError(oauthError.message)
  }

  async function handleApple() {
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    })
    if (oauthError) setError(oauthError.message)
  }

  return (
    <>
      <Navbar />
      <main style={{
        background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
      }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Client Portal
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '42px', fontWeight: '300',
              color: '#F5F3EE', marginBottom: '8px',
            }}>
              Welcome Back
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Sign in to your GSB Realtor account
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '20px',
            padding: '40px',
          }}>

            {/* Social sign in */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <button
                type="button"
                onClick={handleGoogle}
                style={{
                  width: '100%',
                  background: '#4285F4',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '13px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={handleApple}
                style={{
                  width: '100%',
                  background: '#000',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  padding: '13px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'border-color 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ color: '#444', fontSize: '12px' }}>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Email / password form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#777', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  Email Address
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
                <label style={{ display: 'block', fontSize: '12px', color: '#777', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {error && (
                <div style={{
                  color: '#e55', fontSize: '13px',
                  padding: '10px 14px',
                  background: 'rgba(255,80,80,0.08)',
                  border: '1px solid rgba(255,80,80,0.2)',
                  borderRadius: '8px',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #C9A84C, #E2C070)',
                  border: 'none', borderRadius: '10px',
                  padding: '14px', fontSize: '14px', fontWeight: '700',
                  color: '#0A0A0A',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', letterSpacing: '0.04em',
                  marginTop: '4px',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ color: '#555', fontSize: '13px' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: '600' }}>
                Create one →
              </Link>
            </span>
            <Link href="/" style={{ color: '#444', fontSize: '12px', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
