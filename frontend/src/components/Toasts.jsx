import { useApp } from '../context/AppContext';

export default function Toasts() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '12px 18px', borderRadius: 'var(--rm)', fontSize: 13, fontFamily: 'var(--font-b)',
          background: t.type === 'error' ? 'rgba(239,68,68,0.9)' : t.type === 'info' ? 'rgba(37,99,235,0.9)' : 'rgba(22,160,100,0.92)',
          color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)', animation: 'slideUp 0.25s ease',
          maxWidth: 320, lineHeight: 1.5
        }}>{t.msg}</div>
      ))}
    </div>
  );
}
