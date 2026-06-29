import { useEffect, useRef, useState } from 'react'
import logoImg from '../assets/logo.png'

// ---------- helpers (pure, no React deps) ----------

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const easeOutExpo = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

// distributes N points evenly across a unit sphere
function fibonacciSphere(samples) {
  const pts = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2
    const radius = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = phi * i
    pts.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius })
  }
  return pts
}

function rotateX(p, a) {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
}
function rotateY(p, a) {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }
}

// connects each point to its k nearest neighbours -> a clean "network" wireframe
function buildKnnEdges(basePts, k) {
  const edges = []
  const seen = new Set()
  for (let i = 0; i < basePts.length; i++) {
    const dists = []
    for (let j = 0; j < basePts.length; j++) {
      if (i === j) continue
      const dx = basePts[i].x - basePts[j].x, dy = basePts[i].y - basePts[j].y, dz = basePts[i].z - basePts[j].z
      dists.push([j, dx * dx + dy * dy + dz * dz])
    }
    dists.sort((a, b) => a[1] - b[1])
    for (let n = 0; n < k; n++) {
      const j = dists[n][0]
      const key = i < j ? `${i}_${j}` : `${j}_${i}`
      if (!seen.has(key)) { seen.add(key); edges.push([i, j]) }
    }
  }
  return edges
}

function project(p, cx, cy, radiusPx, camDist) {
  const f = camDist / (camDist - p.z)
  return { x: cx + p.x * radiusPx * f, y: cy + p.y * radiusPx * f, scale: f }
}

// the hero growth line — trend up, with natural pullbacks
function buildChartPoints(W, H) {
  const cx = W / 2, w = W * 0.36, startX = cx - w / 2, endX = cx + w / 2
  const baseY = H * 0.66, topY = H * 0.38, range = baseY - topY
  return [
    { x: startX, y: baseY },
    { x: startX + w * .10, y: baseY - range * .12 },
    { x: startX + w * .20, y: baseY - range * .28 },
    { x: startX + w * .28, y: baseY - range * .18 },
    { x: startX + w * .38, y: baseY - range * .42 },
    { x: startX + w * .47, y: baseY - range * .32 },
    { x: startX + w * .57, y: baseY - range * .56 },
    { x: startX + w * .65, y: baseY - range * .46 },
    { x: startX + w * .75, y: baseY - range * .72 },
    { x: startX + w * .84, y: baseY - range * .62 },
    { x: endX, y: topY },
  ]
}

function makeNoisePattern(ctx) {
  const size = 64
  const c = document.createElement('canvas')
  c.width = size; c.height = size
  const nctx = c.getContext('2d')
  const img = nctx.createImageData(size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 180 + Math.random() * 40
    img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v
    img.data[i + 3] = Math.random() * 16
  }
  nctx.putImageData(img, 0, 0)
  return ctx.createPattern(c, 'repeat')
}

const RING_R = 37
const RING_C = 2 * Math.PI * RING_R

