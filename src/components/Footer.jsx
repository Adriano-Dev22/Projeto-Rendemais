import logoImg from '../assets/logo.png'

const C = {
  navy900: '#0B1426',
  navy800: '#112240',
  white: '#FFFFFF',
  accent: '#1E6FD9',
  gray400: '#94A3B8',
  gray500: '#64748B',
  border: 'rgba(255,255,255,0.07)',
}

const links = {
  Produto: [
    { href: '/', label: 'Início' },
    { href: '/simulador', label: 'Simulador' },
    { href: '/#planos', label: 'Planos' },
    { href: '/#funcionalidades', label: 'Funcionalidades' },
  ],
  'Como funciona': [
    { href: '/#como-funciona', label: 'Passo a passo' },
    { href: '/#funcionalidades', label: 'Recursos' },
    { href: '/#planos', label: 'Preços' },
  ],
  Legal: [
    { href: '/privacidade', label: 'Privacidade' },
    { href: '/termos', label: 'Termos de uso' },
    { href: '/cookies', label: 'Cookies' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      background: C.navy900,
      borderTop: `1px solid ${C.border}`,
      padding: 'clamp(48px,5vw,64px) clamp(20px,5vw,40px) 28px',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Grade principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 40,
          marginBottom: 48,
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src={logoImg} alt="Veskan" style={{ height: 26, width: 'auto', filter: 'brightness(0) invert(1)' }} />
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 18, color: C.white }}>Veskan</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', lineHeight: 1.85, maxWidth: 260, marginBottom: 24 }}>
              Plataforma de rentabilidade real para investidores que querem entender o que acontece com seu patrimônio.
            </p>

            {/* Badge regulatório */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.08)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', lineHeight: 1.4 }}>
                Dados do Banco Central do Brasil
              </span>
            </div>
          </div>

          {/* Colunas de links */}
          {Object.entries(links).map(([titulo, items]) => (
            <div key={titulo}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: C.accent,
                textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 18,
              }}>{titulo}</p>
              {items.map(({ href, label }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <a href={href} style={{
                    fontSize: 13, color: 'rgba(255,255,255,.4)',
                    textDecoration: 'none', transition: 'color .15s',
                    display: 'inline-block',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = C.white}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.4)'}
                  >{label}</a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 22,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.22)' }}>
            © 2026 Veskan. Todos os direitos reservados.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacidade', 'Termos', 'Cookies'].map(l => (
              <a key={l} href="#" style={{
                fontSize: 12, color: 'rgba(255,255,255,.22)',
                textDecoration: 'none', transition: 'color .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.22)'}
              >{l}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}