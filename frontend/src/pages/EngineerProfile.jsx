import { useState } from 'react';
import { useApp } from '../context/AppContext';

function StarRating({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => <span key={i} style={{ opacity: i <= Math.round(rating) ? 1 : 0.25 }}>★</span>)}
    </span>
  );
}

function ContactModal({ engineer, onClose }) {
  const { user, sendMessage, setPage, openModal, toast } = useApp();
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!msg.trim()) return;
    sendMessage(engineer.id, msg);
    setSent(true);
    setTimeout(() => { onClose(); setPage('messages'); }, 1500);
  };

  if (!user) return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 360, textAlign: 'center' }}>
        <div className="modal-body" style={{ padding: '2rem' }}>
          <div style={{ fontSize: 40, marginBottom: '1rem' }}>🔐</div>
          <h3 style={{ marginBottom: 8 }}>Login Required</h3>
          <p style={{ fontSize: 14, marginBottom: '1.5rem' }}>Please log in first to contact.</p>
          <button className="btn btn-primary btn-full" onClick={() => { onClose(); openModal('auth'); }}>Login / Register</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 460 }}>
        <div className="modal-hd">
          <h3>Contact {engineer.name}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
              <h4>Message Bhej Diya!</h4>
              <p style={{ fontSize: 14 }}>Go to the messages section to check the response</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '1rem', background: 'var(--steel-light)', borderRadius: 'var(--rm)', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                <div className="av av-md" style={{ background: engineer.avatar?.bg, color: engineer.avatar?.color }}>
                  {engineer.avatar?.initials}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-d)', fontSize: 15, fontWeight: 600 }}>{engineer.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{engineer.title} · {engineer.location}</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Type your message</label>
                <textarea className="form-input" rows={4} placeholder="Hello! I want to discuss a project with you…" value={msg} onChange={e => setMsg(e.target.value)} />
              </div>
              <div className="alert alert-warn mt-2" style={{ fontSize: 12 }}>
                🔒Contact on the platform only — no need to share your phone number
              </div>
              <button className="btn btn-primary btn-full mt-2" onClick={handleSend} disabled={!msg.trim()}>
                💬 send message
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HireModal({ engineer, onClose }) {
  const { user, openModal, closeModal, toast, setPage } = useApp();
  const [sel, setSel] = useState(null);
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState('jazzcash');
  const [payDetail, setPayDetail] = useState('');
  const [done, setDone] = useState(false);

  if (!user) return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 360, textAlign: 'center' }}>
        <div className="modal-body" style={{ padding: '2rem' }}>
          <div style={{ fontSize: 40, marginBottom: '1rem' }}>🔐</div>
          <h3 style={{ marginBottom: 8 }}>Login Required</h3>
          <button className="btn btn-primary btn-full" onClick={() => { onClose(); openModal('auth'); }}>Login / Register</button>
        </div>
      </div>
    </div>
  );

  const gig = engineer; // Using engineer as base for hire

  const handlePay = () => {
    setDone(true);
    toast('Payment instructions have been sent! The engineer has been asked to start the work. 🎉');
    setTimeout(onClose, 2500);
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 500 }}>
        <div className="modal-hd">
          <h3>Hire {engineer.name}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {done ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: 52 }}>✅</div>
              <h3 style={{ color: 'var(--green)', marginTop: 12 }}>Order Confirm!</h3>
              <p>Engineer ko notification bhej diya gaya</p>
            </div>
          ) : step === 1 ? (
            <>
              <div style={{ marginBottom: '1rem', fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payment Method</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                {[
                  { id: 'jazzcash', icon: '📱', name: 'JazzCash', desc: '0311-1234567 — Muhammad Ahmad', color: '#E91E63' },
                  { id: 'easypaisa', icon: '📱', name: 'EasyPaisa', desc: '0300-9876543 — EngineersHub PK', color: '#4CAF50' },
                  { id: 'bank', icon: '🏦', name: 'Bank Transfer', desc: 'MCB Bank — IBAN: PK36MUCB...', color: '#2563EB' },
                  { id: 'crypto', icon: '🔶', name: 'USDT / Crypto', desc: 'TRC20 wallet address', color: '#F0A500' }
                ].map(pm => (
                  <div key={pm.id} className={`pay-opt ${payMethod === pm.id ? 'sel' : ''}`} onClick={() => setPayMethod(pm.id)}>
                    <span style={{ fontSize: 24 }}>{pm.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: payMethod === pm.id ? 'var(--accent)' : 'var(--text-1)' }}>{pm.name}</div>
                      <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{pm.desc}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payMethod === pm.id ? 'var(--accent)' : 'var(--border)'}`, background: payMethod === pm.id ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--steel)', fontWeight: 700 }}>
                      {payMethod === pm.id ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Hourly Rate / Project Budget ($)</label>
                <input className="form-input" type="number" placeholder={`Engineer rate: $${engineer.hourlyRate}/hr`} value={payDetail} onChange={e => setPayDetail(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-full mt-2" onClick={() => setStep(2)}>Next: Confirm →</button>
            </>
          ) : (
            <>
              <div style={{ padding: '1.25rem', background: 'var(--steel-light)', borderRadius: 'var(--rm)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Order Summary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-dim">Engineer</span>
                    <span>{engineer.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-dim">Rate</span>
                    <span className="text-accent">{payDetail ? `$${payDetail}` : `$${engineer.hourlyRate}/hr`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-dim">Payment</span>
                    <span style={{ textTransform: 'capitalize' }}>{payMethod}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-dim">Platform Fee</span>
                    <span className="badge badge-green">8% only</span>
                  </div>
                </div>
              </div>
              <div className="alert alert-warn" style={{ marginBottom: '1rem', fontSize: 12 }}>
                💡 Payment only goes to EngineersHub escrow. It is released to the engineer after the work is completed.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePay}>✅ Confirm & Pay</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EngineerProfile({ engineerId }) {
  const { engineers, user, openModal } = useApp();
  const [showContact, setShowContact] = useState(false);
  const [showHire, setShowHire] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const eng = engineers.find(e => e.id === engineerId) || engineers[0];
  if (!eng) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-2)' }}>Engineer nahi mila</div>;

  const completion = (() => {
    let pts = 0;
    if (eng.bio) pts += 20;
    if (eng.skills?.length) pts += 20;
    if (eng.education?.length) pts += 20;
    if (eng.portfolio?.length) pts += 20;
    if (eng.services?.length) pts += 20;
    return pts;
  })();

  return (
    <div className="wrap" style={{ padding: '2rem 1.5rem' }}>
      {showContact && <ContactModal engineer={eng} onClose={() => setShowContact(false)} />}
      {showHire && <HireModal engineer={eng} onClose={() => setShowHire(false)} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
        {/* LEFT */}
        <div>
          {/* Header card */}
          <div className="card card-pad" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div className="av av-lg" style={{ background: eng.avatar?.bg, color: eng.avatar?.color, borderColor: (eng.avatar?.color||'var(--accent)') + '44', fontSize: 20 }}>
                {eng.avatar?.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.5rem' }}>{eng.name}</h2>
                  {eng.verified && <span className="badge badge-green">✅ Verified</span>}
                  <span className={`badge badge-${eng.badgeType}`}>{eng.badge}</span>
                </div>
                <div style={{ color: 'var(--text-2)', fontSize: 15, marginTop: 4 }}>{eng.title}</div>
                <div style={{ color: 'var(--text-3)', fontSize: 13, fontFamily: 'var(--font-m)', marginTop: 4 }}>
                  📍 {eng.location} · Joined {eng.joinedDate?.split('-')[0]}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: eng.available ? 'var(--green)' : 'var(--text-3)' }}></div>
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: eng.available ? '#4ADE80' : 'var(--text-3)' }}>
                  {eng.available ? 'Available' : 'Busy'}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', margin: '1rem 0' }}>
              {[
                { label: 'Rating', val: eng.rating || '—' },
                { label: 'Reviews', val: eng.reviews || 0 },
                { label: 'Jobs Done', val: eng.completedJobs || 0 },
                { label: 'Total Earned', val: eng.totalEarned || '$0' }
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <p style={{ fontSize: 14 }}>{eng.bio || 'No bio yet.'}</p>
          </div>

          {/* Tabs */}
          <div className="tabs mb-2">
            {['overview', 'portfolio', 'education', 'reviews'].map(t => (
              <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}
                style={{ textTransform: 'capitalize', fontSize: 12 }}>{t}</button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Skills */}
              <div className="card card-pad">
                <h4 style={{ marginBottom: '1rem' }}>Skills & Expertise</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {eng.skills?.length ? eng.skills.map(s => <span key={s} className="tag">{s}</span>)
                    : <span className="text-dim" style={{ fontSize: 13 }}>No skills added yet</span>}
                </div>
              </div>
              {/* Services */}
              <div className="card card-pad">
                <h4 style={{ marginBottom: '1rem' }}>Services Offered</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {eng.services?.length ? eng.services.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--steel-light)', borderRadius: 'var(--r)', fontSize: 14, border: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--accent)' }}>✓</span> {s}
                    </div>
                  )) : <span className="text-dim" style={{ fontSize: 13 }}>No services listed yet</span>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="card card-pad">
              <h4 style={{ marginBottom: '1rem' }}>Portfolio</h4>
              {eng.portfolio?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {eng.portfolio.map((p, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'var(--steel-light)', borderRadius: 'var(--rm)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-1)' }}>{p.title}</h4>
                        <span className="badge badge-green">{p.value}</span>
                      </div>
                      <p style={{ fontSize: 13 }}>{p.desc}</p>
                      <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>Year: {p.year}</div>
                    </div>
                  ))}
                </div>
              ) : <p style={{ fontSize: 13 }}>There is no portfolio item</p>}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="card card-pad">
              <h4 style={{ marginBottom: '1rem' }}>Education & Certifications</h4>
              {eng.education?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {eng.education.map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, padding: '1rem', background: 'var(--steel-light)', borderRadius: 'var(--rm)', border: '1px solid var(--border)' }}>
                      <div style={{ width: 40, height: 40, background: 'var(--blue-dim)', borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎓</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-d)', fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>{e.degree}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{e.institute}</div>
                        <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Year: {e.year} · {e.grade}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p style={{ fontSize: 13 }}>There is no education detail </p>}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="card card-pad">
              <h4 style={{ marginBottom: '1rem' }}>Client Reviews</h4>
              {eng.reviewsList?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {eng.reviewsList.map((r, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'var(--steel-light)', borderRadius: 'var(--rm)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{r.client}</span>
                        <span><StarRating rating={r.rating} /></span>
                      </div>
                      <p style={{ fontSize: 13 }}>{r.comment}</p>
                      <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>{r.date}</div>
                    </div>
                  ))}
                </div>
              ) : <p style={{ fontSize: 13 }}>No reviews yet</p>}
            </div>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card card-pad">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-d)', fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>
                ${eng.hourlyRate || '—'}<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text-2)', fontFamily: 'var(--font-b)' }}>/hr</span>
              </div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hourly Rate</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary btn-full" onClick={() => setShowHire(true)}>💼 Hire Now</button>
              <button className="btn btn-outline btn-full" onClick={() => setShowContact(true)}>💬 Contact</button>
            </div>
            <div className="div"></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                { label: 'Response Time', val: '< 2 hours' },
                { label: 'Last Active', val: 'Today' },
                { label: 'Platform Fee', val: '8% only' }
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-dim">{r.label}</span>
                  <span style={{ fontFamily: 'var(--font-m)', fontSize: 12 }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad" style={{ fontSize: 13 }}>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Accepted Payments</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['📱 JazzCash', '📱 EasyPaisa', '🏦 Bank', '🔶 Crypto'].map(p => (
                <span key={p} className="badge badge-gray" style={{ fontSize: 11 }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
