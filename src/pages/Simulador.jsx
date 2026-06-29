import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { formatarMoeda, formatarPorcentagem } from '../utils/calculator'
import { buscarIPCA, buscarCDI } from '../utils/bcbApi'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ── Tokens ───────────────────────────────────────────────
const C = {
  navy900: '#0B1426', navy800: '#112240', navy700: '#1B3461',
  white: '#FFFFFF', gray50: '#F8FAFC', gray100: '#F1F5F9',
  gray200: '#E2E8F0', gray300: '#CBD5E1', gray400: '#94A3B8',
  gray500: '#64748B', gray600: '#475569',
  bg: '#F8FAFC', bgCard: '#FFFFFF', border: '#E2E8F0',
  text: '#0B1426', textSec: '#475569',
  green: '#059669', greenL: '#D1FAE5', greenMid: '#10B981',
  red: '#DC2626', redL: '#FEE2E2',
  amber: '#D97706', amberL: '#FEF3C7',
  blue: '#818CF8',
  accent: '#1E6FD9', accentL: '#EFF6FF',
}

// ── Dados ────────────────────────────────────────────────
const ATIVOS = [
  { id: 'cdb_longo',    label: 'CDB', sub: 'Prazo > 2 anos',   grupo: 'Renda Fixa',     ir: 15.0, isento: false, info: 'Certificado de Depósito Bancário — alíquota mais baixa de IR.' },
  { id: 'cdb_medio',   label: 'CDB', sub: 'Prazo 1–2 anos',   grupo: 'Renda Fixa',     ir: 17.5, isento: false, info: 'Certificado de Depósito Bancário — prazo intermediário.' },
  { id: 'cdb_curto',   label: 'CDB', sub: 'Prazo 6m–1 ano',   grupo: 'Renda Fixa',     ir: 20.0, isento: false, info: 'Certificado de Depósito Bancário — maior alíquota de IR.' },
  { id: 'lci',         label: 'LCI / LCA', sub: 'Isento de IR', grupo: 'Renda Fixa',   ir: 0,    isento: true,  info: 'Letras de Crédito — isentas de IR para pessoa física.' },
  { id: 'cri',         label: 'CRI / CRA', sub: 'Isento de IR', grupo: 'Renda Fixa',   ir: 0,    isento: true,  info: 'Certificados de Recebíveis — isentos de IR.' },
  { id: 'tesouro_selic',label: 'Tesouro Selic', sub: 'Liquidez diária', grupo: 'Tesouro', ir: 15.0, isento: false, info: 'Mais conservador. Liquidez diária. Ideal para reserva.' },
  { id: 'tesouro_ipca', label: 'Tesouro IPCA+', sub: 'Protegido da inflação', grupo: 'Tesouro', ir: 15.0, isento: false, info: 'IPCA + taxa prefixada. Ideal para aposentadoria.' },
  { id: 'tesouro_pre',  label: 'Tesouro Pré-fixado', sub: 'Taxa garantida', grupo: 'Tesouro', ir: 15.0, isento: false, info: 'Rentabilidade fixada no contrato até o vencimento.' },
  { id: 'acoes',        label: 'Ações', sub: 'Renda variável', grupo: 'Variável',       ir: 15.0, isento: false, info: 'Participação em empresas na B3.' },
  { id: 'fiis',         label: 'FIIs', sub: 'Ganho de capital', grupo: 'Variável',      ir: 20.0, isento: false, info: 'Fundos de Investimento Imobiliário — ganho de capital.' },
  { id: 'fundo_rf',     label: 'Fundo RF', sub: 'LP > 2 anos', grupo: 'Fundos',         ir: 15.0, isento: false, info: 'Fundo de Renda Fixa de longo prazo.' },
  { id: 'fundo_mm',     label: 'Multimercado', sub: '> 2 anos', grupo: 'Fundos',        ir: 15.0, isento: false, info: 'Fundo com múltiplas estratégias e gestão ativa.' },
]
const GRUPOS = ['Renda Fixa', 'Tesouro', 'Variável', 'Fundos']
const FILTROS = [{ l:'1A',a:1},{l:'2A',a:2},{l:'5A',a:5},{l:'10A',a:10},{l:'20A',a:20},{l:'MAX',a:30}]
const POUPANCA = 6.17

