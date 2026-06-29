import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../assets/logo.png'

const C = {
  navy:    '#0B1426',
  navyMid: '#112240',
  accent:  '#1E6FD9',
  accentLight: '#EFF6FF',
  white:   '#FFFFFF',
  border:  '#E2E8F0',
  text:    '#334155',
  textLight: '#64748B',
  gray100: '#F1F5F9',
}

const MENUS = {
  'Para Você': [
    { title: 'Simulador', desc: 'Calcule sua rentabilidade real em segundos', href: '/simulador', icon: '📊' },
    { title: 'Plano Gratuito', desc: 'Comece sem pagar nada', href: '/#planos', icon: '🎯' },
    { title: 'Plano Premium', desc: 'IR automático e análises avançadas', href: '/#planos', icon: '⚡' },
    { title: 'Comparador', desc: 'Compare investimentos lado a lado', href: '/simulador', icon: '⚖️' },
  ],
  'Funcionalidades': [
    { title: 'Dados em Tempo Real', desc: 'IPCA e CDI atualizados automaticamente', href: '/#funcionalidades', icon: '🔄' },
    { title: 'Projeção Gráfica', desc: 'Visualize até 30 anos de simulação', href: '/#funcionalidades', icon: '📈' },
    { title: 'Aportes Mensais', desc: 'Impacto de contribuições regulares', href: '/#funcionalidades', icon: '💰' },
    { title: 'Exportar Relatório', desc: 'Salve sua análise em PDF', href: '/#funcionalidades', icon: '📄' },
  ],
}

