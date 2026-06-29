import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem('veskan-theme') === 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('veskan-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={dark ? 'Modo claro' : 'Modo escuro'}
      style={{
        width: 40, height: 40,
        borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}