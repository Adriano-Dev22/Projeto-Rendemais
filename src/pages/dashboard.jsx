import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo.png'

const C = {
  navy:    '#0B1426',
  navy2:   '#0F1E35',
  accent:  '#1E6FD9',
  accentL: '#EFF6FF',
  white:   '#FFFFFF',
  border:  '#E2E8F0',
  text:    '#0B1426',
  textSec: '#475569',
  gray50:  '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray400: '#94A3B8',
  green:   '#059669',
  greenL:  '#D1FAE5',
}

export default function Dashboard() {
  const nav = useNavigate()
  const { user, profile, isPremium, signOut } = useAuth()

  const firstName = profile?.full_name?.split(' ')[0]
    || user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'Investidor'

  async function handleSignOut() {
    await signOut()
    nav('/')
  }

  const quickActions = [
    { icon: '📊', label: 'Simulador', desc: 'Calcule sua rentabilidade', href: '/simulador', color: C.accentL, border: '#BFDBFE' },
    { icon: '📈', label: 'Benchmarks', desc: 'CDI, IPCA e Poupança', href: '/simulador', color: '#F0FDF4', border: '#BBF7D0' },
    { icon: '📄', label: 'Relatórios', desc: isPremium ? 'Exportar PDF' : 'Premium', href: '#', color: isPremium ? '#FFFBEB' : C.gray100, border: isPremium ? '#FDE68A' : C.border },
    { icon: '⚙️', label: 'Configurações', desc: 'Sua conta', href: '#', color: C.gray100, border: C.border },
  ]

  return (
    <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .dash-card:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(11,20,38,.1) !important; border-color:#BFDBFE !important; }
        .sign-out-btn:hover { background:#FEF2F2 !important; color:#DC2626 !important; border-color:#FECACA !important; }
        .sim-btn:hover { background:#1B5EC7 !important; transform:translateY(-1px); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background:C.white, borderBottom:`1px solid ${C.border}`,
        position:'sticky', top:0, zIndex:100,
        boxShadow:'0 1px 8px rgba(11,20,38,.06)',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(16px,4vw,40px)', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src={logoImg} alt="Veskan" style={{ height:28 }}/>
            <span style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:16, color:C.navy, letterSpacing:'-.3px' }}>Veskan</span>
            <span style={{ fontSize:11, fontWeight:700, color:C.accent, background:C.accentL, border:'1px solid #BFDBFE', padding:'2px 8px', borderRadius:100, marginLeft:4 }}>
              {isPremium ? 'PREMIUM' : 'FREE'}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent},#60A5FA)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:C.white, flexShrink:0 }}>
                {firstName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:C.text }} className="hide-mobile">{firstName}</span>
            </div>
            <button onClick={handleSignOut} className="sign-out-btn" style={{
              background:'none', border:`1px solid ${C.border}`, borderRadius:8,
              padding:'6px 12px', fontSize:13, fontWeight:500, color:C.textSec,
              cursor:'pointer', fontFamily:"'DM Sans', sans-serif", transition:'all .15s',
            }}>Sair</button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth:1200, margin:'0 auto', padding:'clamp(24px,4vw,48px) clamp(16px,4vw,40px)' }}>

        {/* Boas-vindas */}
        <div style={{ marginBottom:40, animation:'fadeUp .5s ease both' }}>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:'clamp(22px,3vw,32px)', color:C.text, letterSpacing:'-.5px', marginBottom:6 }}>
            Olá, {firstName} 👋
          </h1>
          <p style={{ fontSize:14, color:C.textSec }}>
            {new Date().toLocaleDateString('pt-BR',{ weekday:'long', day:'numeric', month:'long' })}
          </p>
        </div>

        {/* Banner premium (só para free) */}
        {!isPremium && (
          <div style={{
            background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
            borderRadius:16, padding:'24px 28px', marginBottom:32,
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap',
            animation:'fadeUp .5s .1s ease both',
            boxShadow:'0 8px 32px rgba(11,20,38,.15)',
          }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'#93C5FD', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Upgrade disponível</div>
              <h2 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:'clamp(16px,2vw,20px)', color:C.white, marginBottom:4 }}>
                Desbloqueie IR automático, aportes mensais e exportação em PDF
              </h2>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>Assine o Premium por R$ 19,90/mês</p>
            </div>
            <button style={{
              background:C.accent, color:C.white, border:'none', cursor:'pointer',
              fontSize:14, fontWeight:700, padding:'12px 24px', borderRadius:12,
              fontFamily:"'DM Sans', sans-serif", whiteSpace:'nowrap', flexShrink:0,
              boxShadow:'0 4px 16px rgba(30,111,217,.4)', transition:'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='#1B5EC7'; e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background=C.accent; e.currentTarget.style.transform='none' }}
            >
              Assinar Premium →
            </button>
          </div>
        )}

        {/* Ações rápidas */}
        <div style={{ marginBottom:40, animation:'fadeUp .5s .15s ease both' }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:16 }}>Acesso rápido</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:12 }}>
            {quickActions.map(a => (
              <a key={a.label} href={a.href} style={{ textDecoration:'none' }}>
                <div className="dash-card" style={{
                  background:C.white, border:`1px solid ${C.border}`,
                  borderRadius:14, padding:'20px',
                  transition:'all .2s', cursor:'pointer',
                  boxShadow:'0 1px 4px rgba(11,20,38,.05)',
                }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:a.color, border:`1px solid ${a.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:12 }}>
                    {a.icon}
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:3 }}>{a.label}</div>
                  <div style={{ fontSize:12, color:C.gray400 }}>{a.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA simulador */}
        <div style={{
          background:C.white, border:`1px solid ${C.border}`,
          borderRadius:16, padding:'32px',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, flexWrap:'wrap',
          animation:'fadeUp .5s .2s ease both',
          boxShadow:'0 1px 4px rgba(11,20,38,.05)',
        }}>
          <div>
            <h3 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:18, color:C.text, marginBottom:6 }}>
              Simule seu próximo investimento
            </h3>
            <p style={{ fontSize:13, color:C.textSec, lineHeight:1.6 }}>
              Calcule rentabilidade real com IPCA e CDI atualizados do Banco Central.
            </p>
          </div>
          <button onClick={() => nav('/simulador')} className="sim-btn" style={{
            background:C.accent, color:C.white, border:'none', cursor:'pointer',
            fontSize:14, fontWeight:700, padding:'12px 24px', borderRadius:12,
            fontFamily:"'DM Sans', sans-serif", whiteSpace:'nowrap', flexShrink:0,
            boxShadow:'0 4px 16px rgba(30,111,217,.3)', transition:'all .2s',
          }}>
            Abrir simulador →
          </button>
        </div>

        {/* Info conta */}
        <div style={{ marginTop:32, padding:'20px 24px', background:C.white, border:`1px solid ${C.border}`, borderRadius:14, animation:'fadeUp .5s .25s ease both' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Sua conta</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <InfoRow label="E-mail" value={user?.email}/>
            <InfoRow label="Plano" value={isPremium ? 'Premium' : 'Gratuito'}/>
            <InfoRow label="Membro desde" value={user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '—'}/>
          </div>
        </div>

      </main>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #F1F5F9' }}>
      <span style={{ fontSize:13, color:'#64748B' }}>{label}</span>
      <span style={{ fontSize:13, fontWeight:600, color:'#0B1426' }}>{value || '—'}</span>
    </div>
  )
}