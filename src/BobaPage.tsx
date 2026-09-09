import { useState, useRef, useEffect } from 'react'
import bobaImg from '@/imports/Screenshot_2026-09-08_at_4.04.54_AM.png'
import simImg from '@/imports/Screenshot_2026-09-08_at_11.31.44_PM.png'
import { Page } from './App'

/* ── Club Data (Titleist T200) ────────────────────────────── */
const CLUBS = [
  { name: 'Driver', loft: 9, length: 45.75, dist: 235 },
  { name: '3 Wood', loft: 15, length: 43.25, dist: 210 },
  { name: '5 Wood', loft: 18, length: 42.25, dist: 195 },
  { name: '4 Hybrid', loft: 22, length: 40.5, dist: 185 },
  { name: '4 Iron', loft: 20, length: 38.5, dist: 172 },
  { name: '5 Iron', loft: 24, length: 38.0, dist: 160 },
  { name: '6 Iron', loft: 28, length: 37.5, dist: 149 },
  { name: '7 Iron', loft: 32, length: 37.0, dist: 138 },
  { name: '8 Iron', loft: 37, length: 36.5, dist: 127 },
  { name: '9 Iron', loft: 41, length: 36.0, dist: 115 },
  { name: 'PW', loft: 45, length: 35.75, dist: 105 },
  { name: 'GW', loft: 50, length: 35.5, dist: 92 },
  { name: 'SW', loft: 54, length: 35.25, dist: 76 },
  { name: 'LW', loft: 58, length: 35.0, dist: 60 },
]
const DEFAULT = 7 // 7 Iron

/* ── Golf Bag SVG ─────────────────────────────────────────── */
function GolfBag({ selectedIdx }: { selectedIdx: number }) {
  return (
    <svg viewBox="0 0 180 380" fill="none" style={{ width: '100%', height: '100%' }}>
      {/* Stand legs */}
      <line x1="72" y1="348" x2="58" y2="378" stroke="#3a3020" strokeWidth="3" strokeLinecap="round" />
      <line x1="108" y1="348" x2="122" y2="378" stroke="#3a3020" strokeWidth="3" strokeLinecap="round" />

      {/* Bag body */}
      <rect x="50" y="110" width="80" height="238" rx="14" fill="#1a1510" stroke="rgba(200,169,110,0.3)" strokeWidth="1.2" />
      <rect x="55" y="118" width="70" height="222" rx="10" fill="#0d0a05" />

      {/* Bag top */}
      <ellipse cx="90" cy="112" rx="40" ry="13" fill="#2a1f0a" stroke="rgba(200,169,110,0.4)" strokeWidth="1.2" />

      {/* Club shafts */}
      {CLUBS.map((club, i) => {
        const spread = ((i - 6.5) / 14) * 56
        const bx = 90 + spread
        const isSelected = i === selectedIdx
        return (
          <g key={club.name} style={{ transition: 'all 0.35s ease' }}>
            <line
              x1={bx}
              y1={isSelected ? 4 : 42}
              x2={bx}
              y2={108}
              stroke={isSelected ? '#c8a96e' : `hsl(35,${20 + i * 2}%,${16 + i}%)`}
              strokeWidth={isSelected ? 2.5 : 1.2}
              strokeLinecap="round"
            />
            {/* Club head */}
            <ellipse
              cx={bx}
              cy={isSelected ? 2 : 40}
              rx={isSelected ? 9 : 5}
              ry={isSelected ? 3.5 : 2.5}
              fill={isSelected ? '#c8a96e' : '#2a2010'}
            />
          </g>
        )
      })}

      {/* Strap */}
      <path d="M52 195 Q28 240 52 290" stroke="rgba(200,169,110,0.25)" strokeWidth="2" fill="none" />

      {/* Logo */}
      <text x="90" y="270" textAnchor="middle" fill="rgba(200,169,110,0.35)" fontSize="8" fontFamily="DM Sans,sans-serif" letterSpacing="3">
        TEE UP
      </text>

      {/* Brand stripe */}
      <rect x="55" y="160" width="70" height="2" rx="1" fill="rgba(200,169,110,0.12)" />
    </svg>
  )
}

