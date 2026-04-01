import Link from 'next/link'

export default function FooterES() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: '#080808', borderTop: '1px solid rgba(201,168,76,0.12)', padding: '64px 32px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: '600', color: '#F5F3EE', marginBottom: '8px' }}>GSB Realtor</div>
            <div style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Gurpreet Bhatti, REALTOR®</div>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '16px' }}>
              Bienes raíces comerciales y residenciales en Utah. Veterano del USMC. Dynasty Point Referral Group.
            </p>
            <div style={{ fontSize: '13px', color: '#888' }}>
              <div>UT Lic#: 12907042-SA00</div>
              <div style={{ marginTop: '4px' }}><a href="tel:8016358462" style={{ color: '#C9A84C' }}>801.635.8462</a></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              {[
                { href: 'https://www.youtube.com/@GSBRealtorUtah', icon: '▶' },
                { href: 'https://www.facebook.com/gsbrealtorUtah', icon: 'f' },
                { href: 'https://www.instagram.com/gsbrealtorUtah', icon: '◈' },
                { href: 'https://www.tiktok.com/@gsbrealtorUtah', icon: '♪' },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Buscar */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Buscar</div>
            {[
              { href: '/search', label: 'Todas las propiedades' },
              { href: '/search?type=Residential', label: 'Residencial' },
              { href: '/search?type=Commercial Sale', label: 'Comercial' },
              { href: '/search?daysBack=3', label: 'Nuevas propiedades' },
              { href: '/search?minPrice=1000000', label: 'Propiedades de lujo' },
            ].map(link => (
              <div key={link.href} style={{ marginBottom: '10px' }}>
                <Link href={link.href} style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>{link.label}</Link>
              </div>
            ))}
          </div>

          {/* Ciudades */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Ciudades Populares</div>
            {['Salt Lake City','West Jordan','Sandy','Provo','Ogden','St. George','Taylorsville'].map(city => (
              <div key={city} style={{ marginBottom: '10px' }}>
                <Link href={`/search?city=${encodeURIComponent(city)}`} style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>{city}</Link>
              </div>
            ))}
          </div>

          {/* Recursos */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Recursos</div>
            {[
              { href: '/investor', label: 'Herramientas de inversión' },
              { href: '/investor#cap-rate', label: 'Calculadora Cap Rate' },
              { href: '/sell', label: 'Vender mi casa' },
              { href: '/market-reports', label: 'Reportes de mercado' },
              { href: '/testimonials', label: 'Reseñas de clientes' },
              { href: '/contact', label: 'Contacto' },
            ].map(link => (
              <div key={link.href} style={{ marginBottom: '10px' }}>
                <Link href={link.href} style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>{link.label}</Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
          <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.6', marginBottom: '16px', maxWidth: '900px' }}>
            La información de listados múltiples es proporcionada por Wasatch Front Regional Multiple Listing Service, Inc. © {year} WFRMLS. Todos los derechos reservados. Para uso personal del consumidor solamente.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: '#444' }}>© {year} GSB Realtor · Gurpreet Bhatti · UT Lic# 12907042-SA00</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/" style={{ color: '#555', fontSize: '12px', textDecoration: 'none' }}>🇺🇸 English</Link>
              <Link href="/pt" style={{ color: '#555', fontSize: '12px', textDecoration: 'none' }}>🇧🇷 Português</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
