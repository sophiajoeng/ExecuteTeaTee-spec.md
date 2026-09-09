import React, { useState, useEffect } from 'react'
import { Page } from './App'
import kemplakeImg from './imports/kemplake.jpg'
import daochaImg from '@/imports/daocha.jpeg'

/* ── Constants ────────────────────────────────────────────── */
const SLIDES = [
  'You can use a tee to set up your ball before your 1st shot.',
  'You have to be at the first tee before your tee time.',
  'You begin each hole from the tee which is on a tee box.',
]

const TEA_CARDS: {
  id: 'boba' | 'matcha' | 'oolong'
  emoji: string
  name: string
  level: string
  desc: string
  page: Page
  accent: string
}[] = [
  {
    id: 'boba',
    emoji: '🧋',
    name: 'Boba Tee',
    level: 'beginners / weekend / casual golfers',
    desc: 'Boba pearl/straw',
    page: 'boba',
    accent: '#8B5E3C',
  },
  {
    id: 'matcha',
    emoji: '🍵',
    name: 'Matcha Tee',
    level: 'intermediate / amateur / competitive golfers',
    desc: '茶/leaves/powder',
    page: 'matcha',
    accent: '#3d7a4a',
  },
  {
    id: 'oolong',
    emoji: '🫖',
    name: 'Oolong Tee',
    level: 'Expert / professional golfers / coaches',
    desc: '瓷/porcelain china',
    page: 'oolong',
    accent: '#c4821a',
  },
]

const SCORES = [
  { id: 'boba', name: 'Boba Tee', today: 2, week: 247, month: 365, year: 681 },
  { id: 'matcha', name: 'Matcha Tee', today: 0, week: 386, month: 524, year: 1209 },
  { id: 'oolong', name: 'Oolong Tee', today: 1, week: 117, month: 79, year: 421 },
]

/* ── Helpers ──────────────────────────────────────────────── */
function getHighlight(hdcp: number): 'boba' | 'matcha' | 'oolong' {
  if (hdcp <= 5) return 'oolong'
  if (hdcp < 15) return 'matcha'
  return 'boba'
}

