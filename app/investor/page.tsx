'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/ui/LeadForm'

export default function InvestorPage() {
  const [capRate, setCapRate] = useState({ price: 500000, noi: 35000 })
  const [cashFlow, setCashFlow] = useState({ price: 400000, rent: 2800, down: 20, rate: 7.0, expenses: 30 })
  const [nnn, setNnn] = useState({ sqft: 3000, rentPerSqft: 22, capRateTarget: 6.5 })

  // Cap Rate calc
  const capRateResult = capRate.noi / capRate.price * 100

  // Cash flow calc
  const loanAmount = cashFlow.price * (1 - cashFlow.down / 100)
  const monthlyRate = cashFlow.rate / 100 / 12
  const numPayments = 360
  const mortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  const grossRent = cashFlow.rent
  const expenses = grossRent * (cashFlow.expenses / 100)
  const noi = grossRent - expenses
  const monthlyCashFlow = noi - mortgage
  const annualCashFlow = monthlyCashFlow * 12
  const cashOnCash = annualCashFlow / (cashFlow.price * cashFlow.down / 100) * 100

  // NNN calc
  const annualRent = nnn.sqft * nnn.rentPerSqft
  const propertyValue = annualRent / (nnn.capRateTarget / 100)

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    padding: '12px 14px', fontSize: '14px', color: '#F5F3EE',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', color: '#555',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px',
  }
  const resultStyle: React.CSSProperties = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '36px', fontWeight: '600', color: '#C9A84C',
    marginBottom: '4px',
  }

  return (
    <>
      <Navbar />
      <style>{`
        @media (max-width: 600px) {
          .investor-cash-flow-inputs { grid-template-columns: 1fr !important; }
          .investor-cash-flow-results { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{ padding: '80px 32px', background: 'linear-gradient(180deg, #0D0D0D, #0A0A0A)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>Exclusive Tools</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '300', color: '#F5F3EE', lineHeight: '1.05', marginBottom: '24px' }}>
              Utah Investor Tools
            </h1>
            <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 0' }}>
              Free, professional-grade calculators used by serious investors.
              No other Utah realtor gives you these for free — because most don&apos;t know how to use them.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>

            {/* ── CAP RATE CALCULATOR ── */}
            <div id="cap-rate" style={{ padding: '40px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
              <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Tool 01</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '8px' }}>
                Cap Rate Calculator
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
                Capitalize on investment opportunities by calculating the rate of return on a property.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <label style={labelStyle}>Purchase Price ($)</label>
                  <input
                    type="number"
                    value={capRate.price}
                    onChange={e => setCapRate({ ...capRate, price: Number(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Annual Net Operating Income ($)</label>
                  <input
                    type="number"
                    value={capRate.noi}
                    onChange={e => setCapRate({ ...capRate, noi: Number(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ padding: '24px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Capitalization Rate</div>
                <div style={resultStyle}>{capRateResult.toFixed(2)}%</div>
                <div style={{ fontSize: '12px', color: capRateResult >= 7 ? '#4ade80' : capRateResult >= 5 ? '#C9A84C' : '#ef4444' }}>
                  {capRateResult >= 7 ? '✓ Strong return — worth considering' : capRateResult >= 5 ? '⚠ Average — negotiate the price' : '✗ Low return — run the full analysis'}
                </div>
              </div>
            </div>

            {/* ── CASH FLOW CALCULATOR ── */}
            <div id="cash-flow" style={{ padding: '40px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
              <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Tool 02</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '8px' }}>
                Cash Flow Projector
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
                See your monthly and annual cash flow after mortgage, expenses, and vacancy.
              </p>

              <div className="investor-cash-flow-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Purchase Price ($)', key: 'price', val: cashFlow.price },
                  { label: 'Monthly Rent ($)', key: 'rent', val: cashFlow.rent },
                  { label: 'Down Payment (%)', key: 'down', val: cashFlow.down },
                  { label: 'Interest Rate (%)', key: 'rate', val: cashFlow.rate },
                  { label: 'Expenses (% of rent)', key: 'expenses', val: cashFlow.expenses },
                ].map(field => (
                  <div key={field.key} style={{ gridColumn: field.key === 'expenses' ? 'span 2' : 'span 1' }}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      type="number"
                      value={field.val}
                      step={field.key === 'rate' ? '0.1' : '1'}
                      onChange={e => setCashFlow({ ...cashFlow, [field.key]: Number(e.target.value) })}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              <div style={{ padding: '20px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px' }}>
                <div className="investor-cash-flow-results" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Monthly Cash Flow</div>
                    <div style={{ ...resultStyle, fontSize: '24px', color: monthlyCashFlow >= 0 ? '#4ade80' : '#ef4444' }}>
                      ${Math.round(monthlyCashFlow).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Cash-on-Cash Return</div>
                    <div style={{ ...resultStyle, fontSize: '24px' }}>{cashOnCash.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Monthly Mortgage</div>
                    <div style={{ fontSize: '18px', color: '#F5F3EE', fontFamily: 'Cormorant Garamond, serif' }}>
                      ${Math.round(mortgage).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Annual Cash Flow</div>
                    <div style={{ fontSize: '18px', color: annualCashFlow >= 0 ? '#4ade80' : '#ef4444', fontFamily: 'Cormorant Garamond, serif' }}>
                      ${Math.round(annualCashFlow).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── NNN LEASE ANALYZER ── */}
            <div style={{ padding: '40px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
              <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Tool 03</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '8px' }}>
                NNN Lease Analyzer
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
                Calculate the value of a triple-net leased commercial property based on rent and target cap rate.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Square Footage</label>
                  <input type="number" value={nnn.sqft} onChange={e => setNnn({ ...nnn, sqft: Number(e.target.value) })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Annual Rent per Sq Ft ($)</label>
                  <input type="number" value={nnn.rentPerSqft} step="0.5" onChange={e => setNnn({ ...nnn, rentPerSqft: Number(e.target.value) })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Target Cap Rate (%)</label>
                  <input type="number" value={nnn.capRateTarget} step="0.1" onChange={e => setNnn({ ...nnn, capRateTarget: Number(e.target.value) })} style={inputStyle} />
                </div>
              </div>

              <div style={{ padding: '24px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Annual Rent Income</div>
                  <div style={{ ...resultStyle, fontSize: '24px' }}>${annualRent.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Implied Property Value</div>
                  <div style={resultStyle}>${Math.round(propertyValue).toLocaleString()}</div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#555' }}>
                  Based on {nnn.capRateTarget}% cap rate · ${nnn.rentPerSqft}/sqft/year
                </div>
              </div>
            </div>

          </div>

          {/* ── CTA: Talk to Gurpreet ── */}
          <div style={{ marginTop: '64px', padding: '48px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: '400', color: '#F5F3EE', marginBottom: '16px' }}>
              Found a Property Worth Analyzing?
            </h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              Send Gurpreet the address. He will run the full analysis — cap rate, cash flow, market comps,
              and his honest opinion — within the hour. Free, no obligation.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:8016358462" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px', textDecoration: 'none',
              }}>
                Call 801.635.8462
              </a>
              <a href="mailto:gsbhatti1@yahoo.com" style={{
                display: 'inline-block',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Email Gurpreet
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
