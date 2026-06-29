import { useState, useEffect } from 'react'

const STEPS = [
  { title: 'Selecione o tipo de ativo', desc: 'Escolha entre CDB, LCI, Ações, FIIs e mais. Cada um tem regras de IR diferentes.', icon: '🎯' },
  { title: 'Configure os parâmetros', desc: 'Defina o valor que vai investir, a taxa anual e o prazo. O IPCA já vem atualizado automaticamente.', icon: '⚙️' },
  { title: 'Veja o resultado real', desc: 'O ganho real já desconta inflação, IR e taxas. É o número que realmente importa.', icon: '📊' },
  { title: 'Compare com benchmarks', desc: 'Clique na aba "Benchmark" para comparar seu investimento com CDI, IPCA e Poupança.', icon: '🏆' },
]

export default function Tutorial() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem('veskan-tutorial-done')
    if (!done) setTimeout(() => setVisible(true), 800)
  }, [])

  function finish() {
    localStorage.setItem('veskan-tutorial-done', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      <div onClick={finish} style={{ position: 'fixed', inset: 0, background: 'rgba(11,22,41,0.4)', zIndex: 800, backdropFilter: 'blur(2px)' }} />
      <div style={{
        position: 'fixed', bottom: 32, right: 32, zIndex: 900,
        background: '#fff', borderRadius: 20, padding: '24px 26px',
        boxShadow: '0 24px 64px rgba(11,22,41,.18)',
        border: '1px solid #E2E6ED',
        maxWidth: 320, width: 'calc(100vw - 64px)',
      }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? '#C9A84C' : '#E2E6ED', transition: 'background .3s' }} />
          ))}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, marginBottom: 14, background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
          {STEPS[step].icon}
        </div>
        <div style={{ fontSize: 11, color: '#C9A84C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
          Passo {step + 1} de {STEPS.length}
        </div>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 700, color: '#0B1629', marginBottom: 8 }}>
          {STEPS[step].title}
        </h3>
        <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, marginBottom: 20 }}>
          {STEPS[step].desc}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={finish} style={{ flex: 1, background: '#F5F6F8', border: '1px solid #E2E6ED', borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
            Pular
          </button>
          <button onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : finish()} style={{ flex: 2, background: '#0B1629', border: 'none', borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#C9A84C', fontFamily: 'Inter, sans-serif' }}>
            {step < STEPS.length - 1 ? 'Próximo →' : 'Começar!'}
          </button>
        </div>
      </div>
    </>
  )
}