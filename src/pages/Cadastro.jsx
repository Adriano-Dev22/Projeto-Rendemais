import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logoImg from '../assets/logo.png'

const C = {
  navy:    '#0B1426',
  navy2:   '#0F1E35',
  navy3:   '#132647',
  accent:  '#1E6FD9',
  white:   '#FFFFFF',
  border:  '#E2E8F0',
  text:    '#0B1426',
  textSec: '#475569',
  gray400: '#94A3B8',
  error:   '#DC2626',
  green:   '#059669',
  greenL:  '#D1FAE5',
}

export default function Cadastro() {
  const nav = useNavigate()
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth()

  const [form, setForm]         = useState({ fullName:'', email:'', password:'', confirm:'' })
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [oauthLoad, setOauthLoad] = useState('')
  const [showPass, setShowPass]   = useState(false)

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function validate() {
    if (!form.fullName.trim()) return 'Informe seu nome completo.'
    if (!validateEmail(form.email)) return 'Informe um e-mail válido.'
    if (form.password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.'
    if (form.password !== form.confirm) return 'As senhas não conferem.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    const { error: supaErr } = await signUp({ email: form.email, password: form.password, fullName: form.fullName.trim() })
    setLoading(false)
    if (supaErr) {
      if (supaErr.message.includes('already registered')) setError('Este e-mail já está cadastrado.')
      else setError('Erro ao criar conta. Tente novamente.')
    } else {
      setSuccess(true)
    }
  }

  async function handleGoogle() {
    setOauthLoad('google'); await signInWithGoogle(); setOauthLoad('')
  }
  async function handleFacebook() {
    setOauthLoad('facebook'); await signInWithFacebook(); setOauthLoad('')
  }

  const strength = passwordStrength(form.password)

  if (success) return <SuccessScreen email={form.email} onLogin={() => nav('/login')}/>

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #F8FAFC inset !important; -webkit-text-fill-color: #0B1426 !important; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes float1  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes float2  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse   { 0%,100%{opacity:.15} 50%{opacity:.28} }
        .auth-input:focus  { border-color: #1E6FD9 !important; box-shadow: 0 0 0 3px rgba(30,111,217,.12) !important; }
        .oauth-btn:hover   { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(11,20,38,.1) !important; }
        .submit-btn:hover:not(:disabled) { background: #1B5EC7 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(30,111,217,.35) !important; }
        .link-hover:hover  { text-decoration: underline; }
      `}</style>

      {/* Painel esquerdo */}
      <div style={{
        flex:1, display:'none',
        background:`linear-gradient(145deg, ${C.navy} 0%, ${C.navy2} 55%, ${C.navy3} 100%)`,
        flexDirection:'column', justifyContent:'space-between',
        padding:'48px 56px', position:'relative', overflow:'hidden',
      }} className="cad-left">
        <style>{`@media(min-width:900px){ .cad-left { display:flex !important; } }`}</style>

        <div style={{ position:'absolute', top:'6%',  right:'10%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(30,111,217,.18) 0%, transparent 70%)', animation:'float1 7s ease-in-out infinite', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'12%', left:'6%', width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle, rgba(96,165,250,.12) 0%, transparent 70%)', animation:'float2 9s ease-in-out infinite', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'45%', left:'45%', width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(30,111,217,.08) 0%, transparent 70%)', animation:'pulse 5s ease-in-out infinite', pointerEvents:'none' }}/>

        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.035 }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs><pattern id="g2" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M4 0L0 0 0 4" fill="none" stroke="#60A5FA" strokeWidth=".3"/>
          </pattern></defs>
          <rect width="100" height="100" fill="url(#g2)"/>
        </svg>

        <div style={{ display:'flex', alignItems:'center', gap:10, position:'relative', zIndex:2 }}>
          <img src={logoImg} alt="Veskan" style={{ height:34, filter:'drop-shadow(0 0 12px rgba(30,111,217,.4))' }}/>
          <span style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:19, color:C.white, letterSpacing:'-.3px' }}>Veskan</span>
        </div>

        <div style={{ position:'relative', zIndex:2 }}>
          <h2 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:'clamp(20px,2vw,30px)', color:C.white, lineHeight:1.25, marginBottom:32 }}>
            Descubra quanto<br/>seu dinheiro<br/>
            <span style={{ background:'linear-gradient(90deg,#60A5FA,#93C5FD)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>realmente rende.</span>
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              ['Simulador completo gratuito','Juros compostos, IPCA e CDI ao vivo'],
              ['Sem cartão de crédito','Plano gratuito para sempre'],
              ['Dados do Banco Central','Cálculos com base em dados oficiais'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(30,111,217,.25)', border:'1px solid rgba(96,165,250,.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.85)' }}>{title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div style={{
        width:'100%', maxWidth:500,
        display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'clamp(32px,5vw,60px) clamp(24px,5vw,56px)',
        background:C.white, animation:'fadeUp .5s cubic-bezier(0.16,1,0.3,1) both',
        overflowY:'auto',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:40 }} className="cad-logo-m">
          <style>{`@media(min-width:900px){ .cad-logo-m { display:none !important; } }`}</style>
          <img src={logoImg} alt="Veskan" style={{ height:26 }}/>
          <span style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:16, color:C.navy }}>Veskan</span>
        </div>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:'clamp(20px,3vw,28px)', color:C.text, letterSpacing:'-.5px', marginBottom:8, lineHeight:1.15 }}>
            Crie sua conta grátis
          </h1>
          <p style={{ fontSize:14, color:C.textSec }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color:C.accent, fontWeight:600, textDecoration:'none' }} className="link-hover">Entrar</Link>
          </p>
        </div>

        {/* OAuth */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:22 }}>
          <button onClick={handleGoogle} disabled={!!oauthLoad} className="oauth-btn" style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            padding:'12px 16px', borderRadius:12, border:'1.5px solid #E2E8F0',
            background:C.white, cursor: oauthLoad ? 'not-allowed' : 'pointer',
            fontSize:14, fontWeight:600, color:C.text,
            transition:'all .2s', boxShadow:'0 1px 4px rgba(11,20,38,.06)',
            fontFamily:"'DM Sans', sans-serif", opacity: oauthLoad && oauthLoad !== 'google' ? .5 : 1,
          }}>
            {oauthLoad === 'google'
              ? <div style={{ width:18, height:18, border:'2px solid #E2E8F0', borderTop:'2px solid #1E6FD9', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
              : <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            }
            Cadastrar com Google
          </button>
          <button onClick={handleFacebook} disabled={!!oauthLoad} className="oauth-btn" style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            padding:'12px 16px', borderRadius:12, border:'1.5px solid #E2E8F0',
            background:C.white, cursor: oauthLoad ? 'not-allowed' : 'pointer',
            fontSize:14, fontWeight:600, color:C.text,
            transition:'all .2s', boxShadow:'0 1px 4px rgba(11,20,38,.06)',
            fontFamily:"'DM Sans', sans-serif", opacity: oauthLoad && oauthLoad !== 'facebook' ? .5 : 1,
          }}>
            {oauthLoad === 'facebook'
              ? <div style={{ width:18, height:18, border:'2px solid #E2E8F0', borderTop:'2px solid #1877F2', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            }
            Cadastrar com Facebook
          </button>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
          <div style={{ flex:1, height:1, background:C.border }}/>
          <span style={{ fontSize:12, color:C.gray400, fontWeight:500, whiteSpace:'nowrap' }}>ou cadastre com e-mail</span>
          <div style={{ flex:1, height:1, background:C.border }}/>
        </div>

        {error && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'12px 14px', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span style={{ fontSize:13, color:'#DC2626', fontWeight:500 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <AuthField label="Nome completo" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Seu nome"/>
          <AuthField label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com"/>

          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>Senha</label>
            <div style={{ position:'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" className="auth-input" style={inputSt()}/>
              <button type="button" onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.gray400, padding:4, display:'flex' }}>
                <EyeIcon open={showPass}/>
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop:8 }}>
                <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex:1, height:3, borderRadius:2, transition:'background .2s',
                      background: i <= strength.score
                        ? strength.score <= 1 ? '#DC2626' : strength.score <= 2 ? '#F59E0B' : '#059669'
                        : C.border,
                    }}/>
                  ))}
                </div>
                <span style={{ fontSize:11, color: strength.score <= 1 ? '#DC2626' : strength.score <= 2 ? '#F59E0B' : C.green }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <AuthField label="Confirmar senha" name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Repita a senha"/>

          <button type="submit" disabled={loading} className="submit-btn" style={{
            background: loading ? '#93BBEE' : C.accent,
            color:C.white, border:'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize:15, fontWeight:700, padding:'14px', borderRadius:12,
            transition:'all .2s', fontFamily:"'DM Sans', sans-serif",
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            marginTop:4, boxShadow: loading ? 'none' : '0 4px 16px rgba(30,111,217,.3)',
          }}>
            {loading ? <><Spinner/> Criando conta...</> : 'Criar conta grátis →'}
          </button>
        </form>

        <p style={{ fontSize:11, color:C.gray400, textAlign:'center', marginTop:20, lineHeight:1.7 }}>
          Ao se cadastrar, você concorda com os{' '}
          <a href="#" style={{ color:C.accent, textDecoration:'none' }}>Termos de Uso</a>{' '}e a{' '}
          <a href="#" style={{ color:C.accent, textDecoration:'none' }}>Política de Privacidade</a>.
        </p>
      </div>
    </div>
  )
}

function SuccessScreen({ email, onLogin }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0B1426 0%,#0F1E35 60%,#132647 100%)', fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } } @keyframes check { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }`}</style>
      <div style={{ background:'#fff', borderRadius:24, padding:'52px 44px', maxWidth:440, width:'90%', textAlign:'center', animation:'fadeUp .5s cubic-bezier(0.16,1,0.3,1) both', boxShadow:'0 32px 80px rgba(11,20,38,.2)' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'#D1FAE5', border:'2px solid #6EE7B7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" strokeDasharray="50" strokeDashoffset="50" style={{ animation:'check .5s .3s ease forwards' }}/>
          </svg>
        </div>
        <h2 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:24, color:'#0B1426', marginBottom:10 }}>Conta criada!</h2>
        <p style={{ fontSize:14, color:'#475569', lineHeight:1.75, marginBottom:32 }}>
          Enviamos um e-mail de confirmação para<br/><strong style={{ color:'#0B1426' }}>{email}</strong>.<br/>
          Confirme seu e-mail para ativar sua conta.
        </p>
        <button onClick={onLogin} style={{ background:'#1E6FD9', color:'#fff', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, padding:'13px 32px', borderRadius:12, fontFamily:"'DM Sans', sans-serif", width:'100%', boxShadow:'0 4px 16px rgba(30,111,217,.3)' }}>
          Ir para o login →
        </button>
      </div>
    </div>
  )
}

function AuthField({ label, name, type='text', value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#0B1426', marginBottom:6 }}>{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="auth-input" style={inputSt()}/>
    </div>
  )
}

function inputSt() {
  return { width:'100%', padding:'12px 14px', fontSize:14, border:'1.5px solid #E2E8F0', borderRadius:10, outline:'none', background:'#F8FAFC', color:'#0B1426', fontFamily:"'DM Sans', sans-serif", transition:'border-color .15s, box-shadow .15s' }
}

function Spinner() {
  return <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
}

function EyeIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
    </svg>
  )
}

function passwordStrength(password) {
  if (!password) return { score:0, label:'' }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return { score, label: ['','Fraca','Razoável','Boa','Forte'][score] || 'Fraca' }
}