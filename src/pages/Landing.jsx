import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState, Suspense } from 'react'
import IntroScreen from '../components/IntroScreen'
import Hero3D from '../components/Hero3D'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import logoImg from '../assets/logo.png'
import simuladorImg from '../assets/simulador.png'
import benchmarkImg from '../assets/benchmark.png'
import projecaoImg from '../assets/projecao.png'

// ── Paleta ────────────────────────────────────────────────
const C = {
  navy900: '#0B1426',
  navy800: '#112240',
  navy700: '#1B3461',
  navy600: '#1E4080',
  accent:  '#1E6FD9',
  accentLight: '#EFF6FF',
  white:   '#FFFFFF',
  gray50:  '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  text:    '#0B1426',
  textSec: '#475569',
  green:   '#059669',
  greenL:  '#D1FAE5',
  red:     '#DC2626',
  amber:   '#D97706',
}

// ── SVG Icons ─────────────────────────────────────────────
const Icon = ({ d, size = 20, color = 'currentColor', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

// ── Intersection Observer ─────────────────────────────────
function useInView(ref, threshold = 0.12) {
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return v
}

function Reveal({ children, delay = 0, y = 28, x = 0 }) {
  const ref = useRef(null)
  const v = useInView(ref)
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? 'none' : `translate(${x}px, ${y}px)`,
      transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>{children}</div>
  )
}

// ── Label de seção ────────────────────────────────────────
function SectionBadge({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700, color: C.accent,
      textTransform: 'uppercase', letterSpacing: '.12em',
      background: C.accentLight, padding: '4px 12px', borderRadius: 100,
      border: '1px solid #BFDBFE',
    }}>{children}</span>
  )
}

// ── Título de seção ───────────────────────────────────────
function SectionTitle({ badge, title, sub, center = true }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 52 }}>
      {badge && <div style={{ marginBottom: 14 }}><SectionBadge>{badge}</SectionBadge></div>}
      <h2 style={{
        fontFamily: 'Sora, sans-serif',
        fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800,
        color: C.text, letterSpacing: '-.5px', lineHeight: 1.2,
        marginBottom: sub ? 16 : 0,
      }}>{title}</h2>
      {sub && <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.7, maxWidth: center ? 560 : '100%', margin: center ? '0 auto' : 0 }}>{sub}</p>}
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────
function FeatureCard({ icon, title, desc, tag, delay = 0 }) {
  const ref = useRef(null)
  const v = useInView(ref)
  const [hov, setHov] = useState(false)
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? (hov ? 'translateY(-4px)' : 'none') : 'translateY(24px)',
      transition: `opacity .6s ease ${delay}ms, transform .6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      background: C.white, border: `1px solid ${hov ? '#BFDBFE' : C.gray200}`,
      borderRadius: 16, padding: '24px',
      boxShadow: hov ? '0 12px 40px rgba(30,111,217,0.12)' : '0 1px 4px rgba(11,20,38,0.05)',
      cursor: 'default', height: '100%', boxSizing: 'border-box',
    }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, marginBottom: 18,
        background: C.accentLight, border: '1px solid #BFDBFE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon d={icon} size={20} color={C.accent} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: 'Sora, sans-serif', margin: 0 }}>{title}</h3>
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700, whiteSpace: 'nowrap',
          background: tag === 'Grátis' ? C.greenL : C.accentLight,
          color: tag === 'Grátis' ? C.green : C.accent,
        }}>{tag}</span>
      </div>
      <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.75, margin: 0 }}>{desc}</p>
    </div>
  )
}

// ── Testimonial card ──────────────────────────────────────
function TestimonialCard({ name, role, text, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div style={{
        background: C.white, border: `1px solid ${C.gray200}`,
        borderRadius: 16, padding: '24px',
        boxShadow: '0 1px 4px rgba(11,20,38,0.05)',
        height: '100%', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: '#FBBF24', fontSize: 14 }}>★</span>
          ))}
        </div>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.75, marginBottom: 18, fontStyle: 'italic' }}>
          "{text}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.accent}, #60A5FA)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: C.white, fontWeight: 700, fontFamily: 'Sora, sans-serif',
            flexShrink: 0,
          }}>{name.charAt(0)}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{name}</div>
            <div style={{ fontSize: 11, color: C.gray400 }}>{role}</div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ number, label, sub, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,48px)', color: '#fff', lineHeight: 1 }}>{number}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.7)', marginTop: 6 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 3 }}>{sub}</div>}
      </div>
    </Reveal>
  )
}

// ── FAQ item ──────────────────────────────────────────────
function FAQItem({ q, a, delay = 0 }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={delay}>
      <div style={{ border: `1px solid ${open ? '#BFDBFE' : C.gray200}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s', marginBottom: 10 }}>
        <button onClick={() => setOpen(!open)} style={{
          width: '100%', padding: '18px 20px', background: open ? C.accentLight : C.white,
          border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 12, transition: 'background .2s', textAlign: 'left',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{q}</span>
          <span style={{ color: C.accent, fontSize: 18, flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
        </button>
        {open && (
          <div style={{ padding: '0 20px 18px', background: C.accentLight }}>
            <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.75, margin: 0 }}>{a}</p>
          </div>
        )}
      </div>
    </Reveal>
  )
}

// ── Logo trust bar ────────────────────────────────────────
function TrustBar() {
  const logos = ['Banco Central', 'B3', 'CVM', 'IBGE', 'Tesouro Nacional']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,3vw,48px)', flexWrap: 'wrap', justifyContent: 'center' }}>
      {logos.map(l => (
        <div key={l} style={{
          fontSize: 11, fontWeight: 700, color: C.gray400,
          textTransform: 'uppercase', letterSpacing: '.08em',
          padding: '7px 14px', border: `1px solid ${C.gray200}`,
          borderRadius: 8, background: C.gray50, whiteSpace: 'nowrap',
        }}>{l}</div>
      ))}
    </div>
  )
}

