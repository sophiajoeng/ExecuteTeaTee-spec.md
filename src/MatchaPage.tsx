import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Page } from './App'
import matchaImg from '@/imports/Screenshot_2026-09-08_at_4.15.35_AM.png'
import strokesImg from '@/imports/StrokesGained-1.png'

/* ── Hole generation ──────────────────────────────────────── */
interface Hole {
  id: number
  teeX: number
  teeY: number
  greenX: number
  greenY: number
  fairwayW: number
  traps: { x: number; y: number; rx: number; ry: number }[]
  water: { x: number; y: number; rx: number; ry: number } | null
  par: number
}

let holeCounter = 0
function generateHole(seed = Math.random()): Hole {
  const rng = (a = 0, b = 1) => a + (seed = (seed * 16807 + 0) % 2147483647, (seed / 2147483647)) * (b - a)
  return {
    id: ++holeCounter,
    teeX: 0.4 + rng() * 0.2,
    teeY: 0.82,
    greenX: 0.25 + rng() * 0.5,
    greenY: 0.08 + rng() * 0.14,
    fairwayW: 0.14 + rng() * 0.1,
    traps: Array.from({ length: 2 + Math.floor(rng() * 3) }, () => ({
      x: 0.18 + rng() * 0.64,
      y: 0.15 + rng() * 0.65,
      rx: 0.04 + rng() * 0.055,
      ry: 0.028 + rng() * 0.035,
    })),
    water: rng() > 0.48
      ? { x: 0.2 + rng() * 0.55, y: 0.3 + rng() * 0.38, rx: 0.07 + rng() * 0.09, ry: 0.045 + rng() * 0.05 }
      : null,
    par: [3, 4, 4, 4, 5][Math.floor(rng() * 5)],
  }
}

/* ── Strokes Gained calc ──────────────────────────────────── */
function calcSG(pos: { x: number; y: number }, hole: Hole): number {
  const dx = pos.x - hole.greenX
  const dy = pos.y - hole.greenY
  const dist = Math.sqrt(dx * dx + dy * dy)

  const onWater = hole.water &&
    (pos.x - hole.water.x) ** 2 / hole.water.rx ** 2 +
    (pos.y - hole.water.y) ** 2 / hole.water.ry ** 2 < 1

  const onSand = hole.traps.some(
    (t) =>
      (pos.x - t.x) ** 2 / t.rx ** 2 + (pos.y - t.y) ** 2 / t.ry ** 2 < 1
  )

  let sg = 1.0 - dist * 3.2
  if (onWater) sg -= 0.85
  if (onSand) sg -= 0.28

  return Math.round(Math.max(-1.5, Math.min(1.0, sg)) * 100) / 100
}

/* ── Hole SVG ─────────────────────────────────────────────── */
function HoleSVG({
  hole,
  target,
  onDrag,
  compact = false,
  showTarget = true,
}: {
  hole: Hole
  target: { x: number; y: number }
  onDrag?: (pos: { x: number; y: number }) => void
  compact?: boolean
  showTarget?: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const W = 400, H = compact ? 280 : 480
  const tx = hole.teeX * W, ty = hole.teeY * H
  const gx = hole.greenX * W, gy = hole.greenY * H
  const fw = hole.fairwayW * W

  const isDragging = useRef(false)

  const getPos = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    }
  }

  const handleDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onDrag) return
    isDragging.current = true
    onDrag(getPos(e))
  }
  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging.current || !onDrag) return
    onDrag(getPos(e))
  }
  const handleUp = () => { isDragging.current = false }

  const fp = `M ${tx - fw / 2} ${ty} L ${gx - fw / 3} ${gy} L ${gx + fw / 3} ${gy} L ${tx + fw / 2} ${ty} Z`

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: '100%', cursor: onDrag ? 'crosshair' : 'default', userSelect: 'none' }}
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
    >
      {/* Rough */}
      <rect width={W} height={H} fill="#213d1c" />

      {/* Fairway */}
      <path d={fp} fill="#3d6b35" />

      {/* Water hazard */}
      {hole.water && (
        <ellipse
          cx={hole.water.x * W}
          cy={hole.water.y * H}
          rx={hole.water.rx * W}
          ry={hole.water.ry * H}
          fill="#1e3d6b"
          opacity="0.85"
        />
      )}

      {/* Sand traps */}
      {hole.traps.map((t, i) => (
        <ellipse key={i} cx={t.x * W} cy={t.y * H} rx={t.rx * W} ry={t.ry * H} fill="#c8b882" opacity="0.8" />
      ))}

      {/* Green */}
      <circle cx={gx} cy={gy} r={compact ? 22 : 32} fill="#5a9e50" />
      <circle cx={gx} cy={gy} r={compact ? 22 : 32} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Hole */}
      <circle cx={gx} cy={gy} r={compact ? 3 : 4.5} fill="#0a0a0a" />

      {/* Flag */}
      <line x1={gx} y1={gy} x2={gx} y2={gy - (compact ? 14 : 22)} stroke="#f5f0e8" strokeWidth="1.2" />
      <polygon
        points={`${gx},${gy - (compact ? 14 : 22)} ${gx + (compact ? 7 : 12)},${gy - (compact ? 9 : 15)} ${gx},${gy - (compact ? 5 : 8)}`}
        fill="#c84a4a"
      />

      {/* Tee marker */}
      {!compact && (
        <>
          <circle cx={tx} cy={ty} r="6" fill="#c8a96e" />
          <text x={tx} y={ty - 10} textAnchor="middle" fill="#f5f0e8" fontSize="9" fontFamily="DM Mono,monospace">
            TEE
          </text>
        </>
      )}

      {/* Target circle */}
      {showTarget && (
        <>
          <circle
            cx={target.x * W}
            cy={target.y * H}
            r={compact ? 14 : 22}
            fill="rgba(245,240,232,0.08)"
            stroke="#f5f0e8"
            strokeWidth="1.8"
            strokeDasharray="5 4"
          />
          <circle cx={target.x * W} cy={target.y * H} r={compact ? 3 : 4} fill="#f5f0e8" opacity="0.9" />
        </>
      )}
    </svg>
  )
}

