import { useState, useEffect, useRef, useCallback } from 'react'
import { Page } from './App'

/* ── Types ────────────────────────────────────────────────── */
type LimbId = 'left-arm' | 'right-arm' | 'left-leg' | 'right-leg' | 'spine'

interface Limb {
  id: LimbId
  label: string
  x1: number
  y1: number
  x2: number
  y2: number
}

interface PanelState {
  name: string
  limbs: Limb[]
  planeAngle: number  // current user-set plane angle (degrees)
  targetAngle: number // angle that "finds" the plane
  selectedLimb: LimbId | null
  planeLocked: boolean
}

/* ── Golfer positions per phase ───────────────────────────── */
const PANEL_CONFIGS: Omit<PanelState, 'planeAngle' | 'selectedLimb' | 'planeLocked'>[] = [
  {
    name: 'Take Away',
    targetAngle: 135,
    limbs: [
      { id: 'spine', label: 'Spine', x1: 100, y1: 50, x2: 100, y2: 130 },
      { id: 'right-arm', label: 'R Arm', x1: 100, y1: 75, x2: 148, y2: 60 },
      { id: 'left-arm', label: 'L Arm', x1: 100, y1: 75, x2: 72, y2: 90 },
      { id: 'left-leg', label: 'L Leg', x1: 92, y1: 130, x2: 82, y2: 185 },
      { id: 'right-leg', label: 'R Leg', x1: 108, y1: 130, x2: 120, y2: 185 },
    ],
  },
  {
    name: 'Impact',
    targetAngle: 45,
    limbs: [
      { id: 'spine', label: 'Spine', x1: 100, y1: 50, x2: 95, y2: 130 },
      { id: 'right-arm', label: 'R Arm', x1: 100, y1: 75, x2: 68, y2: 92 },
      { id: 'left-arm', label: 'L Arm', x1: 100, y1: 75, x2: 55, y2: 70 },
      { id: 'left-leg', label: 'L Leg', x1: 88, y1: 130, x2: 74, y2: 185 },
      { id: 'right-leg', label: 'R Leg', x1: 104, y1: 130, x2: 118, y2: 186 },
    ],
  },
  {
    name: 'Finish',
    targetAngle: 225,
    limbs: [
      { id: 'spine', label: 'Spine', x1: 100, y1: 50, x2: 103, y2: 130 },
      { id: 'right-arm', label: 'R Arm', x1: 100, y1: 75, x2: 62, y2: 28 },
      { id: 'left-arm', label: 'L Arm', x1: 100, y1: 75, x2: 50, y2: 38 },
      { id: 'left-leg', label: 'L Leg', x1: 96, y1: 130, x2: 78, y2: 185 },
      { id: 'right-leg', label: 'R Leg', x1: 106, y1: 130, x2: 110, y2: 185 },
    ],
  },
]

function buildInitialPanels(): PanelState[] {
  return PANEL_CONFIGS.map((cfg, i) => ({
    ...cfg,
    planeAngle: [100, 70, 60][i],
    selectedLimb: null,
    planeLocked: false,
  }))
}

