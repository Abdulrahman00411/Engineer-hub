import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, logout, page, setPage, openModal, totalUnread } = useApp();

  const navItems = user?.role === 'freelancer'
    ? [{ id: 'home', l: 'Home' }, { id: 'jobs', l: 'Find Jobs' }, { id: 'engineers', l: 'Engineers' }, { id: 'gigs', l: 'Gigs' }]
    : [{ id: 'home', l: 'Home' }, { id: 'engineers', l: 'Find Engineers' }, { id: 'jobs', l: 'Browse Jobs' }, { id: 'gigs', l: 'Services' }];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(13,17,23,0.93)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, gap: 12 }}>
        {/* Logo */}
        <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, background: 'var(--accent)',
            clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, fontWeight: 900, color: 'var(--steel)', fontFamily: 'var(--font-d)'
          }}>E</div>
          <span style={{ fontFamily: 'var(--font-d)', fontSize: 19, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-1)' }}>
            Engineers<span style={{ color: 'var(--accent)' }}>Hub</span>
          </span>
        </button>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              background: page === item.id ? 'var(--accent-dim)' : 'none',
              border: page === item.id ? '1px solid var(--border-a)' : '1px solid transparent',
              color: page === item.id ? 'var(--accent)' : 'var(--text-2)',
              padding: '5px 14px', borderRadius: 'var(--r)',
              fontFamily: 'var(--font-d)', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s'
            }}>{item.l}</button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {/* Live dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--r)', border: '1px solid rgba(34,197,94,0.18)' }}>
            <span className="live-dot"></span>
            <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: '#4ADE80' }}>LIVE</span>
          </div>

          {user ? (
            <>
              {/* Messages */}
              <button onClick={() => setPage('messages')} style={{
                position: 'relative', background: page === 'messages' ? 'var(--accent-dim)' : 'var(--steel-light)',
                border: '1px solid var(--border)', borderRadius: 'var(--r)', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, transition: 'all 0.15s'
              }}>
                💬
                {totalUnread > 0 && <span className="notif-badge">{totalUnread}</span>}
              </button>
              {/* Post job (client only) */}
              {user.role === 'client' && (
                <button className="btn btn-primary btn-sm" onClick={() => openModal('postjob')}>+ Post Job</button>
              )}
              {/* Profile menu */}
              <button onClick={() => setPage('dashboard')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px 5px 5px',
                background: page === 'dashboard' ? 'var(--accent-dim)' : 'var(--steel-light)',
                border: page === 'dashboard' ? '1px solid var(--border-a)' : '1px solid var(--border)',
                borderRadius: 'var(--rm)', cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <div className="av av-sm" style={{ background: user.avatar?.bg, color: user.avatar?.color, fontSize: 11, borderColor: (user.avatar?.color || 'var(--accent)') + '44' }}>
                  {user.avatar?.initials || user.name?.[0]}
                </div>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-1)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name?.split(' ')[0]}</span>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>▾</span>
              </button>
              <button className="btn btn-ghost" onClick={logout} style={{ fontSize: 12, color: 'var(--text-3)' }}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => openModal('auth')}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