// ── Cálculos ─────────────────────────────────────────────
function calcular({ principal, taxaAnual, anos, ipca, ativo, cdi }) {
  const meses = anos * 12
  const taxaMensal = Math.pow(1 + taxaAnual/100, 1/12) - 1
  const bruto = principal * Math.pow(1 + taxaMensal, meses)
  const lucro = bruto - principal
  const ir = ativo.isento ? 0 : Math.max(0, lucro) * (ativo.ir/100)
  const liquido = bruto - ir
  const poderCorrigido = principal * Math.pow(1 + ipca/100, anos)
  const perdaInf = Math.max(0, poderCorrigido - principal)
  const ganhoReal = liquido - poderCorrigido
  const taxaReal = ((1+taxaAnual/100)/(1+ipca/100)-1)*100

  const historico = []
  for (let a = 0; a <= anos; a++) {
    const m = a * 12
    const s = principal * Math.pow(1 + taxaMensal, m)
    const l = s - Math.max(0, s-principal) * (ativo.isento ? 0 : ativo.ir/100)
    const entry = {
      ano: a, liquido: Math.round(l),
      poder: Math.round(principal * Math.pow(1+ipca/100, a)),
      poupanca: Math.round(principal * Math.pow(1+POUPANCA/100, a)),
    }
    if (cdi) entry.cdi = Math.round(principal * Math.pow(1+cdi/100, a))
    historico.push(entry)
  }
  return { bruto, liquido, lucro, ir, perdaInf, ganhoReal, taxaReal, historico }
}

// ── Helpers de componentes ────────────────────────────────
function Label({ children }) {
  return <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.11em', color: C.gray400, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>{children}</p>
}

function IRPill({ isento, ir }) {
  if (isento) return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.greenL, color: C.green }}>Isento</span>
  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: C.accentL, color: C.accent }}>IR {ir}%</span>
}

