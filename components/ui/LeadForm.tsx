'use client'

import { useState } from 'react'

interface LeadFormProps {
  leadType?: string
  propertyId?: string
  propertyAddress?: string
  title?: string
  subtitle?: string
  compact?: boolean
  source?: string
}

export default function LeadForm({
  leadType = 'contact_form',
  propertyId,
  propertyAddress,
  title = "Let's Talk",
  subtitle = "Gurpreet responds fast — usually within minutes.",
  compact = false,
}: LeadFormProps) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          lead_type: leadType,
          property_id: propertyId,
          property_address: propertyAddress,
          source: 'website',
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        textAlign: 'center',
        padding: compact ? '24px' : '48px 32px',
        background: 'rgba(201, 168, 76, 0.05)',
        border: '1px solid rgba(201, 168, 76, 0.2)',
        borderRadius: '16px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '24px',
          color: '#F5F3EE',
          marginBottom: '8px',
        }}>
          Got it — thank you!
        </div>
        <p style={{ color: '#888', fontSize: '14px' }}>
          Gurpreet will reach out shortly. You can also call or text directly at{' '}
          <a href="tel:8016358462" style={{ color: '#C9A84C' }}>801.635.8462</a>
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(22, 22, 22, 0.8)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: compact ? '24px' : '40px',
    }}>
      {!compact && (
        <div style={{ marginBottom: '28px' }}>
          <div className="section-label" style={{ marginBottom: '8px' }}>Get in Touch</div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '28px',
            color: '#F5F3EE',
            marginBottom: '8px',
          }}>
            {title}
          </div>
          <p style={{ fontSize: '14px', color: '#888' }}>{subtitle}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
              First Name *
            </label>
            <input
              className="input-field"
              type="text"
              required
              placeholder="Gurpreet"
              value={form.first_name}
              onChange={e => setForm({ ...form, first_name: e.target.value })}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
              Last Name *
            </label>
            <input
              className="input-field"
              type="text"
              required
              placeholder="Bhatti"
              value={form.last_name}
              onChange={e => setForm({ ...form, last_name: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
            Email *
          </label>
          <input
            className="input-field"
            type="email"
            required
            placeholder="your@email.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
            Phone
          </label>
          <input
            className="input-field"
            type="tel"
            placeholder="801-000-0000"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        {/* Message */}
        {!compact && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
              Message
            </label>
            <textarea
              className="input-field"
              rows={4}
              placeholder={propertyAddress
                ? `I'm interested in ${propertyAddress}...`
                : "Tell Gurpreet what you're looking for..."
              }
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              style={{ resize: 'vertical' }}
            />
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '13px',
            color: '#ef4444',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-gold"
          style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>

        <p style={{ fontSize: '11px', color: '#444', textAlign: 'center', marginTop: '12px' }}>
          Or call/text directly:{' '}
          <a href="tel:8016358462" style={{ color: '#C9A84C' }}>801.635.8462</a>
        </p>
      </form>
    </div>
  )
}