/* ── Math / Education Section ─────────────────────────────── */
function MathSection() {
  return (
    <section style={{ background: '#f5f0e8', padding: '80px 40px', color: '#1a1510' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 className="font-sans" style={{ fontSize: 42, fontWeight: 300, marginBottom: 32 }}>
          The Math
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3020', marginBottom: 24 }}>
              The circumference — and not the surface area — of your expected shot and the
              positioning of the hazards are used to calculate whether your shot choice has the
              best probability outcome.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3020' }}>
              Strokes Gained (SG) quantifies shot quality relative to the average PGA Tour
              player. A shot to 15 feet from 150 yards might yield +0.8 SG, while the same shot
              into a bunker might yield −0.3 SG.
            </p>

            {/* Math equations */}
            <div
              style={{
                marginTop: 24,
                padding: 20,
                background: '#fff',
                borderRadius: 10,
                border: '1px solid rgba(26,21,16,0.1)',
              }}
            >
              <div className="font-mono" style={{ fontSize: 10, color: '#888', letterSpacing: '0.2em', marginBottom: 12 }}>
                STROKES GAINED MODEL
              </div>
              {[
                'SG = Baseline − Outcome',
                'P(hazard) = A_hazard / A_dispersion',
                'E[strokes] = Σ P(zone) × strokes(zone)',
                'Dispersion ∝ shot_distance²',
              ].map((eq, i) => (
                <div
                  key={i}
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    color: '#1a1510',
                    padding: '5px 0',
                    borderBottom: i < 3 ? '1px solid rgba(26,21,16,0.06)' : '',
                  }}
                >
                  {eq}
                </div>
              ))}
            </div>
          </div>

          {/* Shot dispersion diagram */}
          <div
            style={{
              border: '1px solid rgba(26,21,16,0.12)',
              borderRadius: 12,
              padding: 24,
              background: '#fff',
            }}
          >
            <svg viewBox="0 0 300 240" style={{ width: '100%' }}>
              <text x="150" y="16" textAnchor="middle" fontSize="10" fill="#1a1510" fontFamily="DM Sans,sans-serif" fontWeight="600">
                Shot Dispersion &amp; Hazard Probability
              </text>

              {/* Target */}
              <circle cx="150" cy="130" r="5" fill="#1a1510" />
              <text x="156" y="134" fontSize="8" fill="#555" fontFamily="DM Mono,monospace">TARGET</text>

              {/* Dispersion ellipses */}
              {[
                { rx: 25, ry: 18, label: '50%', opacity: 0.85 },
                { rx: 50, ry: 36, label: '80%', opacity: 0.5 },
                { rx: 78, ry: 56, label: '95%', opacity: 0.25 },
              ].map((d, i) => (
                <g key={i}>
                  <ellipse cx="150" cy="130" rx={d.rx} ry={d.ry} fill="none" stroke="#1a1510" strokeWidth="1" opacity={d.opacity} strokeDasharray={i > 0 ? '4 3' : ''} />
                  <text x={150 + d.rx + 3} y="132" fontSize="8" fill="#888" fontFamily="DM Mono,monospace">{d.label}</text>
                </g>
              ))}

              {/* Hazard zone */}
              <ellipse cx="195" cy="118" rx="30" ry="20" fill="rgba(30,61,107,0.2)" stroke="#1e3d6b" strokeWidth="1" strokeDasharray="4 2" />
              <text x="195" y="115" textAnchor="middle" fontSize="8" fill="#1e3d6b" fontFamily="DM Mono,monospace">WATER</text>
              <text x="195" y="125" textAnchor="middle" fontSize="8" fill="#1e3d6b" fontFamily="DM Mono,monospace">P=0.18</text>

              {/* Sand */}
              <ellipse cx="118" cy="158" rx="22" ry="14" fill="rgba(200,184,130,0.4)" stroke="#8a7840" strokeWidth="1" strokeDasharray="4 2" />
              <text x="118" y="163" textAnchor="middle" fontSize="8" fill="#6a5820" fontFamily="DM Mono,monospace">SAND</text>

              {/* Player position */}
              <circle cx="150" cy="220" r="4" fill="#1a1510" />
              <line x1="150" y1="216" x2="150" y2="140" stroke="#1a1510" strokeWidth="1" strokeDasharray="3 3" />
              <text x="155" y="222" fontSize="8" fill="#555" fontFamily="DM Mono,monospace">PLAYER</text>

              <text x="10" y="230" fontSize="8" fill="#aaa" fontFamily="DM Mono,monospace">
                Dispersion scales with distance²
              </text>
            </svg>
          </div>
        </div>

        {/* Trackman reference */}
        <div
          style={{
            marginTop: 48,
            border: '1px solid rgba(26,21,16,0.1)',
            borderRadius: 12,
            padding: '28px 32px',
            background: '#fff',
          }}
        >
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.25em', color: '#888', marginBottom: 12 }}>
            PRO REFERENCE
          </div>
          <p style={{ fontSize: 14, color: '#3a3020', lineHeight: 1.65 }}>
            Pictures of professional players using Trackman training — strokes gained on
            projector and indoor simulator. Tour players use SG data to identify weaknesses in
            their games and optimize practice sessions for maximum improvement.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Matcha Page ──────────────────────────────────────────── */
export default function MatchaPage({ setPage }: { setPage: (p: Page) => void }) {
  const [hole, setHole] = useState<Hole>(() => generateHole())
  const [altHoles] = useState<Hole[]>(() => [generateHole(), generateHole(), generateHole()])
  const [target, setTarget] = useState({ x: 0.5, y: 0.5 })
  const [sg, setSg] = useState<number | null>(null)
  const [hitting, setHitting] = useState(false)
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 50)
    return () => clearTimeout(t)
  }, [])

  const hit = () => {
    if (hitting) return
    setHitting(true)
    setTimeout(() => {
      setSg(calcSG(target, hole))
      setHitting(false)
    }, 600)
  }

  const newHole = () => {
    setHole(generateHole())
    setTarget({ x: 0.5, y: 0.5 })
    setSg(null)
  }

  const loadAlt = (h: Hole) => {
    setHole(h)
    setTarget({ x: 0.5, y: 0.5 })
    setSg(null)
  }

  return (
    <div>
      {/* ── Matcha Background ── */}
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            background: '#1a3318',
            overflow: 'hidden',
          }}
        >
          {/* Matcha photo — zoomed in, blurred */}
          <img
            src={matchaImg}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              filter: 'blur(18px) saturate(1.3) brightness(0.65)',
              transform: 'scale(2.0)',
            }}
          />
          {/* Dark vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(10,26,10,0.2) 0%, rgba(10,26,10,0.6) 100%)',
            }}
          />
          {/* Tea fill animation overlay */}
          <div
            className={filled ? 'tea-fill-up' : ''}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              clipPath: filled ? undefined : 'inset(0 0 100% 0)',
            }}
          />
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.35em', color: '#7eb872', marginBottom: 8 }}>
                MATCHA TEE — INTERMEDIATE / COMPETITIVE
              </div>
              <h1 className="font-sans" style={{ fontSize: 52, fontWeight: 300, color: '#f5f0e8', lineHeight: 1 }}>
                Course Management
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(245,240,232,0.5)', marginTop: 10, maxWidth: 440, lineHeight: 1.6 }}>
                Move the circle &amp; click HIT to simulate a shot. The perfect shot selection is +1.00.
              </p>
            </div>

            {/* Strokes Gained Panel */}
            <div
              className="glass-dark"
              style={{ padding: '20px 28px', minWidth: 180, textAlign: 'center', flexShrink: 0 }}
            >
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(245,240,232,0.4)', marginBottom: 8 }}>
                STROKES GAINED
              </div>
              <div
                className="font-sans"
                style={{
                  fontSize: 52,
                  fontWeight: 300,
                  lineHeight: 1,
                  color:
                    sg === null ? 'rgba(245,240,232,0.25)' :
                    sg >= 0.7 ? '#7eb872' :
                    sg >= 0.2 ? '#c8a96e' : '#c84a4a',
                  transition: 'color 0.4s',
                }}
              >
                {sg === null ? '—' : (sg >= 0 ? '+' : '') + sg.toFixed(2)}
              </div>
              {sg !== null && (
                <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.4)', marginTop: 4 }}>
                  {sg >= 0.85 ? 'Excellent!' : sg >= 0.5 ? 'Good choice' : sg >= 0 ? 'Safe play' : 'Risky — rethink'}
                </div>
              )}
            </div>
          </div>

          {/* ── Hole Interface ── */}
          <div className="glass-dark" style={{ padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="font-sans" style={{ fontSize: 20, color: '#f5f0e8', fontWeight: 300 }}>
                Find the smartest shot:
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={newHole}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    border: '1px solid rgba(245,240,232,0.2)',
                    background: 'transparent',
                    color: '#f5f0e8',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans,sans-serif',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,240,232,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  New Hole
                </button>
                <button
                  onClick={hit}
                  disabled={hitting}
                  style={{
                    padding: '8px 28px',
                    borderRadius: 8,
                    border: 'none',
                    background: hitting ? 'rgba(126,184,114,0.4)' : '#7eb872',
                    color: '#12100a',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    cursor: hitting ? 'not-allowed' : 'pointer',
                    fontFamily: 'DM Sans,sans-serif',
                    transition: 'background 0.2s',
                  }}
                >
                  {hitting ? '···' : 'HIT'}
                </button>
              </div>
            </div>

            {/* Hole view */}
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                height: 460,
                border: '1px solid rgba(245,240,232,0.06)',
              }}
            >
              <img
                src={strokesImg}
                alt="Strokes Gained simulator"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'PAR', value: hole.par },
                { label: 'HAZARDS', value: (hole.water ? 1 : 0) + hole.traps.length },
                { label: 'IDEAL SG', value: '+1.00' },
                { label: 'YOUR SG', value: sg !== null ? (sg >= 0 ? '+' : '') + sg.toFixed(2) : '—' },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, minWidth: 80 }}>
                  <div className="font-mono" style={{ fontSize: 8, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.35)' }}>
                    {s.label}
                  </div>
                  <div className="font-mono" style={{ fontSize: 16, color: '#c8a96e', marginTop: 2 }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Alternative Holes ── */}
          <div>
            <div
              className="font-mono"
              style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(245,240,232,0.35)', marginBottom: 12 }}
            >
              OTHER HOLE OPTIONS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {altHoles.map((h) => (
                <button
                  key={h.id}
                  onClick={() => loadAlt(h)}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    height: 140,
                    border: '1px solid rgba(245,240,232,0.1)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, transform 0.2s',
                    background: 'none',
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(126,184,114,0.5)'
                    e.currentTarget.style.transform = 'scale(1.02)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(245,240,232,0.1)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <img
                    src={strokesImg}
                    alt="Hole preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Math Section ── */}
      <MathSection />

      {/* ── Footer ── */}
      <footer style={{ background: '#0d1a0d', padding: '48px 40px', textAlign: 'center', borderTop: '1px solid rgba(245,240,232,0.04)' }}>
        <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.25)', maxWidth: 1100, margin: '0 auto', lineHeight: 1.7 }}>
          TeaTee was created by Sophia Joeng to help golfers of all levels connect with the online
          golf community. I want to help golfers understand complex concepts and terminology that
          can otherwise require coaching or extensive resources to learn.
        </p>
      </footer>
    </div>
  )
}