/* ── Loft Dial ────────────────────────────────────────────── */
function LoftDial({ loft }: { loft: number }) {
  const maxLoft = 62
  const minLoft = 8
  const pct = (loft - minLoft) / (maxLoft - minLoft)
  const startAng = -225
  const endAng = 45
  const ang = startAng + pct * (endAng - startAng)
  const rad = (a: number) => (a * Math.PI) / 180
  const cx = 70, cy = 70, r = 54

  const handleX = cx + Math.cos(rad(ang)) * r
  const handleY = cy + Math.sin(rad(ang)) * r

  // Arc path from startAng to ang
  const arcStart = { x: cx + Math.cos(rad(startAng)) * r, y: cy + Math.sin(rad(startAng)) * r }
  const arcEnd = { x: handleX, y: handleY }
  const largeArc = ang - startAng > 180 ? 1 : 0

  // Tick marks
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const a = startAng + (i / 12) * (endAng - startAng)
    const inner = r - 10
    const outer = r - 3
    return {
      x1: cx + Math.cos(rad(a)) * inner,
      y1: cy + Math.sin(rad(a)) * inner,
      x2: cx + Math.cos(rad(a)) * outer,
      y2: cy + Math.sin(rad(a)) * outer,
    }
  })

  return (
    <svg viewBox="0 0 140 140" style={{ width: 140, height: 140 }}>
      {/* Track */}
      <path
        d={`M ${cx + Math.cos(rad(startAng)) * r} ${cy + Math.sin(rad(startAng)) * r} A ${r} ${r} 0 1 1 ${cx + Math.cos(rad(endAng)) * r} ${cy + Math.sin(rad(endAng)) * r}`}
        stroke="rgba(245,240,232,0.08)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Filled arc */}
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`}
        stroke="#c8a96e"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        style={{ transition: 'd 0.2s ease' }}
      />
      {/* Ticks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(245,240,232,0.15)" strokeWidth="1" />
      ))}
      {/* Handle */}
      <circle
        cx={handleX}
        cy={handleY}
        r="7"
        fill="#c8a96e"
        style={{ transition: 'cx 0.2s ease, cy 0.2s ease' }}
      />
      {/* Center value */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#f5f0e8" fontSize="22" fontFamily="DM Sans,sans-serif" fontWeight="600">
        {loft}°
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(245,240,232,0.4)" fontSize="9" fontFamily="DM Mono,monospace" letterSpacing="1">
        LOFT
      </text>
    </svg>
  )
}

/* ── Golf Simulator ───────────────────────────────────────── */
function GolfSimulator({ club }: { club: (typeof CLUBS)[0] }) {
  const [distLeft, setDistLeft] = useState(400)
  const [flying, setFlying] = useState(false)
  const [shotDist, setShotDist] = useState<number | null>(null)
  const ballRef = useRef<HTMLDivElement>(null)

  const hit = () => {
    if (flying) return
    const d = club.dist
    setFlying(true)
    setShotDist(d)
    setTimeout(() => {
      setFlying(false)
      setDistLeft((prev) => Math.max(0, prev - d))
    }, 1350)
  }

  const reset = () => {
    setDistLeft(400)
    setShotDist(null)
  }

  return (
    <div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#c8a96e',
          letterSpacing: '0.1em',
          marginBottom: 16,
          textTransform: 'uppercase',
        }}
      >
        Try Your Club:
      </div>

      {/* Simulator viewport */}
      <div
        style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          height: 420,
          background: '#0a1a0a',
        }}
      >
        {/* Simulator photo background */}
        <img
          src={simImg}
          alt="Golf simulator view"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />

        {/* Distance indicator */}
        <div
          className="glass-dark"
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: 'rgba(245,240,232,0.5)', letterSpacing: '0.05em' }}>Distance Left:</span>
          <span className="font-mono" style={{ color: '#c8a96e', fontSize: 14, fontWeight: 500 }}>
            {distLeft} yd
          </span>
        </div>

        {shotDist !== null && (
          <div
            className="glass-dark"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 11,
              color: '#7eb872',
            }}
          >
            +{shotDist} yd
          </div>
        )}

        {/* Golf ball (animates on HIT) */}
        <div
          ref={ballRef}
          className={flying ? 'ball-flying' : ''}
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%, #fff, #d8d8d8)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            zIndex: 5,
          }}
        />

        {/* HIT button */}
        <button
          onClick={hit}
          disabled={flying || distLeft === 0}
          style={{
            position: 'absolute',
            top: 12,
            right: shotDist !== null ? 100 : 12,
            padding: '7px 20px',
            borderRadius: 8,
            border: 'none',
            background: flying ? 'rgba(200,169,110,0.3)' : '#c8a96e',
            color: '#12100a',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.15em',
            cursor: flying || distLeft === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'background 0.2s',
            opacity: distLeft === 0 ? 0.4 : 1,
          }}
        >
          HIT
        </button>

        {distLeft === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
            <div className="font-sans" style={{ fontSize: 28, color: '#c8a96e', marginBottom: 12 }}>Hole Complete!</div>
            <button
              onClick={reset}
              style={{ padding: '8px 24px', borderRadius: 20, border: '1px solid #c8a96e', background: 'transparent', color: '#c8a96e', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(245,240,232,0.35)', textAlign: 'center' }}>
        {club.name} carries approximately {club.dist} yards
      </div>
    </div>
  )
}

/* ── Physics Education ────────────────────────────────────── */
function PhysicsSection() {
  return (
    <section style={{ background: '#f5f0e8', padding: '80px 40px', color: '#1a1510' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2
          className="font-sans"
          style={{ fontSize: 42, fontWeight: 300, marginBottom: 32, color: '#1a1510' }}
        >
          The Physics
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3020', marginBottom: 24 }}>
              Club face angle, shaft length, and swing speed interact to determine ball flight. A higher loft angle imparts more backspin, creating lift — this is why short irons go high. A longer shaft increases potential swing speed and distance but reduces control.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3020' }}>
              At impact, the dynamic loft (actual loft at contact) is typically 3–6° less than the club's stated loft due to shaft compression. Understanding these relationships lets you select the right club for every shot.
            </p>
          </div>

          {/* Physics diagram */}
          <div style={{ border: '1px solid rgba(26,21,16,0.12)', borderRadius: 12, padding: 24, background: '#fff' }}>
            <svg viewBox="0 0 300 220" style={{ width: '100%' }}>
              {/* Ground line */}
              <line x1="20" y1="190" x2="280" y2="190" stroke="#1a1510" strokeWidth="1.5" />

              {/* Ball position */}
              <circle cx="60" cy="186" r="6" fill="#1a1510" />

              {/* Trajectory arcs for different clubs */}
              {[
                { label: 'LW 58°', color: '#1a1510', py: 40, px: 160 },
                { label: '7I 32°', color: '#555', py: 80, px: 200 },
                { label: 'Driver 9°', color: '#999', py: 120, px: 260 },
              ].map((arc, i) => (
                <g key={i}>
                  <path
                    d={`M 60 186 Q ${(60 + arc.px) / 2} ${arc.py} ${arc.px} 190`}
                    stroke={arc.color}
                    strokeWidth="1.2"
                    fill="none"
                    strokeDasharray={i > 0 ? '4 3' : ''}
                  />
                  <text x={arc.px + 4} y="188" fontSize="9" fill={arc.color} fontFamily="DM Mono,monospace">
                    {arc.label}
                  </text>
                </g>
              ))}

              {/* Launch angle indicators */}
              <line x1="60" y1="186" x2="92" y2="146" stroke="#1a1510" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="60" y1="186" x2="96" y2="166" stroke="#555" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="60" y1="186" x2="100" y2="180" stroke="#999" strokeWidth="1" strokeDasharray="3 2" />

              {/* Labels */}
              <text x="20" y="18" fontSize="10" fill="#1a1510" fontFamily="DM Sans,sans-serif" fontWeight="600">
                Ball Trajectory by Loft Angle
              </text>
              <text x="20" y="208" fontSize="8" fill="#888" fontFamily="DM Mono,monospace">
                DISTANCE →
              </text>
              <text x="8" y="190" fontSize="8" fill="#888" fontFamily="DM Mono,monospace" transform="rotate(-90,8,130)">
                HEIGHT →
              </text>
            </svg>
          </div>
        </div>

        {/* Club fitter reference */}
        <div
          style={{
            marginTop: 48,
            border: '1px solid rgba(26,21,16,0.1)',
            borderRadius: 12,
            padding: '28px 32px',
            background: '#fff',
          }}
        >
          <div
            className="font-mono"
            style={{ fontSize: 10, letterSpacing: '0.25em', color: '#888', marginBottom: 12 }}
          >
            FITTING REFERENCE
          </div>
          <p style={{ fontSize: 14, color: '#3a3020', lineHeight: 1.65 }}>
            Pictures of a club fitter altering and comparing face angles and club shaft lengths. A
            qualified fitter uses launch monitor data — ball speed, launch angle, spin rate, and
            carry distance — to dial in the optimal specifications for your swing.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Boba Page ────────────────────────────────────────────── */
export default function BobaPage({ setPage }: { setPage: (p: Page) => void }) {
  const [clubIdx, setClubIdx] = useState(DEFAULT)
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 50)
    return () => clearTimeout(t)
  }, [])

  const club = CLUBS[clubIdx]

  const changeClub = (dir: number) => {
    setClubIdx((i) => Math.max(0, Math.min(CLUBS.length - 1, i + dir)))
  }

  return (
    <div>
      {/* ── Boba Background ── */}
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Fixed boba background */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            background: '#3d1f0a',
            overflow: 'hidden',
          }}
        >
          {/* Boba photo — stretched sideways, blurred */}
          <img
            src={bobaImg}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              filter: 'blur(18px) saturate(0.9) brightness(1.15)',
              transform: 'scale(1.9)',
            }}
          />
          {/* Dark vignette to keep UI readable */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 40%, rgba(255,240,220,0.15) 0%, rgba(30,12,6,0.2) 100%)',
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

        {/* ── Page Content ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px' }}>
          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div
              className="font-mono"
              style={{ fontSize: 10, letterSpacing: '0.35em', color: '#c8a96e', marginBottom: 8 }}
            >
              BOBA TEE — BEGINNER / CASUAL
            </div>
            <h1 className="font-sans" style={{ fontSize: 52, fontWeight: 300, color: '#f5f0e8', lineHeight: 1 }}>
              Golf Clubs
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(245,240,232,0.5)', marginTop: 10, maxWidth: 480, lineHeight: 1.6 }}>
              Turn the dial to change the club face angle &amp; scroll the right side to change
              the shaft length. Club relationships update automatically.
            </p>
          </div>

          {/* ── Main Club Section ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 32, marginBottom: 48 }}>
            {/* Left: Club selector + dial */}
            <div className="glass-dark" style={{ padding: 36 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center' }}>
                {/* Club name */}
                <div>
                  <div
                    className="font-sans"
                    style={{
                      fontSize: 56,
                      fontWeight: 300,
                      color: '#f5f0e8',
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {club.name.toLowerCase()}
                  </div>
                  <div
                    className="font-mono"
                    style={{ fontSize: 11, color: '#c8a96e', letterSpacing: '0.2em' }}
                  >
                    TITLEIST T200
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                    {[
                      { label: 'LOFT', value: `${club.loft}°` },
                      { label: 'LENGTH', value: `${club.length}"` },
                      { label: 'CARRY', value: `~${club.dist} yd` },
                    ].map((s) => (
                      <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245,240,232,0.07)', paddingBottom: 8 }}>
                        <span className="font-mono" style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(245,240,232,0.35)' }}>
                          {s.label}
                        </span>
                        <span
                          className="font-mono"
                          style={{ fontSize: 16, color: '#f5f0e8', fontWeight: 500 }}
                        >
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center: Loft Dial + controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.35)' }}>
                    DIAL — LOFT
                  </div>
                  <LoftDial loft={club.loft} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => changeClub(1)}
                      disabled={clubIdx >= CLUBS.length - 1}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: '1px solid rgba(200,169,110,0.3)',
                        background: 'transparent',
                        color: '#c8a96e',
                        cursor: 'pointer',
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: clubIdx >= CLUBS.length - 1 ? 0.3 : 1,
                      }}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => changeClub(-1)}
                      disabled={clubIdx <= 0}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        border: '1px solid rgba(200,169,110,0.3)',
                        background: 'transparent',
                        color: '#c8a96e',
                        cursor: 'pointer',
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: clubIdx <= 0 ? 0.3 : 1,
                      }}
                    >
                      ↓
                    </button>
                  </div>
                </div>

                {/* Right: Club scroll list */}
                <div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.2em',
                      color: 'rgba(245,240,232,0.35)',
                      marginBottom: 12,
                      textAlign: 'right',
                    }}
                  >
                    SCROLL — LENGTH
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                    {CLUBS.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setClubIdx(i)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '3px 0',
                          opacity: i === clubIdx ? 1 : 0.35,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <span
                          className="font-mono"
                          style={{
                            fontSize: i === clubIdx ? 14 : 11,
                            color: i === clubIdx ? '#c8a96e' : '#f5f0e8',
                            fontWeight: i === clubIdx ? 500 : 400,
                            transition: 'font-size 0.2s, color 0.2s',
                          }}
                        >
                          {c.length}"
                        </span>
                        <span
                          style={{
                            fontSize: i === clubIdx ? 13 : 10,
                            color: i === clubIdx ? '#f5f0e8' : 'rgba(245,240,232,0.5)',
                            transition: 'font-size 0.2s',
                          }}
                        >
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Golf bag */}
            <div className="glass-dark" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                className="font-mono"
                style={{ fontSize: 9, letterSpacing: '0.25em', color: '#c8a96e', marginBottom: 8 }}
              >
                GOLF BAG
              </div>
              <div style={{ flex: 1, width: '100%' }}>
                <GolfBag selectedIdx={clubIdx} />
              </div>
              <div
                style={{ fontSize: 11, color: 'rgba(245,240,232,0.4)', textAlign: 'center', marginTop: 8 }}
              >
                {club.name} selected
              </div>
            </div>
          </div>

          {/* ── Golf Simulator ── */}
          <div className="glass-dark" style={{ padding: 36, marginBottom: 48 }}>
            <GolfSimulator club={club} />
          </div>
        </div>
      </div>

      {/* ── Physics Section ── */}
      <PhysicsSection />

      {/* ── Footer ── */}
      <footer style={{ background: '#0d0a05', padding: '48px 40px', textAlign: 'center', borderTop: '1px solid rgba(245,240,232,0.04)' }}>
        <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.25)', maxWidth: 1100, margin: '0 auto', lineHeight: 1.7 }}>
          TeaTee was created by Sophia Joeng to help golfers of all levels connect with the online
          golf community. I want to help golfers understand complex concepts and terminology that
          can otherwise require coaching or extensive resources to learn.
        </p>
      </footer>
    </div>
  )
}
