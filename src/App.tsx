import { useState } from 'react'
import MainPage from './MainPage'
import BobaPage from './BobaPage'
import MatchaPage from './MatchaPage'
import OolongPage from './OolongPage'

export type Page = 'home' | 'boba' | 'matcha' | 'oolong'

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'boba', label: 'Boba' },
  { id: 'matcha', label: 'Matcha' },
  { id: 'oolong', label: 'Oolong' },
]

export default function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <div style={{ minHeight: '100%', background: 'transparent', color: '#f5f0e8' }}>
      {/* ── Fixed Navigation ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 40px',
          background: 'rgba(18,16,10,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(200,169,110,0.10)',
        }}
      >
        <button
          onClick={() => setPage('home')}
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: '#ffffff',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            transition: 'opacity 0.2s',
          }}
        >
          TEA TEE
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: page === id ? '#ffffff' : 'rgba(255,255,255,0.45)',
                borderBottom: page === id ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent',
                paddingBottom: 2,
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Pages ── */}
      <div style={{ paddingTop: 60 }}>
        {page === 'home' && <MainPage setPage={setPage} />}
        {page === 'boba' && <BobaPage setPage={setPage} />}
        {page === 'matcha' && <MatchaPage setPage={setPage} />}
        {page === 'oolong' && <OolongPage setPage={setPage} />}
      </div>
    </div>
  )
}