// ── Como funciona — passo ────────────────────────────────
function Step({ n, title, desc, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div style={{
        display: 'flex', gap: 20, padding: '24px',
        background: C.white, border: `1px solid ${C.gray200}`,
        borderRadius: 16, transition: 'all .2s', cursor: 'default',
        height: '100%', boxSizing: 'border-box',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(30,111,217,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: C.navy900, color: '#60A5FA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, fontFamily: 'Sora, sans-serif',
        }}>{n}</div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6, fontFamily: 'Sora, sans-serif', marginTop: 0 }}>{title}</h3>
          <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.7, margin: 0 }}>{desc}</p>
        </div>
      </div>
    </Reveal>
  )
}

// ════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════
export default function Landing() {
  const nav = useNavigate()
  const [planoPeriodo, setPlanoPeriodo] = useState('mensal')

  const PLANOS = [
    {
      id: 'gratuito',
      name: 'Gratuito',
      desc: 'Para quem quer começar',
      preco_mensal: 0,
      preco_anual: 0,
      primary: false,
      items: [
        'Simulador completo',
        'Juros compostos',
        'Cálculo IPCA real',
        'Gráfico de evolução',
        'Projeção até 30 anos',
        '3 simulações salvas',
      ],
      nao_inclui: ['IR automático por ativo', 'Aportes mensais', 'Comparador avançado'],
      btn: 'Começar grátis',
      btnStyle: 'outline',
    },
    {
      id: 'premium',
      name: 'Premium',
      desc: 'Para o investidor sério',
      preco_mensal: 19.90,
      preco_anual: 179.00,
      economia_anual: 'R$ 59,80 de economia',
      primary: true,
      badge: 'MAIS POPULAR',
      items: [
        'Tudo do Gratuito',
        'IR automático por ativo',
        'Aportes mensais',
        'Comparador de investimentos',
        'Simulações salvas ilimitadas',
        'Exportar relatório PDF',
        'Alertas de taxa CDI',
      ],
      btn: 'Assinar Premium',
      btnStyle: 'solid',
    },
    {
      id: 'profissional',
      name: 'Profissional',
      desc: 'Para assessores e empresas',
      preco_mensal: 59.90,
      preco_anual: 539.00,
      economia_anual: 'R$ 179,80 de economia',
      primary: false,
      items: [
        'Tudo do Premium',
        'Múltiplos clientes/perfis',
        'API de dados em tempo real',
        'Dashboard de carteira',
        'Relatórios personalizados',
        'Suporte prioritário',
        'White-label (logo própria)',
      ],
      btn: 'Falar com vendas',
      btnStyle: 'dark',
    },
  ]

  return (
    <>
      <IntroScreen />

      <a href="#main" style={{
        position: 'absolute', top: -100, left: 16,
        background: C.accent, color: C.white,
        padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: 14,
        zIndex: 9998, transition: 'top .2s', textDecoration: 'none',
      }} onFocus={e => e.target.style.top = '16px'} onBlur={e => e.target.style.top = '-100px'}>
        Pular para o conteúdo
      </a>

      <div style={{ background: C.gray50, color: C.text, overflowX: 'hidden', fontFamily: 'DM Sans, sans-serif' }}>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          img { max-width: 100%; height: auto; display: block; }

          /* ── Responsividade ── */
          @media (max-width: 1024px) {
            .planos-grid { grid-template-columns: 1fr 1fr !important; }
            .planos-grid > *:last-child { grid-column: 1 / -1; max-width: 480px; margin: 0 auto; width: 100%; }
            .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
          }
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-grid > div:last-child { display: none !important; }
            .features-grid { grid-template-columns: 1fr !important; }
            .steps-grid { grid-template-columns: 1fr !important; }
            .planos-grid { grid-template-columns: 1fr !important; }
            .planos-grid > *:last-child { grid-column: auto; max-width: 100%; }
            .testimonials-grid { grid-template-columns: 1fr !important; }
            .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
            .hero-stats { gap: 20px !important; flex-wrap: wrap !important; }
            .image-section { flex-direction: column !important; }
            .image-section.reverse { flex-direction: column !important; }
            .premium-card { transform: none !important; }
          }
          @media (max-width: 480px) {
            .planos-grid { grid-template-columns: 1fr !important; }
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
            .features-grid { grid-template-columns: 1fr !important; }
            .hero-stats { gap: 14px !important; }
          }
        `}</style>

        <Navbar />

        <main id="main">

          {/* ═══ HERO ═══ */}
          <section style={{
            background: `linear-gradient(135deg, ${C.navy900} 0%, #0F1E35 60%, #132647 100%)`,
            color: C.white, position: 'relative', overflow: 'hidden',
            paddingTop: 80, paddingBottom: 0,
          }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .03 }} viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs><pattern id="g" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M5 0L0 0 0 5" fill="none" stroke="#60A5FA" strokeWidth=".3" />
                </pattern></defs>
                <rect width="100" height="100" fill="url(#g)" />
              </svg>
              <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,111,217,0.09) 0%, transparent 70%)' }} />
              <div style={{ position: 'absolute', bottom: '5%', left: '-8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,111,217,0.05) 0%, transparent 70%)' }} />
            </div>

            <div style={{
              maxWidth: 1320, margin: '0 auto',
              padding: '0 clamp(16px,5vw,60px)',
              display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
              gap: 'clamp(32px,5vw,72px)', alignItems: 'center',
              position: 'relative', zIndex: 2,
            }} className="hero-grid">

              <div style={{ paddingBottom: 80 }}>
                <Reveal>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      fontSize: 12, fontWeight: 600, color: '#93C5FD',
                      background: 'rgba(30,111,217,0.12)',
                      border: '1px solid rgba(96,165,250,0.2)',
                      padding: '6px 14px', borderRadius: 100,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', flexShrink: 0 }} />
                      Dados do Banco Central em tempo real
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={80}>
                  <h1 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 'clamp(28px,4.2vw,58px)',
                    fontWeight: 800, lineHeight: 1.1,
                    letterSpacing: '-1.5px', marginBottom: 22, color: C.white,
                  }}>
                    Descubra quanto<br />seu dinheiro{' '}
                    <span style={{
                      background: 'linear-gradient(90deg, #60A5FA, #93C5FD)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>realmente rende</span>
                  </h1>
                </Reveal>

                <Reveal delay={160}>
                  <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'rgba(255,255,255,.6)', lineHeight: 1.85, marginBottom: 36, maxWidth: 460 }}>
                    A maioria dos apps mostra o número bonito.
                    O Veskan mostra o número verdadeiro — depois da inflação,
                    IR e taxas passarem por cima.
                  </p>
                </Reveal>

                <Reveal delay={240}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                    <button onClick={() => nav('/simulador')} style={{
                      background: C.accent, color: C.white,
                      border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700,
                      padding: '14px 28px', borderRadius: 12,
                      boxShadow: '0 4px 24px rgba(30,111,217,0.4)',
                      transition: 'all .2s', fontFamily: 'DM Sans, sans-serif',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1B5EC7'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = 'none' }}
                    >Simular agora — é grátis →</button>

                    <a href="#como-funciona" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'rgba(255,255,255,.06)',
                      color: 'rgba(255,255,255,.8)', fontSize: 15, fontWeight: 500,
                      border: '1px solid rgba(255,255,255,.14)',
                      padding: '14px 22px', borderRadius: 12,
                      cursor: 'pointer', textDecoration: 'none',
                      transition: 'all .2s', fontFamily: 'DM Sans, sans-serif',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.11)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.06)'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><path d="M10 15l5-3-5-3v6z" fill="currentColor" stroke="none" />
                      </svg>
                      Ver como funciona
                    </a>
                  </div>
                </Reveal>

                <Reveal delay={320}>
                  <div className="hero-stats" style={{ display: 'flex', gap: 36, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,.08)' }}>
                    {[
                      { n: '6+', l: 'tipos de ativo' },
                      { n: '30a', l: 'de projeção' },
                      { n: '100%', l: 'grátis no básico' },
                      { n: 'BCB', l: 'dados oficiais' },
                    ].map(s => (
                      <div key={s.l}>
                        <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 22, color: '#93C5FD' }}>{s.n}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 3 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

              {/* Dashboard preview */}
              <Reveal delay={200} y={40}>
                <div style={{ paddingBottom: 48 }}>
                  <div style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(96,165,250,0.15)',
                    borderRadius: '16px 16px 0 0',
                    borderBottom: 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                      {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                      <div style={{ flex: 1, marginLeft: 6, background: 'rgba(255,255,255,.05)', borderRadius: 5, padding: '2px 10px', fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
                        veskan.com.br/simulador
                      </div>
                    </div>
                    <div style={{ height: 300, overflow: 'hidden' }}>
                      <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.2)', fontSize: 12 }}>Carregando...</div>}>
                        <Hero3D />
                      </Suspense>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(96,165,250,0.15)',
                    borderRadius: '0 0 16px 16px',
                    backdropFilter: 'blur(12px)',
                    padding: 16,
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                      {[
                        { l: 'Montante líquido', v: 'R$ 16.479', c: '#fff' },
                        { l: 'Rendimento bruto', v: 'R$ 7.623', c: '#93C5FD' },
                        { l: 'Perda à inflação', v: 'R$ 2.396', c: '#FCA5A5' },
                        { l: 'Ganho real', v: '+R$ 4.083', c: '#86EFAC' },
                      ].map(card => (
                        <div key={card.l} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '10px 12px' }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginBottom: 3 }}>{card.l}</div>
                          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Sora, sans-serif', color: card.c }}>{card.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.25)',
                      borderRadius: 10, padding: '10px 14px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginBottom: 2 }}>Taxa real anual</div>
                        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Sora, sans-serif', color: '#86EFAC' }}>7,29%</div>
                      </div>
                      <span style={{ fontSize: 12, color: '#86EFAC', fontWeight: 600 }}>✓ Batendo a inflação</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div style={{ lineHeight: 0, marginBottom: -2 }}>
              <svg viewBox="0 0 1440 70" style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
                <path d="M0,35 C480,70 960,0 1440,35 L1440,70 L0,70 Z" fill={C.gray50} />
              </svg>
            </div>
          </section>

          {/* ═══ TRUST BAR ═══ */}
          <section style={{ background: C.gray50, padding: 'clamp(28px,4vw,48px) clamp(16px,5vw,40px)', borderBottom: `1px solid ${C.gray200}` }}>
            <div style={{ maxWidth: 1320, margin: '0 auto' }}>
              <Reveal>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: C.gray400, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700 }}>
                    Dados oficiais de
                  </span>
                </div>
                <TrustBar />
              </Reveal>
            </div>
          </section>

          {/* ═══ SCREENSHOTS ═══ */}
          <section style={{ padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,40px)', background: C.white, borderTop: `1px solid ${C.gray200}` }}>
            <div style={{ maxWidth: 1320, margin: '0 auto' }}>

              {/* Linha 1 */}
              <div className="image-section" style={{ display: 'flex', gap: 'clamp(24px,5vw,72px)', alignItems: 'center', marginBottom: 'clamp(48px,8vw,96px)' }}>
                <Reveal x={-20} delay={0}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <SectionBadge>Simulador</SectionBadge>
                    <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, color: C.text, letterSpacing: '-.5px', lineHeight: 1.2, margin: '16px 0' }}>
                      Calcule o retorno real<br />em segundos
                    </h2>
                    <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, marginBottom: 24 }}>
                      Ajuste valor, taxa e prazo com sliders intuitivos. O Veskan
                      aplica automaticamente a tabela regressiva de IR, desconta
                      a inflação oficial e entrega o número que você vai ter no bolso.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                      {['IR calculado por faixa de prazo', 'IPCA e CDI atualizados ao vivo', 'Projeção de 1 a 30 anos'].map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.textSec }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: C.accentLight, border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: C.accent, flexShrink: 0 }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => nav('/simulador')} style={{
                      background: C.accent, color: C.white, border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 700, padding: '12px 24px', borderRadius: 10,
                      fontFamily: 'DM Sans, sans-serif', transition: 'all .2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1B5EC7'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = 'none' }}
                    >Ver o simulador →</button>
                  </div>
                </Reveal>
                <Reveal x={20} delay={100}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <img src={simuladorImg} alt="Simulador Veskan" style={{ width: '100%', borderRadius: 16, boxShadow: '0 20px 60px rgba(11,20,38,0.15)', border: `1px solid ${C.gray200}` }} />
                  </div>
                </Reveal>
              </div>

              {/* Linha 2 */}
              <div className="image-section reverse" style={{ display: 'flex', gap: 'clamp(24px,5vw,72px)', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: 'clamp(48px,8vw,96px)' }}>
                <Reveal x={20} delay={0}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <SectionBadge>Benchmark</SectionBadge>
                    <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, color: C.text, letterSpacing: '-.5px', lineHeight: 1.2, margin: '16px 0' }}>
                      Compare com CDI,<br />IPCA e Poupança
                    </h2>
                    <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, marginBottom: 24 }}>
                      A aba Benchmark mostra seu investimento lado a lado com os
                      principais indicadores do mercado. Veja de forma visual se você
                      está ganhando ou perdendo para a inflação.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {['Gráfico de área comparativo', 'Cards com montante por benchmark', 'Período ajustável (1 a 30 anos)'].map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.textSec }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: C.accentLight, border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: C.accent, flexShrink: 0 }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <Reveal x={-20} delay={100}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <img src={benchmarkImg} alt="Benchmark Veskan" style={{ width: '100%', borderRadius: 16, boxShadow: '0 20px 60px rgba(11,20,38,0.15)', border: `1px solid ${C.gray200}` }} />
                  </div>
                </Reveal>
              </div>

              {/* Linha 3 */}
              <div className="image-section" style={{ display: 'flex', gap: 'clamp(24px,5vw,72px)', alignItems: 'center' }}>
                <Reveal x={-20} delay={0}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <SectionBadge>Projeção</SectionBadge>
                    <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, color: C.text, letterSpacing: '-.5px', lineHeight: 1.2, margin: '16px 0' }}>
                      Veja seu patrimônio<br />crescer ano a ano
                    </h2>
                    <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, marginBottom: 24 }}>
                      A tabela de projeção detalha saldo líquido, poder de compra
                      e ganho real para cada ano da simulação. Perfeito para
                      planejar aposentadoria e metas de longo prazo.
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {['Tabela com scroll até 30 anos', 'Ganho real destacado em verde/vermelho', 'Comparação com CDI e Poupança'].map(item => (
                        <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.textSec }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: C.accentLight, border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: C.accent, flexShrink: 0 }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <Reveal x={20} delay={100}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <img src={projecaoImg} alt="Projeção Veskan" style={{ width: '100%', borderRadius: 16, boxShadow: '0 20px 60px rgba(11,20,38,0.15)', border: `1px solid ${C.gray200}` }} />
                  </div>
                </Reveal>
              </div>

            </div>
          </section>

          {/* ═══ COMO FUNCIONA ═══ */}
          <section id="como-funciona" style={{ padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,40px)', background: C.gray50 }}>
            <div style={{ maxWidth: 1320, margin: '0 auto' }}>
              <Reveal>
                <SectionTitle
                  badge="Como funciona"
                  title="Simples como deve ser"
                  sub="Sem cadastro obrigatório. Em 30 segundos você sabe o que seu dinheiro realmente rende."
                />
              </Reveal>
              <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <Step n="01" title="Configure" desc="Informe o valor investido, taxa e prazo. O IPCA atual já vem preenchido automaticamente com dados do Banco Central." delay={0} />
                <Step n="02" title="Calcule" desc="Em menos de um segundo: juros compostos, inflação, IR e taxas — tudo processado e organizado visualmente." delay={100} />
                <Step n="03" title="Decida" desc="Resultado em linguagem clara. Quanto você ganhou de verdade, não apenas no papel. Compare com CDI e Poupança." delay={200} />
              </div>
            </div>
          </section>

          {/* ═══ FUNCIONALIDADES ═══ */}
          <section id="funcionalidades" style={{ padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,40px)', background: C.white, borderTop: `1px solid ${C.gray200}` }}>
            <div style={{ maxWidth: 1320, margin: '0 auto' }}>
              <Reveal>
                <SectionTitle badge="Funcionalidades" title="Tudo que você precisa sobre seu patrimônio" sub="Do básico ao avançado, o Veskan cobre todos os aspectos da sua rentabilidade." />
              </Reveal>
              <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { icon: "M3 3v18h18M7 16l4-4 4 4 4-6", title: 'Rentabilidade real', desc: 'Ganho de verdade, depois da inflação corroer o poder de compra. Não o número que o banco mostra.', tag: 'Grátis', delay: 0 },
                  { icon: "M9 7h6M9 12h6M9 17h3M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", title: 'IR automático', desc: 'Tabela regressiva 22,5% → 15% aplicada automaticamente por ativo e prazo. Sem contas manuais.', tag: 'Premium', delay: 60 },
                  { icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2", title: 'Dados em tempo real', desc: 'IPCA e CDI atualizados do Banco Central. Seus cálculos sempre refletem a realidade de hoje.', tag: 'Grátis', delay: 120 },
                  { icon: "M22 7l-9.5 9.5-5-5L1 18M22 7h-6M22 7v6", title: 'Projeção gráfica', desc: 'Evolução do patrimônio em 1, 5, 10, 20 ou 30 anos. Compare com CDI e Poupança no mesmo gráfico.', tag: 'Grátis', delay: 180 },
                  { icon: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 3l-4 4-4-4", title: 'Aportes mensais', desc: 'Veja o impacto de contribuições mensais no longo prazo. Quanto vai ter ao aposentar?', tag: 'Premium', delay: 240 },
                  { icon: "M18 20V10M12 20V4M6 20v-6", title: 'Comparador', desc: 'Dois ou mais investimentos lado a lado. CDB vs LCI vs Tesouro — qual realmente compensa?', tag: 'Premium', delay: 300 },
                  { icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h3", title: 'Exportar PDF', desc: 'Salve sua simulação em PDF profissional para compartilhar com seu assessor ou guardar para referência.', tag: 'Premium', delay: 0 },
                  { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: 'Alertas de taxa', desc: 'Seja notificado quando CDI ou IPCA mudarem significativamente e impactarem suas simulações salvas.', tag: 'Premium', delay: 60 },
                  { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 1 0 7.75M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", title: 'Múltiplos perfis', desc: 'Gerencie simulações de clientes ou familiares em perfis separados. Perfeito para assessores.', tag: 'Pro', delay: 120 },
                ].map(f => (
                  <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} tag={f.tag} delay={f.delay} />
                ))}
              </div>
            </div>
          </section>

          {/* ═══ STATS ═══ */}
          <section style={{ background: `linear-gradient(135deg, ${C.navy900}, #0F1E35)`, padding: 'clamp(48px,7vw,80px) clamp(16px,5vw,40px)' }}>
            <div style={{ maxWidth: 1320, margin: '0 auto' }}>
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
                <StatCard number="12" label="tipos de ativo" sub="CDB, LCI, Tesouro e mais" delay={0} />
                <StatCard number="30a" label="de projeção" sub="Planejamento de longo prazo" delay={100} />
                <StatCard number="Real" label="dados ao vivo" sub="Banco Central do Brasil" delay={200} />
                <StatCard number="0" label="cadastro obrigatório" sub="Comece agora, grátis" delay={300} />
              </div>
            </div>
          </section>

          {/* ═══ PLANOS ═══ */}
          <section id="planos" style={{ padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,40px)', background: C.gray50, borderTop: `1px solid ${C.gray200}` }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <Reveal>
                <SectionTitle badge="Planos" title="Comece grátis, evolua quando precisar" sub="Sem cartão de crédito para o plano gratuito. Cancele quando quiser nos planos pagos." />

                {/* Toggle mensal/anual */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
                  <span style={{ fontSize: 14, fontWeight: planoPeriodo === 'mensal' ? 700 : 400, color: planoPeriodo === 'mensal' ? C.text : C.gray400 }}>Mensal</span>
                  <button onClick={() => setPlanoPeriodo(p => p === 'mensal' ? 'anual' : 'mensal')} style={{
                    width: 52, height: 28, borderRadius: 100, cursor: 'pointer',
                    background: planoPeriodo === 'anual' ? C.accent : C.gray300,
                    border: 'none', position: 'relative', transition: 'background .25s',
                  }}>
                    <div style={{
                      position: 'absolute', top: 3, left: planoPeriodo === 'anual' ? 26 : 3,
                      width: 22, height: 22, borderRadius: '50%', background: C.white,
                      transition: 'left .25s', boxShadow: '0 1px 4px rgba(0,0,0,.2)',
                    }} />
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: planoPeriodo === 'anual' ? 700 : 400, color: planoPeriodo === 'anual' ? C.text : C.gray400 }}>Anual</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.green, background: C.greenL, padding: '2px 8px', borderRadius: 100 }}>2 meses grátis</span>
                  </span>
                </div>
              </Reveal>

              {/* Grid de planos — alinhados pelo topo, mesma altura via CSS grid */}
              <div className="planos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}>
                {PLANOS.map(p => {
                  const isAnual = planoPeriodo === 'anual'
                  const precoMensal = isAnual
                    ? (p.preco_anual > 0 ? (p.preco_anual / 12) : 0)
                    : p.preco_mensal

                  return (
                    <Reveal key={p.id}>
                      <div className={p.primary ? 'premium-card' : ''} style={{
                        background: p.primary ? C.navy900 : C.white,
                        border: p.primary ? `2px solid ${C.accent}` : `1px solid ${C.gray200}`,
                        borderRadius: 20,
                        padding: '32px 28px',
                        position: 'relative',
                        boxShadow: p.primary ? '0 24px 64px rgba(30,111,217,0.2)' : '0 1px 4px rgba(11,20,38,0.05)',
                        transform: p.primary ? 'scale(1.02)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}>
                        {p.badge && (
                          <div style={{
                            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                            background: C.accent, color: C.white,
                            fontSize: 10, fontWeight: 800, padding: '4px 16px', borderRadius: 100,
                            whiteSpace: 'nowrap', letterSpacing: '.06em',
                          }}>{p.badge}</div>
                        )}

                        {/* Header */}
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 20, color: p.primary ? C.white : C.text, marginBottom: 4 }}>{p.name}</div>
                          <div style={{ fontSize: 13, color: p.primary ? 'rgba(255,255,255,.45)' : C.gray400 }}>{p.desc}</div>
                        </div>

                        {/* Preço */}
                        <div style={{ marginBottom: 20 }}>
                          {precoMensal === 0 ? (
                            <>
                              <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 900, fontSize: 40, color: p.primary ? C.white : C.text, lineHeight: 1 }}>Grátis</div>
                              <div style={{ fontSize: 12, color: p.primary ? 'rgba(255,255,255,.4)' : C.gray400, marginTop: 6 }}>Para sempre</div>
                            </>
                          ) : (
                            <>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: p.primary ? 'rgba(255,255,255,.5)' : C.gray400, alignSelf: 'flex-start', marginTop: 10 }}>R$</span>
                                <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 900, fontSize: 40, color: p.primary ? '#93C5FD' : C.text, lineHeight: 1 }}>
                                  {precoMensal.toFixed(2).replace('.', ',')}
                                </span>
                                <span style={{ fontSize: 13, color: p.primary ? 'rgba(255,255,255,.4)' : C.gray400 }}>/mês</span>
                              </div>
                              {isAnual && p.preco_anual > 0 && (
                                <div style={{ marginTop: 8 }}>
                                  <div style={{ fontSize: 13, color: p.primary ? 'rgba(255,255,255,.55)' : C.gray500, marginBottom: 2 }}>
                                    R$ {p.preco_anual.toFixed(2).replace('.', ',')} cobrado anualmente
                                  </div>
                                  <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>
                                    ✓ {p.economia_anual} vs mensal
                                  </div>
                                </div>
                              )}
                              {!isAnual && (
                                <div style={{ fontSize: 12, color: p.primary ? 'rgba(255,255,255,.35)' : C.gray400, marginTop: 6 }}>
                                  cobrado mensalmente
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div style={{ height: 1, background: p.primary ? 'rgba(255,255,255,.08)' : C.gray200, marginBottom: 20 }} />

                        {/* Itens — flex-grow para empurrar botão pra baixo */}
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28, flexGrow: 1 }}>
                          {p.items.map(item => (
                            <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: p.primary ? 'rgba(255,255,255,.75)' : C.textSec }}>
                              <span style={{ color: p.primary ? '#60A5FA' : C.accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                              {item}
                            </li>
                          ))}
                          {p.nao_inclui && p.nao_inclui.map(item => (
                            <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: p.primary ? 'rgba(255,255,255,.25)' : C.gray300 }}>
                              <span style={{ fontWeight: 700, flexShrink: 0 }}>—</span>
                              {item}
                            </li>
                          ))}
                        </ul>

                        {/* Botão sempre no rodapé do card */}
                        <button
                          onClick={() => p.id === 'profissional' ? null : nav(p.id === 'gratuito' ? '/simulador' : '/cadastro')}
                          style={{
                            width: '100%', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all .2s',
                            marginTop: 'auto',
                            ...(p.btnStyle === 'solid' ? {
                              background: C.accent, color: C.white, border: 'none',
                            } : p.btnStyle === 'dark' ? {
                              background: 'rgba(255,255,255,.1)', color: C.white, border: '1px solid rgba(255,255,255,.2)',
                            } : {
                              background: 'transparent', color: C.text, border: `1.5px solid ${C.gray200}`,
                            }),
                          }}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '.82'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
                        >{p.btn}</button>
                      </div>
                    </Reveal>
                  )
                })}
              </div>

              <Reveal delay={200}>
                <p style={{ textAlign: 'center', fontSize: 12, color: C.gray400, marginTop: 28 }}>
                  ✓ Sem taxa de cancelamento &nbsp;·&nbsp; ✓ Troque de plano a qualquer momento &nbsp;·&nbsp; ✓ Dados protegidos pela LGPD
                </p>
              </Reveal>
            </div>
          </section>

          {/* ═══ TESTIMONIALS ═══ */}
          <section style={{ padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,40px)', background: C.white, borderTop: `1px solid ${C.gray200}` }}>
            <div style={{ maxWidth: 1320, margin: '0 auto' }}>
              <Reveal>
                <SectionTitle badge="Depoimentos" title="O que dizem nossos usuários" sub="Investidores que pararam de confiar nos números do banco." />
              </Reveal>
              <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}>
                <TestimonialCard delay={0} name="Lucas Ferreira" role="Engenheiro • SP" text="Sempre achei que meu CDB rendia bem. Quando coloquei no Veskan vi que estava perdendo para a inflação há 2 anos. Mudei para LCI e agora tenho ganho real positivo." />
                <TestimonialCard delay={80} name="Camila Souza" role="Médica • RJ" text="A interface é incrível. Em 1 minuto configurei minha simulação e já tinha o resultado líquido com IR, inflação, tudo. Muito mais claro do que qualquer planilha." />
                <TestimonialCard delay={160} name="Rafael Lima" role="Assessor de investimentos • BH" text="Uso com todos os meus clientes. O comparador e o PDF de relatório economizam horas do meu trabalho. O plano Profissional pagou por si mesmo no primeiro mês." />
              </div>
            </div>
          </section>

          {/* ═══ FAQ ═══ */}
          <section style={{ padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,40px)', background: C.gray50, borderTop: `1px solid ${C.gray200}` }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <Reveal>
                <SectionTitle badge="FAQ" title="Perguntas frequentes" />
              </Reveal>
              {[
                { q: 'O Veskan é gratuito?', a: 'Sim! O plano gratuito é para sempre. Você simula qualquer ativo com juros compostos, IPCA ao vivo e projeção de até 30 anos. Os planos pagos adicionam IR automático, aportes mensais, comparador avançado e mais.', delay: 0 },
                { q: 'De onde vêm os dados de IPCA e CDI?', a: 'Direto da API pública do Banco Central do Brasil (BCB/SGS). Os dados são atualizados automaticamente a cada consulta, garantindo que seus cálculos reflitam a realidade do dia.', delay: 60 },
                { q: 'Os cálculos de IR estão corretos?', a: 'Sim. Aplicamos a tabela regressiva oficial: 22,5% para até 6 meses, 20% de 6 a 12 meses, 17,5% de 1 a 2 anos, e 15% acima de 2 anos. Para ativos isentos (LCI, LCA, CRI, CRA), o IR é zero.', delay: 120 },
                { q: 'Preciso me cadastrar para usar?', a: 'Não! O simulador básico funciona sem qualquer cadastro. Para salvar simulações, acessar o comparador e gerar PDFs, você cria uma conta gratuita em menos de 1 minuto.', delay: 180 },
                { q: 'Posso cancelar minha assinatura a qualquer momento?', a: 'Sim, sem burocracia. Você pode cancelar a qualquer momento pelo painel de configurações. Não há taxa de cancelamento e você mantém o acesso até o fim do período pago.', delay: 240 },
                { q: 'O plano Profissional funciona para escritórios de investimento?', a: 'Sim! O plano Profissional foi desenvolvido especialmente para assessores e escritórios. Inclui múltiplos perfis de clientes, white-label, API de dados e relatórios personalizados.', delay: 300 },
              ].map(f => <FAQItem key={f.q} q={f.q} a={f.a} delay={f.delay} />)}
            </div>
          </section>

          {/* ═══ CTA FINAL ═══ */}
          <section style={{
            background: `linear-gradient(135deg, ${C.navy900} 0%, #0F1E35 60%, #132647 100%)`,
            padding: 'clamp(48px,7vw,96px) clamp(16px,5vw,40px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '-20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,111,217,0.1) 0%, transparent 70%)' }} />
              <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,111,217,0.07) 0%, transparent 70%)' }} />
            </div>

            <Reveal>
              <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <SectionBadge>Grátis para começar</SectionBadge>
                <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(24px,3.5vw,44px)', color: C.white, letterSpacing: '-.5px', lineHeight: 1.15, margin: '20px 0 16px' }}>
                  Pronto para saber<br />a verdade sobre o seu dinheiro?
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', marginBottom: 40, lineHeight: 1.7 }}>
                  Simule agora. Sem cadastro. Sem cartão. Sem pegadinha.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => nav('/simulador')} style={{
                    background: C.accent, color: C.white, border: 'none', cursor: 'pointer',
                    fontSize: 16, fontWeight: 700, padding: '16px 36px', borderRadius: 14,
                    boxShadow: '0 4px 24px rgba(30,111,217,0.4)',
                    transition: 'all .2s', fontFamily: 'DM Sans, sans-serif',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#1B5EC7'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = 'none' }}
                  >Simular agora — é grátis →</button>
                  <button onClick={() => nav('/cadastro')} style={{
                    background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.8)',
                    border: '1px solid rgba(255,255,255,.15)', cursor: 'pointer',
                    fontSize: 16, fontWeight: 500, padding: '16px 28px', borderRadius: 14,
                    transition: 'all .2s', fontFamily: 'DM Sans, sans-serif',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.13)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
                  >Criar conta grátis</button>
                </div>
              </div>
            </Reveal>
          </section>

        </main>

        <Footer />
      </div>
    </>
  )
}