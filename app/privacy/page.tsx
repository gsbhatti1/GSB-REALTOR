import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | GSB Realtor',
  alternates: { canonical: 'https://gsbrealtor.com/privacy' },
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: '24px',
  fontWeight: '400',
  color: '#C9A84C',
  marginBottom: '12px',
  marginTop: '48px',
}

const bodyText: React.CSSProperties = {
  fontSize: '15px',
  color: '#999',
  lineHeight: '1.9',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px 96px' }}>

          <div className="section-label" style={{ marginBottom: '16px' }}>Legal</div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: '300',
            color: '#F5F3EE',
            lineHeight: '1.1',
            marginBottom: '16px',
          }}>
            Privacy Policy
          </h1>
          <p style={{ ...bodyText, marginBottom: '48px' }}>
            GSB Realtor (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This policy explains how we collect, use, and protect
            your personal information when you use our website and mobile application.
          </p>

          {/* 1 */}
          <h2 style={sectionTitle}>1. Information We Collect</h2>
          <p style={bodyText}>
            When you use GSB Realtor, we may collect the following information:
          </p>
          <ul style={{ ...bodyText, paddingLeft: '20px', marginTop: '8px' }}>
            <li>Name, email address, and phone number (when you submit an inquiry or create an account)</li>
            <li>Saved properties and search preferences</li>
            <li>Device information (device type, operating system, app version)</li>
            <li>General location data used to show nearby Utah properties</li>
          </ul>

          {/* 2 */}
          <h2 style={sectionTitle}>2. How We Use Your Information</h2>
          <p style={bodyText}>We use the information we collect to:</p>
          <ul style={{ ...bodyText, paddingLeft: '20px', marginTop: '8px' }}>
            <li>Respond to your property inquiries and showing requests</li>
            <li>Send listing alerts and market updates you have opted into</li>
            <li>Improve our app experience and property search features</li>
            <li>Communicate important updates about properties you have saved or expressed interest in</li>
          </ul>

          {/* 3 */}
          <h2 style={sectionTitle}>3. Information Sharing</h2>
          <p style={bodyText}>
            We never sell your personal data. Your information may be shared only with MLS (Multiple Listing Service)
            providers as necessary to fulfill property search requests. We do not share your data with third-party
            advertisers or data brokers.
          </p>

          {/* 4 */}
          <h2 style={sectionTitle}>4. Listing Alerts</h2>
          <p style={bodyText}>
            When you save a search or express interest in a property, you may be automatically enrolled in listing
            alerts for matching properties. You can unsubscribe from listing alerts at any time by emailing{' '}
            <a href="mailto:gsbhatti1@yahoo.com" style={{ color: '#C9A84C', textDecoration: 'none' }}>
              gsbhatti1@yahoo.com
            </a>{' '}
            with the subject line &quot;Unsubscribe.&quot;
          </p>

          {/* 5 */}
          <h2 style={sectionTitle}>5. Data Security</h2>
          <p style={bodyText}>
            Your data is stored securely using Supabase with encrypted storage at rest and in transit.
            We implement industry-standard security measures to protect your personal information from
            unauthorized access, alteration, or disclosure.
          </p>

          {/* 6 */}
          <h2 style={sectionTitle}>6. Contact Us</h2>
          <p style={bodyText}>
            If you have questions about this privacy policy or wish to request deletion of your data, please contact:
          </p>
          <div style={{ ...bodyText, marginTop: '12px' }}>
            <p style={{ margin: '4px 0', color: '#F5F3EE' }}>Gurpreet Bhatti</p>
            <p style={{ margin: '4px 0' }}>
              Email:{' '}
              <a href="mailto:gsbhatti1@yahoo.com" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                gsbhatti1@yahoo.com
              </a>
            </p>
            <p style={{ margin: '4px 0' }}>
              Phone:{' '}
              <a href="tel:8016358462" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                801-635-8462
              </a>
            </p>
          </div>

          {/* 7 */}
          <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Effective Date: April 1, 2026
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