/* ── Globe Rotation Widget ────────────────────────────────── */
function GlobeWidget({
  rotation,
  onRotate,
}: {
  rotation: number
  onRotate: (d: number) => void
}) {
  const [dragging, setDragging] = useState(false)
  const lastX = useRef(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        className="font-mono"
        style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(245,240,232,0.35)' }}
      >
        PERSPECTIVE ROTATOR
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => onRotate(-15)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid rgba(196,130,26,0.4)',
            background: 'transparent',
            color: '#e8a84a',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ◂
        </button>

        {/* Globe SVG */}
        <svg
          viewBox="0 0 80 80"
          style={{ width: 80, height: 80, cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={(e) => { setDragging(true); lastX.current = e.clientX }}
          onMouseMove={(e) => {
            if (!dragging) return
            const dx = e.clientX - lastX.current
            lastX.current = e.clientX
            onRotate(dx * 1.5)
          }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          {/* Globe body */}
          <circle cx="40" cy="40" r="34" fill="rgba(196,130,26,0.08)" stroke="rgba(196,130,26,0.3)" strokeWidth="1.2" />

          {/* Latitude lines */}
          {[-20, 0, 20].map((lat, i) => (
            <ellipse
              key={i}
              cx="40"
              cy={40 + lat}
              rx="34"
              ry={Math.abs(lat) === 20 ? 14 : 34}
              fill="none"
              stroke="rgba(196,130,26,0.18)"
              strokeWidth="0.8"
            />
          ))}

          {/* Longitude lines (rotating) */}
          {[-60, -30, 0, 30, 60].map((lon, i) => {
            const offset = ((rotation + lon) % 180 + 180) % 180
            const rx = 34 * Math.abs(Math.cos((offset * Math.PI) / 180))
            return (
              <ellipse
                key={i}
                cx="40"
                cy="40"
                rx={Math.max(1, rx)}
                ry="34"
                fill="none"
                stroke="rgba(196,130,26,0.18)"
                strokeWidth="0.8"
              />
            )
          })}

          {/* Globe highlight */}
          <ellipse cx="32" cy="28" rx="10" ry="7" fill="rgba(255,255,255,0.04)" />
        </svg>

        <button
          onClick={() => onRotate(15)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid rgba(196,130,26,0.4)',
            background: 'transparent',
            color: '#e8a84a',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ▸
        </button>
      </div>

      <div
        className="font-mono"
        style={{ fontSize: 9, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em' }}
      >
        {Math.round(((rotation % 360) + 360) % 360)}°
      </div>
    </div>
  )
}

/* ── Swing Panel ──────────────────────────────────────────── */
function SwingPanel({
  panel,
  globeRotation,
  onSelectLimb,
  isActive,
}: {
  panel: PanelState
  globeRotation: number
  onSelectLimb: (limb: LimbId | null) => void
  isActive: boolean
}) {
  const W = 200, H = 240
  const cx = W / 2, cy = H / 2

  // Compute plane line through center at panel.planeAngle
  const rad = (panel.planeAngle * Math.PI) / 180
  const len = 110
  const px1 = cx - Math.cos(rad) * len
  const py1 = cy - Math.sin(rad) * len
  const px2 = cx + Math.cos(rad) * len
  const py2 = cy + Math.sin(rad) * len

  const planeColor = panel.planeLocked ? '#7eb872' : panel.selectedLimb ? '#c84a4a' : 'rgba(245,240,232,0.2)'

  const perspY = Math.sin((globeRotation * Math.PI) / 180) * 15

  return (
    <div
      style={{
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${isActive ? 'rgba(196,130,26,0.35)' : 'rgba(245,240,232,0.08)'}`,
        transition: 'border-color 0.3s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => onSelectLimb(panel.selectedLimb)}
    >
      {/* Panel label */}
      <div
        style={{
          padding: '10px 14px',
          background: 'rgba(18,16,10,0.6)',
          borderBottom: '1px solid rgba(245,240,232,0.06)',
        }}
      >
        <div
          className="font-mono"
          style={{ fontSize: 10, letterSpacing: '0.2em', color: isActive ? '#e8a84a' : 'rgba(245,240,232,0.45)' }}
        >
          {panel.name.toUpperCase()}
        </div>
      </div>

      {/* SVG golfer */}
      <div style={{ flex: 1, background: '#0a0a0a', position: 'relative' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <g transform={`translate(0, ${perspY * 0.3})`}>
            {/* Ground */}
            <rect x="0" y={H - 28} width={W} height="28" fill="#1a2e18" />
            {/* Shadow */}
            <ellipse cx={cx} cy={H - 24} rx="28" ry="4" fill="rgba(0,0,0,0.45)" />

            {(() => {
              const spine   = panel.limbs.find((l) => l.id === 'spine')!
              const rArm    = panel.limbs.find((l) => l.id === 'right-arm')!
              const lArm    = panel.limbs.find((l) => l.id === 'left-arm')!
              const rLeg    = panel.limbs.find((l) => l.id === 'right-leg')!
              const lLeg    = panel.limbs.find((l) => l.id === 'left-leg')!

              const locked  = panel.planeLocked
              const limbCol = (id: LimbId) =>
                locked ? '#7eb872' : panel.selectedLimb === id ? '#c84a4a' : '#9aa4a8'
              const bodyCol = locked ? '#7eb872' : '#9aa4a8'
              const dimCol  = locked ? '#5a8e5a' : '#6a7a80'

              // Draw a capsule between two points at given half-width
              const Capsule = ({
                id, x1, y1, x2, y2, r,
              }: { id: LimbId; x1: number; y1: number; x2: number; y2: number; r: number }) => {
                const dx = x2 - x1, dy = y2 - y1
                const angle = Math.atan2(dy, dx) * 180 / Math.PI
                const len   = Math.sqrt(dx * dx + dy * dy)
                const col   = limbCol(id)
                return (
                  <g
                    transform={`translate(${x1},${y1}) rotate(${angle})`}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); onSelectLimb(id) }}
                  >
                    <rect x={0} y={-r} width={len} height={r * 2} rx={r} fill={col} style={{ transition: 'fill 0.25s' }} />
                    {/* subtle highlight sheen */}
                    <rect x={r} y={-r * 0.5} width={Math.max(0, len - r * 2)} height={r * 0.6} rx={r * 0.3}
                      fill="rgba(255,255,255,0.12)" />
                  </g>
                )
              }

              const headCx = spine.x1
              const headCy = spine.y1 - 16
              const shoulderY = spine.y1 + 2
              const hipY = spine.y2

              return (
                <>
                  {/* Legs — behind torso */}
                  <Capsule id="left-leg"  x1={lLeg.x1} y1={lLeg.y1} x2={lLeg.x2} y2={lLeg.y2} r={5} />
                  <Capsule id="right-leg" x1={rLeg.x1} y1={rLeg.y1} x2={rLeg.x2} y2={rLeg.y2} r={5} />
                  {/* Knee dots */}
                  {[lLeg, rLeg].map((leg, i) => {
                    const mx = (leg.x1 + leg.x2) / 2, my = (leg.y1 + leg.y2) / 2
                    return <circle key={i} cx={mx} cy={my} r={3.5} fill={dimCol} style={{ transition: 'fill 0.25s' }} />
                  })}

                  {/* Torso */}
                  <rect
                    x={spine.x1 - 13} y={spine.y1}
                    width={26} height={spine.y2 - spine.y1}
                    rx={6}
                    fill={bodyCol}
                    style={{ transition: 'fill 0.25s' }}
                    onClick={(e) => { e.stopPropagation(); onSelectLimb('spine') }}
                  />
                  {/* Torso highlight */}
                  <rect x={spine.x1 - 6} y={spine.y1 + 4} width={10} height={(spine.y2 - spine.y1) * 0.45}
                    rx={4} fill="rgba(255,255,255,0.10)" />
                  {/* Waist seam */}
                  <line
                    x1={spine.x1 - 13} y1={(spine.y1 + spine.y2) / 2}
                    x2={spine.x1 + 13} y2={(spine.y1 + spine.y2) / 2}
                    stroke={dimCol} strokeWidth="1" style={{ transition: 'stroke 0.25s' }}
                  />

                  {/* Arms — in front of torso */}
                  <Capsule id="right-arm" x1={rArm.x1} y1={rArm.y1} x2={rArm.x2} y2={rArm.y2} r={4} />
                  <Capsule id="left-arm"  x1={lArm.x1} y1={lArm.y1} x2={lArm.x2} y2={lArm.y2} r={4} />

                  {/* Shoulder plate */}
                  <ellipse cx={spine.x1} cy={shoulderY} rx={15} ry={5}
                    fill={bodyCol} style={{ transition: 'fill 0.25s' }} />
                  {/* Hip plate */}
                  <ellipse cx={spine.x1} cy={hipY} rx={13} ry={4}
                    fill={bodyCol} style={{ transition: 'fill 0.25s' }} />

                  {/* Shoulder joint dots */}
                  {[rArm, lArm].map((arm, i) => (
                    <circle key={i} cx={arm.x1} cy={arm.y1} r={3.5} fill={dimCol} style={{ transition: 'fill 0.25s' }} />
                  ))}

                  {/* Neck */}
                  <rect x={headCx - 3} y={headCy + 13} width={6} height={7}
                    rx={3} fill={bodyCol} style={{ transition: 'fill 0.25s' }} />

                  {/* Head */}
                  <ellipse
                    cx={headCx} cy={headCy} rx={11} ry={13}
                    fill={bodyCol}
                    style={{ transition: 'fill 0.25s' }}
                  />
                  {/* Head highlight */}
                  <ellipse cx={headCx - 3} cy={headCy - 4} rx={4} ry={5} fill="rgba(255,255,255,0.14)" />
                </>
              )
            })()}

            {/* Plane line */}
            {panel.selectedLimb && (
              <>
                <line
                  x1={px1}
                  y1={py1}
                  x2={px2}
                  y2={py2}
                  stroke={planeColor}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0.85"
                  style={{ transition: 'stroke 0.3s' }}
                />
                {/* Angle label */}
                <text
                  x={W - 8}
                  y={H - 35}
                  textAnchor="end"
                  fill={planeColor}
                  fontSize="10"
                  fontFamily="DM Mono,monospace"
                  style={{ transition: 'fill 0.3s' }}
                >
                  {panel.planeAngle}°
                </text>
              </>
            )}

            {/* Lock indicator */}
            {panel.planeLocked && (
              <text x={cx} y="22" textAnchor="middle" fill="#7eb872" fontSize="9" fontFamily="DM Mono,monospace">
                ✓ PLANE LOCKED
              </text>
            )}
          </g>
        </svg>
      </div>
    </div>
  )
}

/* ── Planes Found Status ──────────────────────────────────── */
function PlaneStatus({ count, total = 3 }: { count: number; total?: number }) {
  const configs = [
    { min: 3, bg: '#1a3a1a', border: '#7eb872', text: '#7eb872', label: `${count}/${total} planes found` },
    { min: 1, bg: '#3a1a1a', border: '#c84a4a', text: '#c84a4a', label: `${count}/${total} planes found` },
    { min: 0, bg: 'rgba(245,240,232,0.06)', border: 'rgba(245,240,232,0.15)', text: 'rgba(245,240,232,0.5)', label: 'No planes found' },
  ]

  const cfg = configs.find((c) => count >= c.min)!

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 16,
      }}
    >
      {[0, 1, 2].map((i) => {
        const found = i < count
        const isLastFound = i === count - 1
        const bg = found ? (count === 3 ? 'rgba(74,124,89,0.3)' : 'rgba(200,74,74,0.25)') : 'rgba(245,240,232,0.05)'
        const border = found ? (count === 3 ? '#7eb872' : '#c84a4a') : 'rgba(245,240,232,0.12)'
        const textCol = found ? (count === 3 ? '#7eb872' : '#c84a4a') : 'rgba(245,240,232,0.35)'
        return (
          <div
            key={i}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              border: `1px solid ${border}`,
              background: bg,
              textAlign: 'center',
              transition: 'all 0.4s',
            }}
          >
            <div
              className="font-mono"
              style={{ fontSize: 12, color: textCol, letterSpacing: '0.1em', transition: 'color 0.4s' }}
            >
              {found ? (count === 3 ? `3/3 planes found` : `${count}/3 planes found`) : '0/3 planes found'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Mechanics Education ──────────────────────────────────── */
function MechanicsSection() {
  return (
    <section style={{ background: '#f5f0e8', padding: '80px 40px', color: '#1a1510' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 className="font-sans" style={{ fontSize: 42, fontWeight: 300, marginBottom: 32 }}>
          The Mechanics
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3020', marginBottom: 24 }}>
              A one-plane swing — like Ben Hogan's — has the left arm and shoulder rotating on
              the same inclined plane throughout the swing. A two-plane swing — like Jack
              Nicklaus's — has the arms on a higher plane than the shoulders at the top.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3020', marginBottom: 24 }}>
              Staying on plane creates the most kinetically efficient and energy-efficient swing.
              The kinetic chain transfers energy from the ground through the legs, hips, torso,
              shoulders, arms, and finally the club head.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3a3020' }}>
              Off-plane swings force compensations at impact that reduce consistency. Even tour
              players use tools — foam balls, plane boards, and alignment sticks — to groove
              correct positions.
            </p>
          </div>

          {/* Swing plane diagram */}
          <div style={{ border: '1px solid rgba(26,21,16,0.12)', borderRadius: 12, padding: 24, background: '#fff' }}>
            <svg viewBox="0 0 300 260" style={{ width: '100%' }}>
              <text x="150" y="16" textAnchor="middle" fontSize="10" fill="#1a1510" fontFamily="DM Sans,sans-serif" fontWeight="600">
                One-Plane vs Two-Plane Swing
              </text>

              {/* Ground */}
              <line x1="20" y1="230" x2="280" y2="230" stroke="#1a1510" strokeWidth="1.5" />

              {/* Ball */}
              <circle cx="150" cy="226" r="5" fill="#1a1510" />

              {/* One-plane (solid) */}
              <line x1="150" y1="226" x2="70" y2="60" stroke="#1a1510" strokeWidth="1.5" />
              <text x="55" y="55" fontSize="8" fill="#1a1510" fontFamily="DM Mono,monospace">1-plane</text>

              {/* Two-plane (dashed) */}
              <line x1="150" y1="226" x2="110" y2="48" stroke="#555" strokeWidth="1.5" strokeDasharray="5 3" />
              <text x="95" y="43" fontSize="8" fill="#555" fontFamily="DM Mono,monospace">2-plane</text>

              {/* Shoulder plane */}
              <line x1="150" y1="226" x2="40" y2="120" stroke="#1a1510" strokeWidth="1" strokeDasharray="3 3" />
              <text x="28" y="118" fontSize="7" fill="#888" fontFamily="DM Mono,monospace">shoulder</text>

              {/* Angle arcs */}
              <path d="M 160 208 A 25 25 0 0 1 140 190" fill="none" stroke="#1a1510" strokeWidth="0.8" />
              <text x="168" y="200" fontSize="8" fill="#1a1510" fontFamily="DM Mono,monospace">45°</text>

              {/* Kinetic chain */}
              <text x="10" y="248" fontSize="8" fill="#888" fontFamily="DM Sans,sans-serif">Ground → Legs → Hips → Torso → Arms → Clubhead</text>
            </svg>
          </div>
        </div>

        {/* Pro reference */}
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
            Pictures of professional players using different tools to help their swing stay on
            plane, such as foam balls. John Rahm uses a 1-plane swing; contrast him to an obvious
            2-plane swing player like Jim Furyk. Both are effective — but understanding your
            natural plane helps you train more efficiently.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Oolong Page ──────────────────────────────────────────── */
export default function OolongPage({ setPage }: { setPage: (p: Page) => void }) {
  const [panels, setPanels] = useState<PanelState[]>(buildInitialPanels)
  const [activePanelIdx, setActivePanelIdx] = useState<number | null>(null)
  const [globeRotation, setGlobeRotation] = useState(0)
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Arrow key handler for plane adjustment
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activePanelIdx === null) return
      const step = e.shiftKey ? 1 : 5
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault()
        setPanels((prev) =>
          prev.map((p, i) => {
            if (i !== activePanelIdx || p.planeLocked) return p
            const newAngle = (p.planeAngle + step + 360) % 360
            const locked = Math.abs(newAngle - p.targetAngle) <= 8
            return { ...p, planeAngle: newAngle, planeLocked: locked }
          })
        )
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault()
        setPanels((prev) =>
          prev.map((p, i) => {
            if (i !== activePanelIdx || p.planeLocked) return p
            const newAngle = (p.planeAngle - step + 360) % 360
            const locked = Math.abs(newAngle - p.targetAngle) <= 8
            return { ...p, planeAngle: newAngle, planeLocked: locked }
          })
        )
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activePanelIdx])

  const selectLimb = useCallback(
    (panelIdx: number, limb: LimbId | null) => {
      setActivePanelIdx(panelIdx)
      setPanels((prev) =>
        prev.map((p, i) =>
          i === panelIdx ? { ...p, selectedLimb: limb ?? ('right-arm' as LimbId) } : p
        )
      )
    },
    [],
  )

  const handleGlobeRotate = useCallback((delta: number) => {
    setGlobeRotation((r) => r + delta)
  }, [])

  const foundCount = panels.filter((p) => p.planeLocked).length

  const resetPlanes = () => {
    setPanels(buildInitialPanels())
    setActivePanelIdx(null)
  }

  return (
    <div>
      {/* ── Oolong Background ── */}
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            background: 'linear-gradient(160deg, #1a0d05 0%, #4a2a10 30%, #7a4820 60%, #b87018 100%)',
          }}
        >
          <div
            className={filled ? 'tea-fill-up' : ''}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, #1a0d05 0%, #4a2a10 30%, #7a4820 60%, #b87018 100%)',
              clipPath: filled ? undefined : 'inset(0 0 100% 0)',
            }}
          />
          {/* Oolong amber swirl */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 65% 30%, rgba(228,168,74,0.18) 0%, transparent 55%)',
              animation: 'swirlSlow 22s linear infinite reverse',
              transformOrigin: '65% 30%',
            }}
          />
          {/* Pouring stream */}
          <div
            style={{
              position: 'absolute',
              left: '42%',
              top: '-15%',
              width: '14%',
              height: '130%',
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(196,130,26,0.38) 20%, rgba(139,94,60,0.3) 60%, rgba(196,130,26,0.22) 80%, transparent 100%)',
              filter: 'blur(14px)',
              animation: 'oolongFlow 4s linear infinite',
              backgroundSize: '100% 300%',
            }}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.35em', color: '#e8a84a', marginBottom: 8 }}>
                OOLONG TEE — ADVANCED / PROFESSIONAL
              </div>
              <h1 className="font-sans" style={{ fontSize: 52, fontWeight: 300, color: '#f5f0e8', lineHeight: 1 }}>
                Swing Planes
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.5)', marginTop: 10, maxWidth: 420, lineHeight: 1.65 }}>
                Click each limb to view the plane. Use the rotator to view different
                perspectives. Press ← → to find the optimal position.
              </p>
            </div>

            <GlobeWidget rotation={globeRotation} onRotate={handleGlobeRotate} />
          </div>

          {/* ── Swing Panels ── */}
          <div className="glass-dark" style={{ padding: 28, marginBottom: 24 }}>
            {/* Keyboard hint */}
            {activePanelIdx !== null && !panels[activePanelIdx].planeLocked && (
              <div
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: 'rgba(245,240,232,0.4)',
                  textAlign: 'center',
                  marginBottom: 14,
                  letterSpacing: '0.15em',
                }}
              >
                ← → TO ADJUST PLANE &nbsp;·&nbsp; SHIFT + ← → FOR FINE CONTROL
              </div>
            )}

            <div style={{ display: 'flex', gap: 16, height: 320 }}>
              {panels.map((panel, i) => (
                <SwingPanel
                  key={panel.name}
                  panel={panel}
                  globeRotation={globeRotation}
                  onSelectLimb={(limb) => selectLimb(i, limb)}
                  isActive={activePanelIdx === i}
                />
              ))}
            </div>

            {/* Planes found status */}
            <PlaneStatus count={foundCount} />

            {/* Reset button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
              <button
                onClick={resetPlanes}
                style={{
                  padding: '6px 18px',
                  borderRadius: 8,
                  border: '1px solid rgba(245,240,232,0.15)',
                  background: 'transparent',
                  color: 'rgba(245,240,232,0.4)',
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: 'DM Mono,monospace',
                  letterSpacing: '0.12em',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f5f0e8'
                  e.currentTarget.style.borderColor = 'rgba(245,240,232,0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(245,240,232,0.4)'
                  e.currentTarget.style.borderColor = 'rgba(245,240,232,0.15)'
                }}
              >
                RESET PLANES
              </button>
            </div>
          </div>

          {/* Selected panel info */}
          {activePanelIdx !== null && (
            <div
              className="glass-dark fade-slide-up"
              style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
            >
              <div style={{ display: 'flex', gap: 32 }}>
                <div>
                  <div className="font-mono" style={{ fontSize: 9, color: 'rgba(245,240,232,0.35)', letterSpacing: '0.2em' }}>PHASE</div>
                  <div style={{ fontSize: 16, color: '#e8a84a', fontWeight: 600, marginTop: 2 }}>{panels[activePanelIdx].name}</div>
                </div>
                <div>
                  <div className="font-mono" style={{ fontSize: 9, color: 'rgba(245,240,232,0.35)', letterSpacing: '0.2em' }}>PLANE ANGLE</div>
                  <div className="font-mono" style={{ fontSize: 16, color: '#f5f0e8', marginTop: 2 }}>
                    {panels[activePanelIdx].planeAngle}°
                  </div>
                </div>
                <div>
                  <div className="font-mono" style={{ fontSize: 9, color: 'rgba(245,240,232,0.35)', letterSpacing: '0.2em' }}>TARGET</div>
                  <div className="font-mono" style={{ fontSize: 16, color: 'rgba(245,240,232,0.5)', marginTop: 2 }}>
                    {panels[activePanelIdx].targetAngle}° ± 8°
                  </div>
                </div>
              </div>
              <div>
                {panels[activePanelIdx].planeLocked ? (
                  <div
                    style={{
                      padding: '6px 16px',
                      borderRadius: 8,
                      background: 'rgba(74,124,89,0.3)',
                      border: '1px solid #7eb872',
                      color: '#7eb872',
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'DM Mono,monospace',
                      letterSpacing: '0.15em',
                    }}
                  >
                    ✓ PLANE FOUND
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '6px 16px',
                      borderRadius: 8,
                      background: 'rgba(200,74,74,0.2)',
                      border: '1px solid rgba(200,74,74,0.4)',
                      color: '#c84a4a',
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'DM Mono,monospace',
                      letterSpacing: '0.15em',
                    }}
                  >
                    ADJUST PLANE
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mechanics Section ── */}
      <MechanicsSection />

      {/* ── Footer ── */}
      <footer style={{ background: '#1a0d05', padding: '48px 40px', textAlign: 'center', borderTop: '1px solid rgba(245,240,232,0.04)' }}>
        <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.25)', maxWidth: 1100, margin: '0 auto', lineHeight: 1.7 }}>
          TeaTee was created by Sophia Joeng to help golfers of all levels connect with the online
          golf community. I want to help golfers understand complex concepts and terminology that
          can otherwise require coaching or extensive resources to learn.
        </p>
      </footer>
    </div>
  )
}