export default function Navbar() {
  const nav = useNavigate()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isSimulador = location.pathname === '/simulador'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = e => { if (!e.target.closest('#navbar-root')) setOpenMenu(null) }
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [])

  // Fecha menu mobile ao navegar
  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes menuIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes mobileIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 820px) {
          #nav-desktop { display: none !important; }
          #nav-cta-login { display: none !important; }
          #nav-ham { display: flex !important; }
        }
      `}</style>

      <nav id="navbar-root" style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,255,255,0.98)' : C.white,
        borderBottom: `1px solid ${scrolled ? C.border : C.border}`,
        backdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 2px 20px rgba(11,20,38,0.08)' : 'none',
        transition: 'all .25s ease',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <div style={{
          maxWidth: 1320, margin: '0 auto',
          padding: '0 clamp(16px,4vw,40px)',
          height: 64, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'relative',
        }}>

          {/* ── Logo ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {isSimulador && (
              <>
                <button onClick={() => nav('/')} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 13, color: C.textLight,
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 10px', borderRadius: 8, transition: 'all .15s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.gray100; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.textLight }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  Início
                </button>
                <div style={{ width: 1, height: 18, background: C.border }} />
              </>
            )}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
              <img src={logoImg} alt="Veskan" style={{ height: 30, width: 'auto' }} />
              <span style={{
                fontFamily: 'Sora, sans-serif', fontWeight: 800,
                fontSize: 17, color: C.navy, letterSpacing: '-.3px',
              }}>Veskan</span>
            </a>
          </div>

          {/* ── Desktop nav ── */}
          <div id="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Menus dropdown */}
            {Object.keys(MENUS).map(key => (
              <div key={key} style={{ position: 'relative' }}>
                <button
                  onMouseEnter={() => setOpenMenu(key)}
                  onClick={() => setOpenMenu(p => p === key ? null : key)}
                  style={{
                    background: openMenu === key ? C.gray100 : 'none',
                    border: 'none', cursor: 'pointer',
                    padding: '8px 13px', borderRadius: 8,
                    fontSize: 14, fontWeight: 500,
                    color: openMenu === key ? C.navy : C.text,
                    display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'all .15s', fontFamily: 'DM Sans, sans-serif',
                  }}
                >{key}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                    style={{ transition: 'transform .2s', transform: openMenu === key ? 'rotate(180deg)' : 'none' }}>
                    <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>

                {openMenu === key && (
                  <div onMouseLeave={() => setOpenMenu(null)} style={{
                    position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
                    transform: 'translateX(-50%)',
                    background: C.white, border: `1px solid ${C.border}`,
                    borderRadius: 16, boxShadow: '0 20px 60px rgba(11,20,38,0.12)',
                    padding: 16, minWidth: 460, zIndex: 300,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
                    animation: 'menuIn .18s ease',
                  }}>
                    {MENUS[key].map((item, i) => (
                      <a key={i} href={item.href} onClick={() => setOpenMenu(null)} style={{
                        display: 'flex', gap: 12, padding: '12px 14px',
                        borderRadius: 10, textDecoration: 'none',
                        border: '1px solid transparent', transition: 'all .15s',
                        alignItems: 'flex-start',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.accentLight; e.currentTarget.style.borderColor = '#BFDBFE' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: C.accentLight, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 15,
                        }}>{item.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{item.title}</div>
                          <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.4 }}>{item.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Links simples */}
            {[['/#planos', 'Planos'], ['/#como-funciona', 'Como funciona']].map(([href, label]) => (
              <a key={href} href={href} style={{
                padding: '8px 13px', fontSize: 14, fontWeight: 500,
                color: C.text, textDecoration: 'none', borderRadius: 8, transition: 'all .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = C.navy; e.currentTarget.style.background = C.gray100 }}
                onMouseLeave={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = 'transparent' }}
              >{label}</a>
            ))}
          </div>

          {/* ── CTAs ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button id="nav-cta-login" onClick={() => nav('/login')} style={{
              background: 'none', border: `1px solid ${C.border}`,
              cursor: 'pointer', fontSize: 14, fontWeight: 500, color: C.text,
              padding: '9px 18px', borderRadius: 10, transition: 'all .15s',
              fontFamily: 'DM Sans, sans-serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text }}
            >Entrar</button>

            <button onClick={() => nav('/cadastro')} style={{
              background: C.navy, color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
              padding: '10px 22px', borderRadius: 10, transition: 'all .2s',
              fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(11,20,38,0.25)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1B3461'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(11,20,38,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(11,20,38,0.25)' }}
            >Cadastrar-se</button>

            {/* Hambúrguer */}
            <button id="nav-ham" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu"
              style={{
                display: 'none', background: 'none',
                border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '8px 11px', cursor: 'pointer', color: C.navy,
                alignItems: 'center', justifyContent: 'center',
              }}>
              {mobileOpen
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div style={{
            background: C.white, borderTop: `1px solid ${C.border}`,
            padding: '16px 20px 24px',
            animation: 'mobileIn .2s ease',
          }}>
            {/* Links agrupados */}
            {Object.entries(MENUS).map(([section, items]) => (
              <div key={section} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8, padding: '0 8px' }}>{section}</p>
                {items.map((item, i) => (
                  <a key={i} href={item.href} onClick={() => setMobileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 8px', fontSize: 14, fontWeight: 500,
                    color: C.navy, textDecoration: 'none',
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    {item.title}
                  </a>
                ))}
              </div>
            ))}

            {[['/#planos', 'Planos'], ['/#como-funciona', 'Como funciona']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 8px', fontSize: 14, fontWeight: 500,
                color: C.navy, textDecoration: 'none',
                borderBottom: `1px solid ${C.border}`,
              }}>{label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={() => { nav('/login'); setMobileOpen(false) }} style={{
                flex: 1, background: 'none', border: `1px solid ${C.border}`,
                borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', color: C.navy, fontFamily: 'DM Sans, sans-serif',
              }}>Entrar</button>
              <button onClick={() => { nav('/cadastro'); setMobileOpen(false) }} style={{
                flex: 2, background: C.navy, color: '#fff',
                border: 'none', borderRadius: 10, padding: 13,
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}>Cadastrar-se</button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}