function Slider({ label, value, min, max, step, onChange, display, badge }) {
  const pct = ((value-min)/(max-min))*100
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.textSec }}>{label}</span>
          {badge && <span style={{ fontSize: 9, fontWeight: 700, color: C.green, background: C.greenL, padding: '1px 6px', borderRadius: 3 }}>{badge}</span>}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy800, fontFamily: 'Sora, sans-serif' }}>{display}</span>
      </div>
      <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 9, height: 4, borderRadius: 2, background: C.gray200 }} />
        <div style={{ position: 'absolute', left: 0, top: 9, height: 4, borderRadius: 2, width: `${pct}%`, background: C.accent }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'absolute', width: '100%', opacity: 0, height: 22, cursor: 'pointer', zIndex: 2 }} />
        <div style={{
          position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
          width: 16, height: 16, borderRadius: '50%', background: C.white,
          border: `2.5px solid ${C.accent}`, boxShadow: '0 1px 5px rgba(30,111,217,.25)', pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}

// ── Drawer de Análise ────────────────────────────────────
function DrawerAnalise({ open, onClose, recomendacoes, conceitos }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(11,20,38,0.45)', zIndex: 400, backdropFilter: 'blur(3px)' }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%', width: 'min(420px, 100vw)',
        background: C.white, boxShadow: '-8px 0 40px rgba(11,20,38,.14)',
        zIndex: 401, display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: C.text }}>Análise & Recomendações</p>
            <p style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>Baseado na sua simulação atual</p>
          </div>
          <button onClick={onClose} style={{ background: C.gray100, border: 'none', cursor: 'pointer', borderRadius: 8, padding: '6px 10px', fontSize: 16, color: C.gray500 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Recomendações */}
          {recomendacoes.length > 0 ? (
            <div style={{ marginBottom: 28 }}>
              <Label>Alertas personalizados</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recomendacoes.map((r, i) => {
                  const map = {
                    positivo: { bg: '#F0FDF4', border: '#BBF7D0', icon: '✓', ic: C.green, tc: '#166534' },
                    alerta:   { bg: '#FFFBEB', border: '#FDE68A', icon: '!', ic: C.amber, tc: '#92400E' },
                    info:     { bg: C.accentL, border: '#BFDBFE', icon: 'i', ic: C.accent, tc: '#1E40AF' },
                  }
                  const m = map[r.nivel] || map.info
                  return (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 10, background: m.bg, border: `1px solid ${m.border}` }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: m.ic, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{m.icon}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: m.tc, marginBottom: 3 }}>{r.titulo}</div>
                        <div style={{ fontSize: 11, color: C.gray600, lineHeight: 1.65 }}>{r.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ padding: '14px', borderRadius: 10, background: C.greenL, border: `1px solid #A7F3D0`, marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: '#065F46', fontWeight: 600 }}>✓ Sua simulação está ótima! Sem alertas neste momento.</p>
            </div>
          )}

          {/* Conceitos educacionais */}
          <Label>Conceitos essenciais</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conceitos.map((c, i) => (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: C.gray50, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: C.accentL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: C.accent, fontWeight: 700 }}>{c.icon}</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: 'Sora, sans-serif' }}>{c.titulo}</span>
                </div>
                <p style={{ fontSize: 12, color: C.gray500, lineHeight: 1.65, marginLeft: 36 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ══════════════════════════════════════════════════════════
// SIMULADOR PRINCIPAL
// ══════════════════════════════════════════════════════════
export default function Simulador() {
  const [principal, setPrincipal] = useState(10000)
  const [taxaAnual, setTaxaAnual] = useState(12)
  const [anos, setAnos] = useState(5)
  const [ipca, setIpca] = useState(4.5)
  const [cdi, setCdi] = useState(null)
  const [ativoSel, setAtivoSel] = useState('cdb_longo')
  const [grupoSel, setGrupoSel] = useState('Renda Fixa')
  const [filtro, setFiltro] = useState('5A')
  const [aba, setAba] = useState('resultado') // 'resultado' | 'benchmark'
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    buscarIPCA().then(v => setIpca(Number(v))).catch(() => {})
    buscarCDI().then(v => setCdi(Number(v))).catch(() => {})
  }, [])

  const ativo = ATIVOS.find(a => a.id === ativoSel)

  const res = useMemo(() => calcular({ principal, taxaAnual, anos, ipca, ativo, cdi }), [principal, taxaAnual, anos, ipca, ativo, cdi])

  const isPositive = res.ganhoReal >= 0
  const vsCdi = cdi ? (taxaAnual - cdi).toFixed(2) : null

  // Recomendações
  const recomendacoes = useMemo(() => {
    const r = []
    if (!ativo.isento && ativo.ir > 15) r.push({ nivel: 'info', titulo: 'Considere ativo isento de IR', desc: 'LCI ou LCA com taxa equivalente resulta em maior rendimento líquido.' })
    if (cdi && taxaAnual < cdi * 0.95) r.push({ nivel: 'alerta', titulo: 'Rentabilidade abaixo do CDI', desc: `Sua taxa (${formatarPorcentagem(taxaAnual)}) está abaixo do CDI (${formatarPorcentagem(cdi)}). Avalie CDBs com ao menos 100% CDI.` })
    if (anos < 2 && !ativo.isento && ativo.ir > 15) r.push({ nivel: 'info', titulo: 'Prazos maiores reduzem o IR', desc: 'Acima de 2 anos a alíquota cai de 22,5% para 15%.' })
    if (res.taxaReal > 8) r.push({ nivel: 'positivo', titulo: 'Excelente rentabilidade real', desc: `Taxa real de ${formatarPorcentagem(res.taxaReal)} a.a. supera a maioria dos ativos conservadores.` })
    if (res.ganhoReal < 0) r.push({ nivel: 'alerta', titulo: 'Abaixo da inflação', desc: 'O investimento não está preservando o poder de compra. Considere ativos indexados ao IPCA.' })
    return r.slice(0, 4)
  }, [ativo, cdi, taxaAnual, anos, res])

  const conceitos = [
    { icon: '∞', titulo: 'Juros compostos', desc: 'O rendimento incide sobre o capital acumulado. O efeito cresce exponencialmente com o tempo.' },
    { icon: '%', titulo: 'IR regressivo', desc: 'Alíquota cai de 22,5% (< 6 meses) a 15% (> 2 anos). Prazos maiores = menos imposto.' },
    { icon: '≈', titulo: 'Taxa real', desc: 'Taxa nominal descontada a inflação. 12% bruto com 4,5% de IPCA resulta em ~7,2% real.' },
    { icon: '✓', titulo: 'Ativos isentos', desc: 'LCI, LCA, CRI e CRA não pagam IR para pessoas físicas, compensando taxas nominais menores.' },
  ]

  const ttStyle = {
    contentStyle: { background: C.navy900, border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, fontSize: 12, color: C.white, boxShadow: '0 8px 24px rgba(0,0,0,.25)' },
    labelStyle: { color: C.gray400, fontWeight: 600 },
    cursor: { stroke: C.gray300, strokeWidth: 1, strokeDasharray: '4 2' },
  }

  // Dados pizza
  const totalLucro = res.bruto - principal
  const pieData = [
    { name: 'Ganho real', value: Math.max(0, res.ganhoReal), color: C.green },
    { name: 'IR pago', value: res.ir, color: C.accent },
    { name: 'Inflação', value: res.perdaInf, color: C.red },
  ].filter(d => d.value > 0)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: white; border: 2.5px solid ${C.accent}; box-shadow: 0 1px 5px rgba(30,111,217,.25); cursor: pointer; }
        input[type=range]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: white; border: 2.5px solid ${C.accent}; cursor: pointer; }

        .sim-main { display: grid; grid-template-columns: 320px 1fr; gap: 20px; }
        .kpi-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }

        @media (max-width: 1100px) {
          .sim-main { grid-template-columns: 1fr; }
          .kpi-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .kpi-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <Navbar />

      {/* ── Barra de indicadores ── */}
      <div style={{ background: C.navy900, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 clamp(16px,4vw,40px)', display: 'flex', alignItems: 'center', overflowX: 'auto', gap: 0 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', flexShrink: 0, paddingRight: 18, borderRight: '1px solid rgba(255,255,255,.08)', height: 42, display: 'flex', alignItems: 'center' }}>
            Indicadores ao vivo
          </span>
          {[
            { l: 'IPCA', v: `${ipca.toFixed(2)}%`, cor: '#F87171' },
            cdi ? { l: 'CDI', v: `${cdi.toFixed(2)}%`, cor: '#60A5FA' } : null,
            { l: 'Poupança', v: `${POUPANCA}%`, cor: '#94A3B8' },
            { l: 'Selic', v: '13,75%', cor: '#A78BFA' },
          ].filter(Boolean).map(item => (
            <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 16px', height: 42, borderRight: '1px solid rgba(255,255,255,.05)', flexShrink: 0 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.cor }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{item.l}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.white, fontFamily: 'Sora, sans-serif' }}>{item.v} a.a.</span>
            </div>
          ))}
          {/* Fonte */}
          <div style={{ marginLeft: 'auto', padding: '0 16px', flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.2)' }}>Fonte: Banco Central do Brasil</span>
          </div>
        </div>
      </div>

      {/* ── Container ── */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(28px,3vw,40px) clamp(16px,4vw,40px)' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 4, height: 18, borderRadius: 2, background: C.accent }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '.1em' }}>Plataforma Veskan</span>
            </div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(20px,2.3vw,27px)', fontWeight: 800, color: C.text, letterSpacing: '-.4px', lineHeight: 1.2, marginBottom: 5 }}>
              Simulador de Investimentos
            </h1>
            <p style={{ fontSize: 13, color: C.textSec }}>Rentabilidade real — pós inflação, IR e taxas.</p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Botão análise */}
            <button onClick={() => setDrawerOpen(true)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: C.white, border: `1px solid ${C.border}`,
              borderRadius: 9, padding: '9px 16px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', color: C.textSec, transition: 'all .15s',
              fontFamily: 'DM Sans, sans-serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSec }}
            >
              {recomendacoes.length > 0 && (
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: C.accent, color: C.white, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {recomendacoes.length}
                </span>
              )}
              📋 Análise & Dicas
            </button>

            {/* Tabs resultado / benchmark */}
            <div style={{ display: 'flex', gap: 2, background: C.gray100, borderRadius: 9, padding: 3, border: `1px solid ${C.border}` }}>
              {[{ id: 'resultado', label: 'Resultado' }, { id: 'benchmark', label: 'Benchmark' }].map(t => (
                <button key={t.id} onClick={() => setAba(t.id)} style={{
                  fontSize: 13, fontWeight: 600, padding: '8px 18px',
                  background: aba === t.id ? C.white : 'transparent',
                  color: aba === t.id ? C.navy800 : C.gray500,
                  border: 'none', borderRadius: 7, cursor: 'pointer', transition: 'all .15s',
                  boxShadow: aba === t.id ? '0 1px 4px rgba(11,20,38,.1)' : 'none',
                  fontFamily: 'DM Sans, sans-serif',
                }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ LAYOUT PRINCIPAL ══ */}
        <div className="sim-main">

          {/* ─ Painel esquerdo: configurações ─ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Card: ativo */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 18px 14px', borderBottom: `1px solid ${C.border}` }}>
                <Label>Tipo de ativo</Label>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {GRUPOS.map(g => (
                    <button key={g} onClick={() => { setGrupoSel(g); const f = ATIVOS.find(a => a.grupo === g); if (f) setAtivoSel(f.id) }} style={{
                      fontSize: 11, padding: '4px 11px', borderRadius: 5, cursor: 'pointer',
                      border: grupoSel === g ? 'none' : `1px solid ${C.border}`,
                      background: grupoSel === g ? C.navy900 : 'transparent',
                      color: grupoSel === g ? C.white : C.gray500,
                      fontWeight: grupoSel === g ? 600 : 400, transition: 'all .12s',
                      fontFamily: 'DM Sans, sans-serif',
                    }}>{g}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '10px' }}>
                {ATIVOS.filter(a => a.grupo === grupoSel).map(a => {
                  const sel = ativoSel === a.id
                  return (
                    <button key={a.id} onClick={() => setAtivoSel(a.id)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '9px 11px', borderRadius: 7, cursor: 'pointer',
                      border: sel ? `1.5px solid ${C.accent}` : '1px solid transparent',
                      background: sel ? C.accentL : 'transparent',
                      transition: 'all .12s', textAlign: 'left', marginBottom: 3,
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                      onMouseEnter={e => { if (!sel) { e.currentTarget.style.background = C.gray50; e.currentTarget.style.borderColor = C.gray200 } }}
                      onMouseLeave={e => { if (!sel) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: sel ? C.accent : C.text, marginBottom: 1 }}>{a.label}</div>
                        <div style={{ fontSize: 11, color: C.gray400 }}>{a.sub}</div>
                      </div>
                      <IRPill isento={a.isento} ir={a.ir} />
                    </button>
                  )
                })}
              </div>
              {ativo && (
                <div style={{ margin: '0 10px 10px', padding: '9px 11px', background: C.gray50, borderRadius: 7, border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: 11, color: C.gray500, lineHeight: 1.6 }}>ℹ️ {ativo.info}</p>
                </div>
              )}
            </div>

            {/* Card: parâmetros */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px' }}>
              <Label>Parâmetros</Label>
              <Slider label="Valor inicial" value={principal} min={1000} max={500000} step={1000} onChange={setPrincipal} display={formatarMoeda(principal)} />
              <Slider label="Taxa anual bruta" value={taxaAnual} min={1} max={30} step={0.5} onChange={setTaxaAnual} display={formatarPorcentagem(taxaAnual)} />
              <Slider label="Período" value={anos} min={1} max={30} step={1} onChange={v => { setAnos(v); setFiltro(null) }} display={`${anos} ${anos===1?'ano':'anos'}`} />
              <Slider label="Inflação (IPCA)" value={ipca} min={1} max={20} step={0.1} onChange={setIpca} display={formatarPorcentagem(ipca)} badge="ao vivo" />

              {/* Mini resumo */}
              <div style={{ marginTop: 4, padding: '12px 14px', background: C.navy900, borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', lineHeight: 1.9 }}>
                  {formatarMoeda(principal)} a {formatarPorcentagem(taxaAnual)} a.a. por {anos} {anos===1?'ano':'anos'}
                  {!ativo.isento ? ` · IR ${ativo.ir}%` : ' · Isento IR'} →{' '}
                  <strong style={{ color: '#93C5FD' }}>{formatarMoeda(res.liquido)}</strong> líquido
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.07)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>Ganho real</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: isPositive ? '#86EFAC' : '#FCA5A5', fontFamily: 'Sora, sans-serif' }}>
                    {isPositive ? '+' : ''}{formatarMoeda(res.ganhoReal)}
                  </span>
                </div>
              </div>
            </div>

          </div>
          {/* ── FIM painel esquerdo ── */}

          {/* ─ Painel direito: resultados ─ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* ══ ABA RESULTADO ══ */}
            {aba === 'resultado' && (
              <>
                {/* Status banner */}
                <div style={{
                  background: isPositive ? 'linear-gradient(90deg,#064E3B,#065F46)' : 'linear-gradient(90deg,#7F1D1D,#991B1B)',
                  borderRadius: 12, padding: '14px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                }}>
                  <div>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>Status</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: 'Sora, sans-serif' }}>
                      {isPositive ? '✓ Batendo a inflação' : '✕ Abaixo da inflação'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Ganho real líquido</p>
                      <p style={{ fontSize: 24, fontWeight: 800, color: isPositive ? '#86EFAC' : '#FCA5A5', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>
                        {isPositive ? '+' : ''}{formatarMoeda(res.ganhoReal)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Taxa real</p>
                      <p style={{ fontSize: 24, fontWeight: 800, color: isPositive ? '#86EFAC' : '#FCA5A5', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>
                        {formatarPorcentagem(res.taxaReal)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div className="kpi-row">
                  {[
                    { l: 'Montante líquido', v: formatarMoeda(res.liquido), s: ativo.isento ? 'Isento de IR' : `IR: ${formatarMoeda(res.ir)}` },
                    { l: 'Montante bruto', v: formatarMoeda(res.bruto), s: 'Antes dos impostos' },
                    { l: 'Impostos pagos', v: formatarMoeda(res.ir), s: ativo.isento ? 'Isento' : `Alíquota ${ativo.ir}%` },
                    { l: 'Corroído inflação', v: formatarMoeda(res.perdaInf), s: `IPCA ${formatarPorcentagem(ipca)}` },
                  ].map(k => (
                    <div key={k.l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 11, padding: '14px 16px', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(11,20,38,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      <p style={{ fontSize: 10, fontWeight: 700, color: C.gray400, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 7 }}>{k.l}</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: C.text, fontFamily: 'Sora, sans-serif', lineHeight: 1, marginBottom: 4 }}>{k.v}</p>
                      <p style={{ fontSize: 11, color: C.gray400 }}>{k.s}</p>
                    </div>
                  ))}
                </div>

                {/* Gráfico + pizza lado a lado */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

                  {/* Gráfico de evolução */}
                  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                      <Label>Evolução patrimonial</Label>
                      <div style={{ display: 'flex', gap: 3, background: C.gray100, borderRadius: 6, padding: 3 }}>
                        {FILTROS.map(f => (
                          <button key={f.l} onClick={() => { setFiltro(f.l); setAnos(f.a) }} style={{
                            fontSize: 10, padding: '3px 8px', borderRadius: 4, cursor: 'pointer', border: 'none',
                            background: filtro === f.l ? C.white : 'transparent',
                            color: filtro === f.l ? C.navy800 : C.gray400,
                            fontWeight: filtro === f.l ? 700 : 400, transition: 'all .12s',
                            boxShadow: filtro === f.l ? '0 1px 3px rgba(0,0,0,.1)' : 'none',
                            fontFamily: 'DM Sans, sans-serif',
                          }}>{f.l}</button>
                        ))}
                      </div>
                    </div>
                    {/* Legenda */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
                      {[{ c: C.accent, l: 'Saldo líquido' }, { c: C.red, l: 'Poder de compra' }, cdi ? { c: C.blue, l: 'CDI' } : null, { c: C.gray300, l: 'Poupança' }].filter(Boolean).map(l => (
                        <div key={l.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 18, height: 2, background: l.c, borderRadius: 1 }} />
                          <span style={{ fontSize: 10, color: C.gray500 }}>{l.l}</span>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={res.historico} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={C.accent} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} vertical={false} />
                        <XAxis dataKey="ano" stroke={C.gray200} tick={{ fontSize: 10, fill: C.gray400 }} tickFormatter={v => `A${v}`} />
                        <YAxis stroke={C.gray200} tick={{ fontSize: 9, fill: C.gray400 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} width={48} />
                        <Tooltip {...ttStyle} formatter={v => formatarMoeda(v)} labelFormatter={v => `Ano ${v}`} />
                        <Area type="monotone" dataKey="liquido" name="Saldo" stroke={C.accent} strokeWidth={2.5} fill="url(#gB)" dot={false} />
                        <Area type="monotone" dataKey="poder" name="Poder compra" stroke={C.red} strokeWidth={1.8} fill="none" dot={false} strokeDasharray="6 4" />
                        {cdi && <Area type="monotone" dataKey="cdi" name="CDI" stroke={C.blue} strokeWidth={1.5} fill="none" dot={false} strokeDasharray="3 3" />}
                        <Area type="monotone" dataKey="poupanca" name="Poupança" stroke={C.gray300} strokeWidth={1.5} fill="none" dot={false} strokeDasharray="3 3" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pizza distribuição */}
                  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px' }}>
                    <Label>Distribuição do rendimento</Label>
                    {totalLucro > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={130}>
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value" stroke="none">
                              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: C.navy900, border: 'none', borderRadius: 8, fontSize: 11, color: C.white }} formatter={v => formatarMoeda(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                          {pieData.map((d, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                                <span style={{ fontSize: 11, color: C.gray600 }}>{d.name}</span>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>{((d.value/totalLucro)*100).toFixed(1)}%</span>
                            </div>
                          ))}
                          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 11, color: C.gray500 }}>Rendimento bruto</span>
                            <span style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: 'Sora, sans-serif' }}>{formatarMoeda(totalLucro)}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: 12, color: C.gray400, textAlign: 'center', padding: '20px 0' }}>Sem rendimento positivo neste período.</p>
                    )}
                  </div>
                </div>

                {/* Tabela ano a ano */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
                    <Label>Projeção ano a ano</Label>
                  </div>
                  <div style={{ overflowX: 'auto', maxHeight: 300, overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr style={{ background: C.gray50 }}>
                          {['Ano','Saldo líquido','Poder de compra','Ganho real', cdi ? 'CDI' : null, 'Poupança'].filter(Boolean).map(h => (
                            <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.gray400, textTransform: 'uppercase', letterSpacing: '.07em', whiteSpace: 'nowrap', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {res.historico.map(row => {
                          const gr = row.liquido - row.poder
                          return (
                            <tr key={row.ano} style={{ borderTop: `1px solid ${C.border}`, background: C.bgCard, transition: 'background .1s' }}
                              onMouseEnter={e => e.currentTarget.style.background = C.gray50}
                              onMouseLeave={e => e.currentTarget.style.background = C.bgCard}
                            >
                              <td style={{ padding: '9px 14px', fontWeight: 700, color: C.text, fontFamily: 'Sora, sans-serif' }}>Ano {row.ano}</td>
                              <td style={{ padding: '9px 14px', color: C.accent, fontWeight: 600 }}>{formatarMoeda(row.liquido)}</td>
                              <td style={{ padding: '9px 14px', color: C.gray600 }}>{formatarMoeda(row.poder)}</td>
                              <td style={{ padding: '9px 14px', color: gr >= 0 ? C.green : C.red, fontWeight: 600 }}>{gr >= 0 ? '+' : ''}{formatarMoeda(gr)}</td>
                              {cdi && <td style={{ padding: '9px 14px', color: C.blue }}>{formatarMoeda(row.cdi)}</td>}
                              <td style={{ padding: '9px 14px', color: C.gray400 }}>{formatarMoeda(row.poupanca)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ══ ABA BENCHMARK ══ */}
            {aba === 'benchmark' && (
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px' }}>
                <Label>Comparativo com benchmarks · {anos} {anos===1?'ano':'anos'} · {formatarMoeda(principal)}</Label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
                  {[
                    { l: 'Seu investimento', taxa: taxaAnual, ir: ativo.ir, isento: ativo.isento, c: C.accent, dest: true },
                    { l: 'CDI', taxa: cdi || 10.65, ir: 15, isento: false, c: C.blue },
                    { l: 'IPCA', taxa: ipca, ir: 0, isento: true, c: C.red },
                    { l: 'Poupança', taxa: POUPANCA, ir: 0, isento: true, c: C.gray400 },
                  ].map(b => {
                    const tm = Math.pow(1+b.taxa/100,1/12)-1
                    const mont = principal * Math.pow(1+tm, anos*12)
                    const luc = mont - principal
                    const liq = mont - (b.isento ? 0 : Math.max(0,luc)*b.ir/100)
                    const ganho = liq - principal
                    return (
                      <div key={b.l} style={{
                        background: b.dest ? C.navy900 : C.gray50,
                        border: b.dest ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                        borderRadius: 12, padding: '16px', transition: 'transform .15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: b.c }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: b.dest ? C.white : C.text, fontFamily: 'Sora, sans-serif' }}>{b.l}</span>
                        </div>
                        <div style={{ fontSize: 11, color: b.dest ? 'rgba(255,255,255,.4)' : C.gray400, marginBottom: 2 }}>Taxa: <strong style={{ color: b.dest ? C.white : C.text }}>{formatarPorcentagem(b.taxa)}</strong></div>
                        <div style={{ fontSize: 11, color: b.dest ? 'rgba(255,255,255,.4)' : C.gray400, marginBottom: 12 }}>IR: <strong style={{ color: b.dest ? C.white : C.text }}>{b.isento ? 'Isento' : `${b.ir}%`}</strong></div>
                        <p style={{ fontSize: 9, color: b.dest ? 'rgba(255,255,255,.3)' : C.gray400, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>Montante líquido</p>
                        <p style={{ fontSize: 18, fontWeight: 800, color: b.c, fontFamily: 'Sora, sans-serif', marginBottom: 3 }}>{formatarMoeda(liq)}</p>
                        <p style={{ fontSize: 12, color: ganho >= 0 ? C.green : C.red, fontWeight: 600 }}>{ganho >= 0 ? '+' : ''}{formatarMoeda(ganho)}</p>
                      </div>
                    )
                  })}
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={res.historico} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bBl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.accent} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} vertical={false} />
                    <XAxis dataKey="ano" stroke={C.gray200} tick={{ fontSize: 10, fill: C.gray400 }} tickFormatter={v => `Ano ${v}`} />
                    <YAxis stroke={C.gray200} tick={{ fontSize: 9, fill: C.gray400 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} width={48} />
                    <Tooltip {...ttStyle} formatter={v => formatarMoeda(v)} labelFormatter={v => `Ano ${v}`} />
                    <Area type="monotone" dataKey="liquido" name="Seu investimento" stroke={C.accent} strokeWidth={2.5} fill="url(#bBl)" dot={false} />
                    {cdi && <Area type="monotone" dataKey="cdi" name="CDI" stroke={C.blue} strokeWidth={1.8} fill="none" dot={false} />}
                    <Area type="monotone" dataKey="poupanca" name="Poupança" stroke={C.gray300} strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="poder" name="IPCA" stroke={C.red} strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>
          {/* ── FIM painel direito ── */}

        </div>
        {/* ══ FIM LAYOUT PRINCIPAL ══ */}

        {/* ══ SEÇÃO: Conceitos Educacionais ══ */}
        <div style={{ marginTop: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '.12em', background: C.accentL, padding: '4px 12px', borderRadius: 100, border: '1px solid #BFDBFE' }}>Educação financeira</span>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 800, color: C.text, letterSpacing: '-.4px', marginTop: 12, marginBottom: 8 }}>
              Entenda os conceitos por trás da simulação
            </h2>
            <p style={{ fontSize: 14, color: C.textSec }}>Esses fatores impactam diretamente o resultado que você vê acima.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { icon: '∞', titulo: 'Juros compostos', desc: 'O rendimento incide sobre o capital acumulado. Com o tempo, pequenas diferenças de taxa geram grandes diferenças no resultado final.', cor: C.accent },
              { icon: '%', titulo: 'IR regressivo', desc: 'A alíquota cai progressivamente: 22,5% (até 6 meses), 20% (6m–1a), 17,5% (1–2a) e 15% (acima de 2 anos). Investir por mais tempo paga menos IR.', cor: C.green },
              { icon: '≈', titulo: 'Taxa real x nominal', desc: 'A taxa real desconta a inflação. Um rendimento de 12% ao ano com inflação de 5% resulta em apenas ~6,7% de ganho real de poder de compra.', cor: C.amber },
              { icon: '✓', titulo: 'Ativos isentos de IR', desc: 'LCI, LCA, CRI e CRA não pagam IR para pessoa física. Um LCI com 10% isento pode superar um CDB com 12% após o desconto do imposto.', cor: C.greenMid },
            ].map((c, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px', cursor: 'default', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.cor; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${c.cor}18` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.cor}15`, border: `1px solid ${c.cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: c.cor, fontWeight: 700, marginBottom: 14 }}>{c.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 7, fontFamily: 'Sora, sans-serif' }}>{c.titulo}</h3>
                <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 36, background: `linear-gradient(135deg, ${C.navy900}, #0F1E35)`, borderRadius: 16, padding: 'clamp(24px,4vw,36px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 6 }}>Quer desbloquear IR automático e aportes mensais?</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>Faça upgrade para o Premium e desbloqueie análises avançadas.</p>
          </div>
          <button style={{ background: C.accent, color: C.white, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '12px 26px', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1B5EC7'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = 'none' }}
          >Ver planos Premium →</button>
        </div>

      </div>

      {/* ── Drawer ── */}
      <DrawerAnalise open={drawerOpen} onClose={() => setDrawerOpen(false)} recomendacoes={recomendacoes} conceitos={conceitos} />

      <Footer />
    </div>
  )
}