function TeeText({ text }: { text: string }) {
  const parts = text.split(/\b(tee)\b/gi)
  return (
    <>
      {parts.map((part, i) =>
        /^tee$/i.test(part) ? (
          <u key={i} style={{ textUnderlineOffset: '2px' }}>
            {part}
          </u>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

/* ── SVG displacement filter (rendered once, off-screen) ─── */
function LiquidGlassFilters() {
  return (
    <svg
      aria-hidden
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <filter
          id="lg-displace"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="linearRGB"
        >
          <feGaussianBlur stdDeviation="22" result="blurred" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022 0.018"
            numOctaves="3"
            seed="6"
            stitchTiles="stitch"
            result="noise"
          />
          <feDisplacementMap
            in="blurred"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}

/* ── Glass panel variants ─────────────────────────────────── */
function GlassPanel({
  children,
  tint,
  style,
}: {
  children: React.ReactNode
  tint: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className="liquid-glass"
      style={style}
    >
      {/* Distorted background lens */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${kemplakeImg})`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center 60%',
          filter: 'url(#lg-displace)',
          transform: 'scale(1.1)',
        }}
      />
      {/* Colour tint + blur */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: tint,
          backdropFilter: 'blur(18px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 4 }}>{children}</div>
    </div>
  )
}

/* White glass — Row 1 */
function WhiteGlass({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <GlassPanel tint="rgba(255,255,255,0.72)" style={style}>{children}</GlassPanel>
}

/* Beige glass — Boba card */
function BeigeGlass({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <GlassPanel tint="rgba(220,195,155,0.62)" style={style}>{children}</GlassPanel>
}

/* Grassy green glass — Matcha card */
function GreenGlass({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <GlassPanel tint="rgba(68,120,60,0.52)" style={style}>{children}</GlassPanel>
}

/* Brown glass — Oolong card */
function BrownGlass({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <GlassPanel tint="rgba(110,62,28,0.58)" style={style}>{children}</GlassPanel>
}

/* ── Main Page ────────────────────────────────────────────── */
export default function MainPage({ setPage }: { setPage: (p: Page) => void }) {
  const [slideIdx, setSlideIdx] = useState(0)
  const [slideVisible, setSlideVisible] = useState(true)
  const [hdcp, setHdcp] = useState(18)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const highlighted = getHighlight(hdcp)

  /* Slide auto-rotation with fade */
  useEffect(() => {
    const id = setInterval(() => {
      setSlideVisible(false)
      setTimeout(() => {
        setSlideIdx((i) => (i + 1) % SLIDES.length)
        setSlideVisible(true)
      }, 350)
    }, 10000)
    return () => clearInterval(id)
  }, [])

  const changeHdcp = (delta: number) => {
    setHdcp((h) => Math.round(Math.max(-5, Math.min(36, h + delta)) * 10) / 10)
  }

  const handleJoin = () => {
    if (!email.trim()) return
    setJoined(true)
    setTimeout(() => {
      setEmail('')
      setJoined(false)
    }, 2200)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'DM Sans, system-ui, sans-serif',
        position: 'relative',
      }}
    >
      {/* SVG displacement filter defs */}
      <LiquidGlassFilters />

      {/* ── Golf course background ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
        }}
      >
        <img
          src={kemplakeImg}
          alt="Kemp Lake Golf Course"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        {/* Opaque glass veil over the whole background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.28)',
            backdropFilter: 'blur(5px) saturate(1.15)',
            WebkitBackdropFilter: 'blur(5px) saturate(1.15)',
          }}
        />
      </div>

      {/* ── Centred content panel ── */}
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '20px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* ══ ROW 1 — Title + HDCP + Slide ══ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto 1fr',
            gap: 10,
            alignItems: 'stretch',
          }}
        >
          {/* TEA / TEE stacked title — compromised smaller to share space with HDCP */}
          <WhiteGlass
            style={{
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: '#111',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              TEA
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: '#111',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              TEE
            </div>
          </WhiteGlass>

          {/* HDCP box */}
          <GlassPanel
            tint="rgba(10,10,10,0.78)"
            style={{
              padding: '10px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              width: 100,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
              }}
            >
              HDCP
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {hdcp >= 0 ? '+' : ''}
              {hdcp.toFixed(1)}
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {[
                { label: '−', delta: -1 },
                { label: '+', delta: 1 },
              ].map(({ label, delta }) => (
                <button
                  key={label}
                  onClick={() => changeHdcp(delta)}
                  style={{
                    width: 28,
                    height: 24,
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: 1,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </GlassPanel>

          {/* Slide — top right */}
          <div
            className="liquid-glass"
            style={{
              padding: '20px 28px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Daocha photo — flipped horizontally */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                backgroundImage: `url(${daochaImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: 'scaleX(-1)',
              }}
            />
            {/* Frosted glass tint over photo */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                background: 'rgba(255,255,255,0.52)',
                backdropFilter: 'blur(14px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
              }}
            />
            {/* Content above the glass layers */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 450,
                color: '#1a1a1a',
                lineHeight: 1.6,
                textAlign: 'center',
                opacity: slideVisible ? 1 : 0,
                transform: slideVisible ? 'translateY(0)' : 'translateY(4px)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              <TeeText text={SLIDES[slideIdx]} />
            </div>

            {/* Dot pagination — pinned near bottom */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', paddingTop: 14 }}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSlideVisible(false)
                    setTimeout(() => {
                      setSlideIdx(i)
                      setSlideVisible(true)
                    }, 250)
                  }}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    border: 'none',
                    background: i === slideIdx ? '#333' : 'rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
            </div>
          </div>
        </div>

        {/* ══ ROW 2 — Three Tea Cards (grassy green glass) ══ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
          }}
        >
          {TEA_CARDS.map((card) => {
            const isHL = card.id === highlighted
            const CardGlass = card.id === 'boba' ? BeigeGlass : card.id === 'oolong' ? BrownGlass : GreenGlass
            return (
              <CardGlass
                key={card.id}
                style={{
                  border: isHL ? `2px solid rgba(255,255,255,0.85)` : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  transform: isHL ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isHL
                    ? '0 0 0 3px rgba(255,255,255,0.35), 0 8px 32px rgba(0,0,0,0.35), 0 0 24px rgba(255,255,255,0.18)'
                    : '0 2px 8px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                }}
              >
                <button
                  onClick={() => setPage(card.page)}
                  style={{
                    width: '100%',
                    padding: '14px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <div style={{ fontSize: 30, lineHeight: 1 }}>{card.emoji}</div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '-0.01em',
                      marginTop: 2,
                      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                  >
                    {card.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.82)',
                      lineHeight: 1.45,
                      fontWeight: 400,
                      textAlign: 'center',
                    }}
                  >
                    {card.level}
                  </div>
                  {isHL && (
                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: 'rgba(255,255,255,0.9)',
                        textTransform: 'uppercase',
                      }}
                    >
                      ← Your level
                    </div>
                  )}
                </button>
              </CardGlass>
            )
          })}
        </div>

        {/* ══ ROW 3 — Floating scorecard rows (no glass box) ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Header row — 5 equal columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              padding: '8px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.18)',
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              Join Our Community
            </span>
            {['Today', 'This Week', 'This Month', 'This Year'].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(40,40,40,0.9)',
                  letterSpacing: '0.02em',
                  textAlign: 'right',
                  textShadow: '0 1px 2px rgba(255,255,255,0.4)',
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Tea rows */}
          {SCORES.map((row) => {
            const card = TEA_CARDS.find((c) => c.id === row.id)!
            const isHL = row.id === highlighted
            const rowBg =
              row.id === 'boba'   ? 'rgba(220,195,155,0.45)'
              : row.id === 'matcha' ? 'rgba(134,196,127,0.35)'
              : 'rgba(110,62,28,0.35)'
            return (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  padding: '9px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.10)',
                  background: rowBg,
                  borderRadius: isHL ? 8 : 4,
                  marginBottom: 2,
                  outline: isHL ? '1.5px solid rgba(255,255,255,0.35)' : 'none',
                  transition: 'outline 0.3s',
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111',
                    textShadow: 'none',
                  }}
                >
                  {row.name}
                </span>
                {[row.today, row.week, row.month, row.year].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      textAlign: 'right',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: 12,
                      color: isHL ? '#fff' : 'rgba(255,255,255,0.80)',
                      fontWeight: isHL ? 600 : 400,
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            )
          })}

          {/* Anonymous rows */}
          {['Anonymous 1', 'Anonymous 2', 'Anonymous 3', 'Anonymous 4'].map((name) => (
            <div
              key={name}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                padding: '7px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: 12, color: 'rgba(50,50,50,0.85)', textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}>
                {name}
              </span>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  style={{
                    textAlign: 'right',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.60)',
                  }}
                >
                  —
                </span>
              ))}
            </div>
          ))}

          {/* Player's Signature */}
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#111', whiteSpace: 'nowrap' }}>
              Player's Signature
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="sign up with your email"
              className="email-input"
              style={{
                flex: 1,
                border: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.4)',
                background: 'transparent',
                padding: '4px 2px',
                fontSize: 13,
                color: '#111',
                outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
                minWidth: 0,
              }}
            />
            <button
              onClick={handleJoin}
              style={{
                padding: '7px 18px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.22)',
                background: joined ? 'rgba(40,100,55,0.85)' : 'rgba(10,10,10,0.75)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                transition: 'background 0.25s',
                whiteSpace: 'nowrap',
              }}
            >
              {joined ? '✓ Joined' : 'JOIN'}
            </button>
          </div>
        </div>

        {/* ══ ROW 4 — Footer — free-standing, no box ══ */}
        <p
          style={{
            margin: 0,
            padding: '4px 2px 8px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.65,
            fontWeight: 400,
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}
        >
          TeaTee was created by Sophia Joeng to help golfers of all levels connect with the
          online golf community. I want to allow all golfers to understand complex concepts &
          terminology that can otherwise require coaching or extensive resources to learn.
        </p>
      </div>
    </div>
  )
}

