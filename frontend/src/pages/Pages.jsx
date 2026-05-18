import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import EngineerProfile from './EngineerProfile';

// ─── Engineer Category data for hover dropdown ───────────────────────────────
const ENG_CATEGORIES = [
  { icon: '', label: 'Frontend Developers',      desc: 'React, Vue, Angular, UI/UX',        cat: 'Frontend' },
  { icon: '', label: 'Backend Developers',        desc: 'Node.js, Python, APIs, databases', cat: 'Backend' },
  { icon: '', label: 'Full Stack Developers',    desc: 'End-to-end web development',       cat: 'Full Stack' },
  { icon: '', label: 'DevOps & Cloud Engineers',  desc: 'AWS, Docker, CI/CD, Kubernetes',   cat: 'DevOps' },
  { icon: '', label: 'Mobile Developers',          desc: 'React Native, Flutter, iOS/Android', cat: 'Mobile' },
];

// ─── Bid Modal ───────────────────────────────────────────────────────────────
function BidModal({ job, onClose }) {
  const { user, openModal, toast, placeBid } = useApp();
  const [form, setForm] = useState({ amount: '', duration: '', cover: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!user) return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 360, textAlign: 'center' }}>
        <div className="modal-body" style={{ padding: '2rem' }}>
          <div style={{ fontSize: 44, marginBottom: '1rem' }}>🔐</div>
          <h3 style={{ marginBottom: 8 }}>Login Required</h3>
          <p style={{ fontSize: 14, marginBottom: '1.5rem' }}>You must login first to place a bid</p>
          <button className="btn btn-primary btn-full" onClick={() => { onClose(); openModal('auth'); }}>Login / Register</button>
        </div>
      </div>
    </div>
  );

  if (user.role === 'client') return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 360, textAlign: 'center' }}>
        <div className="modal-body" style={{ padding: '2rem' }}>
          <div style={{ fontSize: 44, marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ marginBottom: 8 }}>Clients Cannot Bid</h3>
          <p style={{ fontSize: 14 }}>Only freelancer / engineer accounts can submit bids.</p>
          <button className="btn btn-outline btn-full mt-2" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (!form.amount || !form.cover) return;
    const jobId = job._id || job.id;
    await placeBid(jobId, { amount: Number(form.amount), duration: form.duration ? Number(form.duration) : 0, cover: form.cover });
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 500 }}>
        <div className="modal-hd">
          <h3>Submit a Bid</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: 52 }}>✅</div>
              <h3 style={{ color: 'var(--green)', marginTop: 12 }}>Bid Submitted!</h3>
              <p>The client has been notified.</p>
            </div>
          ) : (
            <>
              <div style={{ padding: '1rem', background: 'var(--steel-light)', borderRadius: 'var(--rm)', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Job</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{job.title}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-m)' }}>
                  <span>Budget: {job.budget}</span>
                  <span>Type: {job.type}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group">
                    <label className="form-label">Your Bid Amount ($) *</label>
                    <input className="form-input" type="number" placeholder="e.g. 800"
                      value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Time (days)</label>
                    <input className="form-input" type="number" placeholder="e.g. 7"
                      value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Letter *</label>
                  <textarea className="form-input" rows={4}
                    placeholder="Tell the client why you are the best fit. Mention your relevant experience and similar projects..."
                    value={form.cover} onChange={e => setForm(f => ({ ...f, cover: e.target.value }))} />
                </div>
                <div className="alert alert-warn" style={{ fontSize: 12 }}>
                   A strong cover letter and competitive bid rate increase your chances significantly.
                </div>
                <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={!form.amount || !form.cover}>
                   Submit Bid
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export function HomePage() {
  const { engineers, jobs, openModal, setPage, user } = useApp();
  const [hoveredCat, setHoveredCat] = useState(false);
  const [selectedBidJob, setSelectedBidJob] = useState(null);
  const [selectedEng, setSelectedEng] = useState(null);
  const hoverTimer = useRef(null);

  const handleCatEnter = () => { clearTimeout(hoverTimer.current); setHoveredCat(true); };
  const handleCatLeave = () => { hoverTimer.current = setTimeout(() => setHoveredCat(false), 220); };

  if (selectedEng) return (
    <div>
      <div className="wrap" style={{ padding: '1rem 1.5rem' }}>
        <button className="btn btn-ghost" onClick={() => setSelectedEng(null)}>← Back to Home</button>
      </div>
      <EngineerProfile engineerId={selectedEng.id} />
    </div>
  );

  return (
    <div>
      {selectedBidJob && <BidModal job={selectedBidJob} onClose={() => setSelectedBidJob(null)} />}

      {/* ── HERO ── */}
      <section style={{ padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(240,165,0,0.15), transparent)', pointerEvents: 'none' }}></div>
        <div className="wrap" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -10, left: 0, width: 50, height: 50, borderTop: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)', opacity: 0.4 }}></div>
          <div style={{ position: 'absolute', top: -10, right: 0, width: 50, height: 50, borderTop: '2px solid var(--accent)', borderRight: '2px solid var(--accent)', opacity: 0.4 }}></div>
          <div className="sec-label" style={{ justifyContent: 'center' }}>Pakistan's #1 Engineering Marketplace</div>
          <h1 style={{ marginBottom: '1rem' }}>
            Hire Certified<br />
            <span style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #FFB800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Engineers Online
            </span>
          </h1>
          <p style={{ fontSize: 17, maxWidth: 580, margin: '0 auto 2.5rem', color: 'var(--text-2)' }}>
            Find verified civil, electrical, mechanical, software and structural engineers — post projects, order gigs, and hire talent directly.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setPage('engineers')}> Find Engineers</button>
            {user?.role === 'client' && <button className="btn btn-outline" onClick={() => openModal('postjob')}> Post a Project</button>}
            {!user && <button className="btn btn-outline" onClick={() => openModal('auth')}> Join Free</button>}
            <button className="btn btn-outline" onClick={() => setPage('gigs')}> Browse Gigs</button>
          </div>
        </div>
      </section>

      {/* ── CATEGORY STRIP with Hover Dropdown ── */}
      <div style={{ background: 'rgba(240,165,0,0.05)', borderTop: '1px solid var(--border-a)', borderBottom: '1px solid var(--border-a)', position: 'relative', zIndex: 50 }}
        onMouseEnter={handleCatEnter} onMouseLeave={handleCatLeave}>
        <div className="wrap" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', minWidth: 'max-content' }}>
            {ENG_CATEGORIES.map((cat, i) => (
              <button key={cat.cat}
                onClick={() => setPage('engineers')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  padding: '14px 22px', background: 'transparent', border: 'none',
                  borderRight: i < ENG_CATEGORIES.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s', flexShrink: 0,
                  color: 'inherit'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 22 }}>{cat.icon}</span>
                <span style={{ fontFamily: 'var(--font-d)', fontSize: 12, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '0.03em' }}>
                  {cat.label.replace(' Engineers', '')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hover Dropdown */}
        {hoveredCat && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--steel-mid)', borderBottom: '1px solid var(--border)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 200, animation: 'fadeIn 0.15s ease'
          }}>
            <div className="wrap" style={{ padding: '1.75rem 1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>
                Browse by Engineering Field
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
                {ENG_CATEGORIES.map(cat => (
                  <button key={cat.cat}
                    onClick={() => { setPage('engineers'); setHoveredCat(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', background: 'var(--steel-light)',
                      border: '1px solid var(--border)', borderRadius: 'var(--rm)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', color: 'inherit'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--steel-light)'; }}
                  >
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-d)', fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 3 }}>{cat.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{cat.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FEATURED ENGINEERS ── */}
      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div><div className="sec-label">Top Talent</div><h2>Featured Engineers</h2></div>
            <button className="btn btn-outline btn-sm" onClick={() => setPage('engineers')}>All Engineers →</button>
          </div>
          <div className="g3">
            {engineers.slice(0, 3).map(eng => (
              <EngineerCard key={eng.id} eng={eng} onClick={() => setSelectedEng(eng)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN JOBS ── */}
      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div><div className="sec-label">Latest Opportunities</div><h2>Open Jobs</h2></div>
            <button className="btn btn-outline btn-sm" onClick={() => setPage('jobs')}>All Jobs →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.slice(0, 3).map(job => (
              <JobCard key={job.id} job={job} onBid={() => setSelectedBidJob(job)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — 4 STEPS ── */}
      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="wrap">
          <div className="sec-label">Simple Process</div>
          <h2 style={{ marginBottom: '0.5rem' }}>How EngineersHub Works</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '3rem', fontSize: 15 }}>
            Get your engineering project done in 4 simple steps
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--border)', borderRadius: 'var(--rm)', overflow: 'hidden' }}>
            {[
              {
                num: '01', icon: '', title: 'Post Your Project',
                desc: 'Describe what you need — structural design, solar system, software tool, or any engineering service. Set your budget and deadline.'
              },
              {
                num: '02', icon: '', title: 'Receive Proposals',
                desc: 'Verified, PEC-registered engineers submit bids with their rate, delivery time, and cover letter. Compare and choose the best fit.'
              },
              {
                num: '03', icon: '', title: 'Collaborate Securely',
                desc: 'Chat on EngineersHub — share files, track milestones, get progress updates. No phone numbers needed, everything stays on platform.'
              },
              {
                num: '04', icon: '', title: 'Pay & Get Delivered',
                desc: 'Release payment via JazzCash, EasyPaisa, or bank transfer once you approve deliverables. 100% escrow protected.'
              },
            ].map((step, i) => (
              <div key={i}
                style={{ padding: '2rem 1.5rem', background: 'var(--steel-mid)', transition: 'background 0.2s', position: 'relative' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,165,0,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--steel-mid)'}
              >
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--accent)', opacity: 0.7, marginBottom: 14, letterSpacing: '0.1em' }}>
                  STEP {step.num}
                </div>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{step.icon}</div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text-2)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-primary" onClick={() => !user ? openModal('auth') : setPage('jobs')}>
              {user ? '🚀 Browse Jobs Now' : ' Get Started — It\'s Free'}
            </button>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginTop: 10 }}>
              No credit card required · Free to join · PEC verified engineers
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ENGINEER CARD ────────────────────────────────────────────────────────────
export function EngineerCard({ eng, onClick }) {
  const { openModal, user } = useApp();

  const handleClick = () => {
    if (!user) { openModal('auth'); return; }
    if (onClick) onClick(eng);
  };

  return (
    <div className="card card-pad" style={{ cursor: 'pointer' }} onClick={handleClick}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div className="av av-md" style={{ background: eng.avatar?.bg, color: eng.avatar?.color, borderColor: (eng.avatar?.color || 'var(--accent)') + '44', fontSize: 14, fontWeight: 700 }}>
          {eng.avatar?.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-d)', fontSize: '1rem', fontWeight: 600 }}>{eng.name}</span>
            {eng.verified && <span style={{ fontSize: 12 }}></span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{eng.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-m)', marginTop: 2 }}> {eng.location}</div>
        </div>
        <span className={`badge badge-${eng.badgeType}`}>{eng.badge}</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
        {eng.bio?.slice(0, 100) || 'No bio yet.'}{eng.bio?.length > 100 ? '...' : ''}
      </p>
      <div style={{ display: 'flex', gap: 12, marginBottom: '0.75rem', alignItems: 'center' }}>
        <span className="text-accent" style={{ fontFamily: 'var(--font-d)', fontSize: 17, fontWeight: 700 }}>
          ${eng.hourlyRate || '—'}<span style={{ fontSize: 11, fontFamily: 'var(--font-b)', fontWeight: 400, color: 'var(--text-3)' }}>/hr</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span className="stars" style={{ fontSize: 12 }}>★</span>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{eng.rating || '—'}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>({eng.reviews || 0})</span>
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)' }}>{eng.completedJobs || 0} jobs</span>
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {(eng.skills || []).slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
        {(eng.skills?.length || 0) > 3 && <span className="tag">+{(eng.skills?.length || 0) - 3}</span>}
      </div>
      <div className="div" style={{ margin: '0 0 0.75rem' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: eng.available ? 'var(--green)' : 'var(--text-3)' }}></div>
          <span style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: eng.available ? '#4ADE80' : 'var(--text-3)' }}>
            {eng.available ? 'Available' : 'Busy'}
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); handleClick(); }}>
          View Profile
        </button>
      </div>
    </div>
  );
}

// ─── JOB CARD ─────────────────────────────────────────────────────────────────
export function JobCard({ job, onBid }) {
  const { user, openModal } = useApp();
  const catColors = { Frontend: 'blue', Backend: 'teal', 'Full Stack': 'green', Devops: 'amber', Mobile: 'purple' };

  const handleBid = () => {
    if (!user) { openModal('auth'); return; }
    if (onBid) onBid(job);
  };

  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
            <span className={`badge badge-${catColors[job.category] || 'blue'}`}>{job.category}</span>
            <span className={`badge badge-${job.type === 'Fixed Price' ? 'blue' : 'teal'}`}>{job.type}</span>
            {job.urgent && <span className="badge badge-red"> URGENT</span>}
          </div>
          <h3 style={{ fontSize: '1rem' }}>{job.title}</h3>
        </div>
        <div style={{ fontFamily: 'var(--font-d)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{job.budget}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginBottom: '0.5rem' }}>{job.clientName} · {job.location}</div>
      <p style={{ fontSize: 13, marginBottom: '0.75rem' }}>{job.description?.slice(0, 130)}{job.description?.length > 130 ? '...' : ''}</p>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {(job.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="div" style={{ margin: '0 0 0.75rem' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, fontFamily: 'var(--font-m)', color: 'var(--text-3)' }}>
          <span> {job.posted}</span>
          <span> {job.bids} bids</span>
          <span> {job.level}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleBid}>
          {user?.role === 'freelancer' ? ' Submit Bid' : user?.role === 'client' ? 'View Bids' : 'Login to Bid'}
        </button>
      </div>
    </div>
  );
}

// ─── ENGINEERS PAGE ────────────────────────────────────────────────────────────
const CATS = ['All', 'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile'];

export function EngineersPage() {
  const { engineers, openModal, user } = useApp();
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('rating');
  const [search, setSearch] = useState('');
  const [avail, setAvail] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = engineers
    .filter(e => cat === 'All' || e.category === cat || e.engineeringField === cat)
    .filter(e => !avail || e.available)
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || (e.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'rate_low' ? a.hourlyRate - b.hourlyRate : b.hourlyRate - a.hourlyRate);

  if (selected) return (
    <div>
      <div className="wrap" style={{ padding: '1rem 1.5rem' }}>
        <button className="btn btn-ghost" onClick={() => setSelected(null)}>← Back to Engineers</button>
      </div>
      <EngineerProfile engineerId={selected.id} />
    </div>
  );

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="wrap">
        <div className="sec-label">Marketplace</div>
        <h2 style={{ marginBottom: '1.5rem' }}>Find Engineers</h2>
        <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'end', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Search</label>
              <input className="form-input" placeholder="Name or skill..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select className="form-input" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="rating">Top Rated</option>
                <option value="rate_low">Lowest Rate</option>
                <option value="rate_high">Highest Rate</option>
              </select>
            </div>
            <div style={{ paddingBottom: 2 }}>
              <label style={{ display: 'flex', gap: 8, cursor: 'pointer', alignItems: 'center' }}>
                <input type="checkbox" checked={avail} onChange={e => setAvail(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 'auto' }} />
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Available Only</span>
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
                fontFamily: 'var(--font-m)', transition: 'all 0.15s',
                background: cat === c ? 'var(--accent)' : 'var(--steel-light)',
                color: cat === c ? 'var(--steel)' : 'var(--text-2)',
                border: `1px solid ${cat === c ? 'var(--accent)' : 'var(--border)'}`,
                fontWeight: cat === c ? 700 : 400
              }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '1rem', fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)' }}>
          {filtered.length} engineers found
        </div>
        {filtered.length > 0 ? (
          <div className="g3">
            {filtered.map(e => <EngineerCard key={e.id} eng={e} onClick={() => setSelected(e)} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-2)' }}>
            <div style={{ fontSize: 48 }}></div>
            <h3 style={{ marginTop: '1rem' }}>No engineers found</h3>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── JOBS PAGE ─────────────────────────────────────────────────────────────────
export function JobsPage() {
  const { jobs, openModal, user } = useApp();
  const [cat, setCat] = useState('All');
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');
  const [bidJob, setBidJob] = useState(null);

  const filtered = jobs
    .filter(j => cat === 'All' || j.category === cat)
    .filter(j => type === 'All' || j.type === type)
    .filter(j => !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '2rem 0' }}>
      {bidJob && <BidModal job={bidJob} onClose={() => setBidJob(null)} />}
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div><div className="sec-label">Job Board</div><h2>Browse Jobs</h2></div>
          {user?.role === 'client' && <button className="btn btn-primary" onClick={() => openModal('postjob')}>+ Post a Job</button>}
          {!user && <button className="btn btn-outline" onClick={() => openModal('auth')}>Login to Post →</button>}
        </div>
        <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Search Jobs</label>
            <input className="form-input" placeholder="Job title or skill..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Category</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['All', 'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile'].map(c => (
                  <button key={c} onClick={() => setCat(c)} style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-m)', transition: 'all 0.15s',
                    background: cat === c ? 'var(--accent)' : 'var(--steel-light)',
                    color: cat === c ? 'var(--steel)' : 'var(--text-2)',
                    border: `1px solid ${cat === c ? 'var(--accent)' : 'var(--border)'}`, fontWeight: cat === c ? 700 : 400
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Type</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['All', 'Fixed Price', 'Hourly'].map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-m)', transition: 'all 0.15s',
                    background: type === t ? 'var(--accent)' : 'var(--steel-light)',
                    color: type === t ? 'var(--steel)' : 'var(--text-2)',
                    border: `1px solid ${type === t ? 'var(--accent)' : 'var(--border)'}`, fontWeight: type === t ? 700 : 400
                  }}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '1rem', fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)' }}>
          {filtered.length} jobs available
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.length > 0 ? filtered.map(j => (
            <JobCard key={j.id} job={j} onBid={() => setBidJob(j)} />
          )) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-2)' }}>
              <div style={{ fontSize: 48 }}></div>
              <h3 style={{ marginTop: '1rem' }}>No jobs found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── GIGS PAGE ─────────────────────────────────────────────────────────────────
export function GigsPage() {
  const { gigs, openModal, user, api } = useApp();
  const [cat, setCat] = useState('All');
  const [maxP, setMaxP] = useState(1000);
  const [orderGig, setOrderGig] = useState(null);

  const filtered = gigs
    .filter(g => cat === 'All' || g.category === cat)
    .filter(g => g.startingAt <= maxP);

  const GigCard = ({ gig }) => (
    <div className="card" style={{ cursor: 'pointer' }}
      onClick={() => { if (!user) { openModal('auth'); return; } setOrderGig(gig); }}>
      <div style={{ height: 120, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, borderBottom: '1px solid var(--border)', position: 'relative' }}>
        {gig.icon}
        <div style={{ position: 'absolute', top: 8, right: 8 }}><span className="badge badge-amber">{gig.category}</span></div>
      </div>
      <div className="card-pad">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
          <div className="av av-sm" style={{ background: gig.avatar?.bg, color: gig.avatar?.color, fontSize: 10, fontWeight: 700 }}>{gig.initials}</div>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{gig.engineerName}</span>
          <span className="stars" style={{ marginLeft: 'auto', fontSize: 11 }}>★ {gig.rating}</span>
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>({gig.reviews})</span>
        </div>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{gig.title}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{gig.description?.slice(0, 80)}...</p>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {(gig.tags || []).map(t => <span key={t} className="tag" style={{ fontSize: 10 }}>{t}</span>)}
        </div>
        <div className="div" style={{ margin: '0 0 0.75rem' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase' }}>Starting at</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>${gig.startingAt}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-3)' }}>{gig.deliveryDays} day delivery</div>
        </div>
        <button className="btn btn-primary btn-full mt-2" style={{ fontSize: 13 }}
          onClick={e => { e.stopPropagation(); if (!user) { openModal('auth'); return; } setOrderGig(gig); }}>
          Order Now
        </button>
      </div>
    </div>
  );

  const handleOrderGig = async (gig, pkgIndex) => {
    const gigId = gig._id || gig.id;
    try {
      await api.orderGig ? api.orderGig(gigId, { packageIndex: pkgIndex }) : Promise.resolve();
      alert('Order placed successfully! The engineer will contact you shortly. 🎉');
    } catch (err) {
      alert('Order placed (offline mode)! 🎉');
    }
    setOrderGig(null);
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      {orderGig && (
        <div className="modal-bg" onClick={() => setOrderGig(null)}>
          <div className="modal-box" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <h3>{orderGig.title}</h3>
              <button className="modal-close" onClick={() => setOrderGig(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ fontSize: 48, textAlign: 'center', marginBottom: '1rem' }}>{orderGig.icon}</div>
              <h4 style={{ marginBottom: '1rem' }}>Select Package</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                {(orderGig.packages || []).map((pkg, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--steel-light)', border: '1px solid var(--border)', borderRadius: 'var(--rm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700 }}>{pkg.name}</span>
                      <span style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>${pkg.price}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>{pkg.desc}</div>
                    <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginBottom: 10 }}>{pkg.delivery} day delivery</div>
                    <button className="btn btn-primary btn-full btn-sm" onClick={() => handleOrderGig(orderGig, i)}>
                      Order for ${pkg.price}
                    </button>
                  </div>
                ))}
              </div>
              <div className="alert alert-warn" style={{ fontSize: 12 }}>
                💡 Payment is held in escrow and released only after you approve the delivered work.
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="wrap">
        <div className="sec-label">Services</div>
        <h2 style={{ marginBottom: '1.5rem' }}>Engineering Gigs</h2>
        <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Max Budget: ${maxP}</div>
            <input type="range" className="form-input" min="50" max="1000" step="50" value={maxP} onChange={e => setMaxP(Number(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['All', 'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile'].map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-m)', transition: 'all 0.15s',
                background: cat === c ? 'var(--accent)' : 'var(--steel-light)',
                color: cat === c ? 'var(--steel)' : 'var(--text-2)',
                border: `1px solid ${cat === c ? 'var(--accent)' : 'var(--border)'}`, fontWeight: cat === c ? 700 : 400
              }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '1rem', fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)' }}>{filtered.length} gigs available</div>
        {filtered.length > 0 ? (
          <div className="g3">{filtered.map(g => <GigCard key={g.id} gig={g} />)}</div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-2)' }}>
            <div style={{ fontSize: 48 }}></div>
            <h3 style={{ marginTop: '1rem' }}>No gigs found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
