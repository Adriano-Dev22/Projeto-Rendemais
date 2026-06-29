import { useEffect, useRef } from 'react'

export default function Hero3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Dados do gráfico de barras 3D
    const bars = [
      { x: 0.15, h: 0.35, color: '#C9A84C' },
      { x: 0.28, h: 0.52, color: '#E8C96A' },
      { x: 0.41, h: 0.44, color: '#C9A84C' },
      { x: 0.54, h: 0.68, color: '#E8C96A' },
      { x: 0.67, h: 0.58, color: '#C9A84C' },
      { x: 0.80, h: 0.82, color: '#E8C96A' },
    ]

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)
      t += 0.012

      // Grade de fundo
      ctx.strokeStyle = 'rgba(201,168,76,0.07)'
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = H * 0.15 + (H * 0.65 / 5) * i
        ctx.beginPath()
        ctx.moveTo(W * 0.08, y)
        ctx.lineTo(W * 0.92, y)
        ctx.stroke()
      }

      // Linha de tendência animada
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(232,201,106,0.4)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 4])
      bars.forEach((b, i) => {
        const x = W * b.x + W * 0.05
        const baseY = H * 0.82
        const topY = baseY - H * 0.65 * b.h * (0.7 + 0.3 * Math.sin(t + i * 0.5))
        if (i === 0) ctx.moveTo(x, topY)
        else ctx.lineTo(x, topY)
      })
      ctx.stroke()
      ctx.setLineDash([])

      // Barras 3D
      bars.forEach((b, i) => {
        const W2 = W
        const x = W2 * b.x
        const bw = W2 * 0.09
        const baseY = H * 0.82
        const animH = H * 0.65 * b.h * (0.85 + 0.15 * Math.sin(t + i * 0.6))
        const topY = baseY - animH
        const depth = 8

        // Face frontal
        const grad = ctx.createLinearGradient(x, topY, x, baseY)
        grad.addColorStop(0, b.color)
        grad.addColorStop(1, b.color + '88')
        ctx.fillStyle = grad
        ctx.fillRect(x, topY, bw, animH)

        // Face superior (efeito 3D)
        ctx.fillStyle = b.h > 0.6 ? '#ffe9a0' : '#dbb85a'
        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x + depth, topY - depth * 0.5)
        ctx.lineTo(x + bw + depth, topY - depth * 0.5)
        ctx.lineTo(x + bw, topY)
        ctx.closePath()
        ctx.fill()

        // Face lateral (efeito 3D)
        ctx.fillStyle = 'rgba(0,0,0,0.25)'
        ctx.beginPath()
        ctx.moveTo(x + bw, topY)
        ctx.lineTo(x + bw + depth, topY - depth * 0.5)
        ctx.lineTo(x + bw + depth, baseY - depth * 0.5)
        ctx.lineTo(x + bw, baseY)
        ctx.closePath()
        ctx.fill()
      })

      // Seta ascendente animada
      const arrowX = W * 0.85
      const arrowY = H * 0.22 + Math.sin(t * 1.5) * 6
      ctx.strokeStyle = 'var(--gold-light)'
      ctx.fillStyle = '#E8C96A'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(arrowX - 18, arrowY + 12)
      ctx.lineTo(arrowX, arrowY)
      ctx.lineTo(arrowX + 18, arrowY + 12)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(arrowX, arrowY + 30)
      ctx.stroke()

      // Label flutuante
      ctx.fillStyle = 'rgba(201,168,76,0.9)'
      ctx.font = 'bold 11px DM Sans, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('+7,55%', W * 0.8 + W * 0.04, H * 0.12 + Math.sin(t) * 3)

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-label="Gráfico animado de crescimento patrimonial"
      role="img"
    />
  )
}