export default function IntroScreen() {
  const canvasRef = useRef(null)
  const iconWrapRef = useRef(null)
  const lastPctRef = useRef(-1)

  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [logoIn, setLogoIn] = useState(false)
  const [sweepIn, setSweepIn] = useState(false)
  const [progress, setProgress] = useState(0)

  // entrance choreography
  useEffect(() => {
    const t = setTimeout(() => setLogoIn(true), 300)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (!logoIn) return
    const t = setTimeout(() => setSweepIn(true), 750)
    return () => clearTimeout(t)
  }, [logoIn])

  // subtle pointer-driven 3D tilt on the logo card
  useEffect(() => {
    const handleMove = e => {
      const el = iconWrapRef.current
      if (!el) return
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      el.style.transform = `rotateX(${clamp(-dy * 10, -10, 10)}deg) rotateY(${clamp(dx * 10, -10, 10)}deg)`
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const noisePattern = makeNoisePattern(ctx)

    // ambient bokeh — depth without clutter
    const bokeh = Array.from({ length: 14 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 16 + 8,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      a: Math.random() * 0.06 + 0.02,
    }))

    // signature element: a slowly rotating 3D network sphere
    const SPHERE_N = 60
    const baseSphere = fibonacciSphere(SPHERE_N)
    const tiltedSphere = baseSphere.map(p => rotateX(p, 0.5))
    const sphereEdges = buildKnnEdges(tiltedSphere, 2)

    const DURATION = 2800
    let start = null, animId

    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)()
      if (ac.state === 'suspended') ac.resume()
      const filter = ac.createBiquadFilter()
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(1200, ac.currentTime)
      filter.connect(ac.destination)
      const g = ac.createGain()
      g.connect(filter)
      g.gain.setValueAtTime(0, ac.currentTime)
      g.gain.linearRampToValueAtTime(0.04, ac.currentTime + 0.12)
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.7)
      ;[200, 300].forEach(freq => {
        const o = ac.createOscillator()
        o.type = 'sine'
        o.connect(g)
        o.frequency.setValueAtTime(freq, ac.currentTime)
        o.frequency.exponentialRampToValueAtTime(freq * 2.1, ac.currentTime + 1.3)
        o.start(ac.currentTime); o.stop(ac.currentTime + 1.7)
      })
    } catch (_) {}

    const draw = ts => {
      if (!start) start = ts
      const prog = Math.min((ts - start) / DURATION, 1)
      const eased = easeOutExpo(prog)
      const W = canvas.width, H = canvas.height

      const pct = Math.round(eased * 100)
      if (pct !== lastPctRef.current) { lastPctRef.current = pct; setProgress(pct) }

      ctx.clearRect(0, 0, W, H)

      // backdrop
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, '#060c18'); bg.addColorStop(1, '#0d1a30')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

      // film grain
      ctx.fillStyle = noisePattern; ctx.fillRect(0, 0, W, H)

      // vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, Math.max(W, H) * 0.72)
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)')
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)

      // bokeh
      bokeh.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < -40) p.x = W + 40; if (p.x > W + 40) p.x = -40
        if (p.y < -40) p.y = H + 40; if (p.y > H + 40) p.y = -40
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        g.addColorStop(0, `rgba(96,165,250,${p.a * eased})`); g.addColorStop(1, 'rgba(96,165,250,0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      })

      // rotating 3D network sphere
      const sphereCx = W / 2, sphereCy = H * 0.40, sphereR = Math.min(W, H) * 0.30
      const angle = ts * 0.00018
      const projected = tiltedSphere.map(p => project(rotateY(p, angle), sphereCx, sphereCy, sphereR, 3))

      sphereEdges.forEach(([i, j]) => {
        const a = projected[i], b = projected[j]
        const s = (a.scale + b.scale) / 2
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(96,165,250,${0.10 * s * eased})`; ctx.lineWidth = 0.6; ctx.stroke()
      })
      projected.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.3 * p.scale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(96,165,250,${0.32 * p.scale * eased})`; ctx.fill()
      })

      // central halo
      const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.4)
      glow.addColorStop(0, `rgba(30,111,217,${0.08 * eased})`); glow.addColorStop(1, 'rgba(30,111,217,0)')
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H)

      // hero chart + glass card
      if (prog > 0.06) {
        const chart = buildChartPoints(W, H)
        const minX = chart[0].x, maxX = chart[chart.length - 1].x
        const minY = chart[chart.length - 1].y, maxY = chart[0].y
        const padX = 42, padTop = 60, padBottom = 66
        const card = { x: minX - padX, y: minY - padTop, w: (maxX - minX) + padX * 2, h: (maxY - minY) + padTop + padBottom }

        // card shell
        ctx.save()
        ctx.shadowColor = 'rgba(4,8,16,0.55)'; ctx.shadowBlur = 44; ctx.shadowOffsetY = 20
        ctx.fillStyle = `rgba(13,26,48,${0.40 * eased})`
        ctx.beginPath(); ctx.roundRect(card.x, card.y, card.w, card.h, 22); ctx.fill()
        ctx.restore()

        const borderG = ctx.createLinearGradient(card.x, card.y, card.x, card.y + card.h)
        borderG.addColorStop(0, `rgba(96,165,250,${0.30 * eased})`)
        borderG.addColorStop(1, `rgba(30,111,217,${0.06 * eased})`)
        ctx.beginPath(); ctx.roundRect(card.x, card.y, card.w, card.h, 22)
        ctx.lineWidth = 1; ctx.strokeStyle = borderG; ctx.stroke()

        ctx.beginPath(); ctx.moveTo(card.x + 22, card.y + 1); ctx.lineTo(card.x + card.w - 22, card.y + 1)
        ctx.strokeStyle = `rgba(255,255,255,${0.06 * eased})`; ctx.lineWidth = 1; ctx.stroke()

        // chart reveal
        const chartProg = Math.min((prog - 0.06) / 0.66, 1)
        const ce = easeOutExpo(chartProg)
        const total = chart.length - 1
        const curLen = ce * total
        const full = Math.floor(curLen), part = curLen - full

        let ex = chart[0].x, ey = chart[0].y
        if (full < chart.length - 1) {
          ex = chart[full].x + (chart[full + 1].x - chart[full].x) * part
          ey = chart[full].y + (chart[full + 1].y - chart[full].y) * part
        } else { ex = chart[chart.length - 1].x; ey = chart[chart.length - 1].y }

        const baseLineY = chart[0].y

        // area under curve
        const areaG = ctx.createLinearGradient(0, ey, 0, baseLineY)
        areaG.addColorStop(0, 'rgba(30,111,217,0.18)'); areaG.addColorStop(1, 'rgba(30,111,217,0)')
        ctx.beginPath()
        ctx.moveTo(chart[0].x, chart[0].y)
        for (let i = 1; i <= full && i < chart.length; i++) ctx.lineTo(chart[i].x, chart[i].y)
        ctx.lineTo(ex, ey); ctx.lineTo(ex, baseLineY); ctx.closePath()
        ctx.fillStyle = areaG; ctx.fill()

        // reflection (mirrored, faded into the card floor)
        ctx.beginPath()
        ctx.moveTo(chart[0].x, baseLineY)
        for (let i = 1; i <= full && i < chart.length; i++) ctx.lineTo(chart[i].x, 2 * baseLineY - chart[i].y)
        ctx.lineTo(ex, 2 * baseLineY - ey)
        ctx.strokeStyle = `rgba(96,165,250,${0.14 * eased})`; ctx.lineWidth = 1.4; ctx.stroke()

        const fadeG = ctx.createLinearGradient(0, baseLineY, 0, card.y + card.h)
        fadeG.addColorStop(0, 'rgba(13,26,48,0)')
        fadeG.addColorStop(1, `rgba(13,26,48,${0.95 * eased})`)
        ctx.fillStyle = fadeG
        ctx.fillRect(card.x, baseLineY, card.w, (card.y + card.h) - baseLineY)

        // main line
        const lineG = ctx.createLinearGradient(chart[0].x, 0, ex, 0)
        lineG.addColorStop(0, 'rgba(30,111,217,0.5)'); lineG.addColorStop(1, '#60A5FA')
        ctx.beginPath()
        ctx.moveTo(chart[0].x, chart[0].y)
        for (let i = 1; i <= full && i < chart.length; i++) ctx.lineTo(chart[i].x, chart[i].y)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = lineG; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke()

        // pulsing tip
        const pulse = 1 + Math.sin(ts * 0.006) * 0.35
        const dg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 18 * pulse)
        dg.addColorStop(0, 'rgba(96,165,250,0.4)'); dg.addColorStop(1, 'rgba(96,165,250,0)')
        ctx.beginPath(); ctx.arc(ex, ey, 18 * pulse, 0, Math.PI * 2); ctx.fillStyle = dg; ctx.fill()
        ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI * 2); ctx.fillStyle = '#60A5FA'; ctx.fill()
        ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()

        // trend badge near the end
        const badgeA = clamp((chartProg - 0.85) / 0.15, 0, 1)
        if (badgeA > 0) {
          const bx = ex, by = ey - 30
          const halo = ctx.createRadialGradient(bx, by, 0, bx, by, 16)
          halo.addColorStop(0, `rgba(96,165,250,${0.35 * badgeA})`); halo.addColorStop(1, 'rgba(96,165,250,0)')
          ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(bx, by, 16, 0, Math.PI * 2); ctx.fill()
          ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(13,26,48,${0.8 * badgeA})`; ctx.fill()
          ctx.lineWidth = 1; ctx.strokeStyle = `rgba(96,165,250,${0.5 * badgeA})`; ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(bx - 4, by + 2.5); ctx.lineTo(bx, by - 3.5); ctx.lineTo(bx + 4, by + 2.5)
          ctx.strokeStyle = `rgba(255,255,255,${0.9 * badgeA})`; ctx.lineWidth = 1.6
          ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke()
        }
      }

      // progress bar — slim, with a moving shimmer
      const bW = Math.min(W * 0.26, 190), bX = W / 2 - bW / 2, bY = H - 30
      ctx.fillStyle = 'rgba(30,111,217,0.08)'
      ctx.beginPath(); ctx.roundRect(bX, bY, bW, 2, 1); ctx.fill()

      const fillW = bW * eased
      const fillG = ctx.createLinearGradient(bX, 0, bX + fillW, 0)
      fillG.addColorStop(0, '#1E6FD9'); fillG.addColorStop(1, '#60A5FA')
      ctx.fillStyle = fillG
      ctx.beginPath(); ctx.roundRect(bX, bY, fillW, 2, 1); ctx.fill()

      if (fillW > 2) {
        ctx.save()
        ctx.beginPath(); ctx.roundRect(bX, bY, fillW, 2, 1); ctx.clip()
        const shimmerX = bX + ((ts * 0.25) % (bW + 50)) - 50
        const shimG = ctx.createLinearGradient(shimmerX, 0, shimmerX + 50, 0)
        shimG.addColorStop(0, 'rgba(255,255,255,0)'); shimG.addColorStop(0.5, 'rgba(255,255,255,0.55)'); shimG.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = shimG; ctx.fillRect(bX, bY - 2, bW, 6)
        ctx.restore()
      }

      const tipGlow = ctx.createRadialGradient(bX + fillW, bY + 1, 0, bX + fillW, bY + 1, 7)
      tipGlow.addColorStop(0, 'rgba(96,165,250,0.9)'); tipGlow.addColorStop(1, 'rgba(96,165,250,0)')
      ctx.fillStyle = tipGlow; ctx.beginPath(); ctx.arc(bX + fillW, bY + 1, 7, 0, Math.PI * 2); ctx.fill()

      if (prog < 1) { animId = requestAnimationFrame(draw) }
      else { setTimeout(() => { setFadeOut(true); setTimeout(() => setVisible(false), 650) }, 480) }
    }

    animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, opacity: fadeOut ? 0 : 1, transition: 'opacity 0.65s ease', pointerEvents: fadeOut ? 'none' : 'auto' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Centro: logo + nome */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16, pointerEvents: 'none', perspective: 1200,
      }}>
        <div style={{
          opacity: logoIn ? 1 : 0,
          transform: logoIn ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
          transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          {/* Ícone com anel de progresso e leve tilt 3D */}
          <div ref={iconWrapRef} style={{ position: 'relative', width: 72, height: 72, transition: 'transform 0.2s ease-out' }}>
            <svg viewBox="0 0 80 80" style={{ position: 'absolute', inset: -4, width: 80, height: 80, transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r={RING_R} fill="none" stroke="rgba(30,111,217,0.15)" strokeWidth="2" />
              <circle
                cx="40" cy="40" r={RING_R} fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress / 100)}
                style={{ transition: 'stroke-dashoffset 0.1s linear', filter: 'drop-shadow(0 0 4px rgba(96,165,250,0.55))' }}
              />
            </svg>

            <div style={{
              position: 'absolute', inset: 6, borderRadius: 16, overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(30,111,217,0.22), rgba(13,26,48,0.55))',
              border: '1px solid rgba(96,165,250,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 26px rgba(6,12,24,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: sweepIn ? '130%' : '-60%', width: '45%', height: '100%',
                background: 'linear-gradient(75deg, transparent, rgba(255,255,255,0.28), transparent)',
                transition: 'left 1.1s ease-out',
              }} />
              <img src={logoImg} alt="Veskan" style={{ height: 30, width: 'auto', filter: 'brightness(0) invert(1)', position: 'relative', zIndex: 1 }} />
            </div>
          </div>

          {/* Nome com revelação por clip-path */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              overflow: 'hidden',
              clipPath: logoIn ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
            }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(30px,4.5vw,44px)', color: '#fff', letterSpacing: '-0.8px', lineHeight: 1 }}>
                Veskan
              </div>
            </div>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.2em', marginTop: 7,
              fontFamily: 'DM Sans, sans-serif', opacity: logoIn ? 1 : 0, transition: 'opacity 0.6s ease 0.55s',
            }}>
              Investimentos Inteligentes
            </div>
          </div>
        </div>
      </div>

      {/* Base: estado de carregamento */}
      <div style={{
        position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center',
        opacity: logoIn ? 0.55 : 0, transition: 'opacity 0.5s ease 1s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', letterSpacing: '.14em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
          Carregando plataforma
        </span>
        <span style={{ fontSize: 10, color: 'rgba(96,165,250,.85)', fontFamily: 'DM Sans, sans-serif', fontVariantNumeric: 'tabular-nums', letterSpacing: '.05em' }}>
          {progress}%
        </span>
      </div>
    </div>
  )
}