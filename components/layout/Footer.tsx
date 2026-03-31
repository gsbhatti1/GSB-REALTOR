import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
    <style>{`
      @media (max-width: 480px) {
        .footer-grid { gap: 32px !important; }
        .footer-social { flex-wrap: wrap !important; }
      }
    `}</style>
    <footer style={{
      background: '#080808',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      padding: '64px 32px 32px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top grid */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '48px',
        }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: '600', color: '#F5F3EE', marginBottom: '8px' }}>
              GSB Realtor
            </div>
            <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Gurpreet Bhatti, REALTOR®
            </div>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '16px' }}>
              Commercial & residential real estate across Utah.
              USMC Veteran. Dynasty Point Referral Group.
            </p>
            <div style={{ fontSize: '13px', color: '#888' }}>
              <div>UT Lic#: 12907042-SA00</div>
              <div style={{ marginTop: '4px' }}>
                <a href="tel:8016358462" style={{ color: '#C9A84C' }}>801.635.8462</a>
              </div>
            </div>
            {/* Social Media */}
            <div className="footer-social" style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              {[
                { href: 'https://www.youtube.com/@GSBRealtorUtah', label: 'YouTube', icon: '▶' },
                { href: 'https://www.facebook.com/gsbrealtorUtah', label: 'Facebook', icon: 'f' },
                { href: 'https://www.instagram.com/gsbrealtorUtah', label: 'Instagram', icon: '◈' },
                { href: 'https://www.tiktok.com/@gsbrealtorUtah', label: 'TikTok', icon: '♪' },
                { href: 'https://www.linkedin.com/in/gurpreet-bhatti-realtor', label: 'LinkedIn', icon: 'in' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#C9A84C', fontSize: '13px', fontWeight: '700',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Search links */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Search
            </div>
            {[
              { href: '/search',                      label: 'All Utah Homes' },
              { href: '/search?type=Residential',     label: 'Residential' },
              { href: '/search?type=Commercial Sale', label: 'Commercial' },
              { href: '/search?daysBack=3',           label: 'New Listings' },
              { href: '/search?minPrice=1000000',     label: 'Luxury Homes' },
            ].map(link => (
              <div key={link.href} style={{ marginBottom: '10px' }}>
                <Link href={link.href} className="footer-link">{link.label}</Link>
              </div>
            ))}
          </div>

          {/* Cities */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Popular Cities
            </div>
            {['Salt Lake City','West Jordan','Sandy','Provo','Ogden','St. George','Taylorsville'].map(city => (
              <div key={city} style={{ marginBottom: '10px' }}>
                <Link href={`/search?city=${encodeURIComponent(city)}`} className="footer-link">{city}</Link>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Resources
            </div>
            {[
              { href: '/investor',            label: 'Investor Tools' },
              { href: '/investor#cap-rate',   label: 'Cap Rate Calculator' },
              { href: '/investor#cash-flow',  label: 'Cash Flow Tool' },
              { href: '/market-reports',      label: 'Market Reports' },
              { href: '/about',               label: 'About Gurpreet' },
              { href: '/contact',             label: 'Contact' },
            ].map(link => (
              <div key={link.href} style={{ marginBottom: '10px' }}>
                <Link href={link.href} className="footer-link">{link.label}</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
          {/* MLS Disclaimer — required by WFRMLS */}
          <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.6', marginBottom: '16px', maxWidth: '900px' }}>
            The multiple listing information is provided by Wasatch Front Regional Multiple Listing Service, Inc. from a copyrighted compilation of listings. The compilation of listings and each individual listing are © {year} Wasatch Front Regional Multiple Listing Service, Inc., All Rights Reserved. The information provided is for consumers personal, non-commercial use and may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: '#444' }}>
              © {year} GSB Realtor · Gurpreet Bhatti · Dynasty Point Referral Group · UT Lic# 12907042-SA00
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link href="/privacy" className="footer-link" style={{ fontSize: '12px' }}>Privacy</Link>
              <Link href="/terms"   className="footer-link" style={{ fontSize: '12px' }}>Terms</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
    </>
  )
}
