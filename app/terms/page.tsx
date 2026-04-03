import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | GSB Realtor',
  alternates: { canonical: 'https://gsbrealtor.com/terms' },
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

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p style={{ ...bodyText, marginBottom: '48px' }}>
            By using the GSB Realtor website and mobile application, you agree to the following terms.
          </p>

          {/* 1 */}
          <h2 style={sectionTitle}>1. Use of the Application</h2>
          <p style={bodyText}>
            GSB Realtor provides real estate search tools, property listings, market data, and lead inquiry
            forms for buyers, sellers, and investors in Utah. You agree to use the app for lawful purposes only
            and not to misuse, scrape, or redistribute the content without permission.
          </p>

          {/* 2 */}
          <h2 style={sectionTitle}>2. Listing Data Accuracy</h2>
          <p style={bodyText}>
            Property listings displayed on GSB Realtor are sourced from MLS (Multiple Listing Service) data feeds.
            While we strive to keep information current, we do not guarantee the accuracy, completeness, or
            availability of any listing. Property details including price, availability, and features may change
            without notice. Always verify listing information directly before making any purchasing decisions.
          </p>

          {/* 3 */}
          <h2 style={sectionTitle}>3. User Accounts</h2>
          <p style={bodyText}>
            If you create an account, you are responsible for maintaining the confidentiality of your login
            credentials. You agree to notify us immediately of any unauthorized access to your account.
          </p>

          {/* 4 */}
          <h2 style={sectionTitle}>4. Limitation of Liability</h2>
          <p style={bodyText}>
            GSB Realtor and Gurpreet Bhatti are not liable for any damages arising from your use of the
            application, reliance on listing data, or any transaction resulting from inquiries made through
            our platform. The app is provided &quot;as is&quot; without warranties of any kind.
          </p>

          {/* 5 */}
          <h2 style={sectionTitle}>5. Dispute Resolution</h2>
          <p style={bodyText}>
            For any disputes related to these terms or your use of GSB Realtor, please contact us directly
            before pursuing any legal action:
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

          {/* 6 */}
          <h2 style={sectionTitle}>6. Changes to These Terms</h2>
          <p style={bodyText}>
            We may update these terms from time to time. Continued use of the application after changes are
            posted constitutes acceptance of the revised terms.
          </p>

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
