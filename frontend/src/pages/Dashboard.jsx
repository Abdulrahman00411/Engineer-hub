import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

function EditProfileModal({ onClose }) {
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({
    bio: user?.bio || '',
    hourlyRate: user?.hourlyRate || '',
    location: user?.location || '',
    phone: user?.phone || '',
    available: user?.available ?? true,
    newSkill: '', newService: '', newEduDegree: '', newEduInst: '', newEduYear: '',
    newPortTitle: '', newPortDesc: '', newPortYear: '', newPortValue: ''
  });
  const [skills, setSkills] = useState(user?.skills || []);
  const [services, setServices] = useState(user?.services || []);
  const [education, setEducation] = useState(user?.education || []);
  const [portfolio, setPortfolio] = useState(user?.portfolio || []);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    updateProfile({
      bio: form.bio, hourlyRate: Number(form.hourlyRate),
      location: form.location, phone: form.phone,
      available: form.available, skills, services, education, portfolio
    });
    onClose();
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 600 }}>
        <div className="modal-hd">
          <h3>Edit Profile</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic info */}
          <div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Basic Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="form-group"><label className="form-label">Bio</label><textarea className="form-input" rows={3} value={form.bio} onChange={e=>u('bio',e.target.value)} placeholder="Apne baare mein likhain..." /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e=>u('location',e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Hourly Rate ($)</label><input className="form-input" type="number" value={form.hourlyRate} onChange={e=>u('hourlyRate',e.target.value)} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <button onClick={() => u('available', !form.available)} style={{
                  padding: '8px 16px', border: `2px solid ${form.available ? 'var(--green)' : 'var(--border)'}`,
                  background: form.available ? 'rgba(34,197,94,0.1)' : 'transparent',
                  color: form.available ? '#4ADE80' : 'var(--text-2)',
                  borderRadius: 'var(--r)', cursor: 'pointer', fontSize: 13, width: '100%', fontFamily: 'var(--font-b)', transition: 'all 0.15s'
                }}>
                  {form.available ? '✅ Available for Work' : '⛔ Not Available'}
                </button>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Skills</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {skills.map(s => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="tag">
                  {s}
                  <button onClick={() => setSkills(sk => sk.filter(x => x !== s))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 12, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" placeholder="New skill..." value={form.newSkill} onChange={e=>u('newSkill',e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&form.newSkill.trim()){setSkills(s=>[...s,form.newSkill.trim()]);u('newSkill','');}}} />
              <button className="btn btn-outline btn-sm" onClick={()=>{if(form.newSkill.trim()){setSkills(s=>[...s,form.newSkill.trim()]);u('newSkill','');}}}>Add</button>
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {services.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--steel-light)', borderRadius: 'var(--r)', border: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ flex: 1 }}>{s}</span>
                  <button onClick={() => setServices(sv => sv.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F87171', fontSize: 14 }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" placeholder="New service..." value={form.newService} onChange={e=>u('newService',e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&form.newService.trim()){setServices(s=>[...s,form.newService.trim()]);u('newService','');}}} />
              <button className="btn btn-outline btn-sm" onClick={()=>{if(form.newService.trim()){setServices(s=>[...s,form.newService.trim()]);u('newService','');}}}>Add</button>
            </div>
          </div>

          {/* Education */}
          <div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Education</div>
            {education.map((e, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--steel-light)', borderRadius: 'var(--r)', border: '1px solid var(--border)', marginBottom: 8, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{e.degree}</div>
                  <div style={{ color: 'var(--text-2)' }}>{e.institute} · {e.year}</div>
                </div>
                <button onClick={()=>setEducation(ed=>ed.filter((_,j)=>j!==i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F87171', fontSize: 16 }}>×</button>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 8, marginTop: 8 }}>
              <input className="form-input" placeholder="Degree" value={form.newEduDegree} onChange={e=>u('newEduDegree',e.target.value)} />
              <input className="form-input" placeholder="Institute" value={form.newEduInst} onChange={e=>u('newEduInst',e.target.value)} />
              <input className="form-input" placeholder="Year" value={form.newEduYear} onChange={e=>u('newEduYear',e.target.value)} />
            </div>
            <button className="btn btn-outline btn-sm mt-1" onClick={()=>{if(form.newEduDegree&&form.newEduInst){setEducation(e=>[...e,{degree:form.newEduDegree,institute:form.newEduInst,year:form.newEduYear,grade:''}]);u('newEduDegree','');u('newEduInst','');u('newEduYear','');}}} style={{ marginTop: 8 }}>+ Add Education</button>
          </div>

          {/* Portfolio */}
          <div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Portfolio</div>
            {portfolio.map((p, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--steel-light)', borderRadius: 'var(--r)', border: '1px solid var(--border)', marginBottom: 8, fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
                <div><div style={{ fontWeight: 600 }}>{p.title}</div><div style={{ color: 'var(--text-2)' }}>{p.desc?.slice(0,60)}</div></div>
                <button onClick={()=>setPortfolio(pf=>pf.filter((_,j)=>j!==i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F87171', fontSize: 16, alignSelf: 'flex-start' }}>×</button>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input className="form-input" placeholder="Project Title" value={form.newPortTitle} onChange={e=>u('newPortTitle',e.target.value)} />
              <input className="form-input" placeholder="Description" value={form.newPortDesc} onChange={e=>u('newPortDesc',e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input className="form-input" placeholder="Year" value={form.newPortYear} onChange={e=>u('newPortYear',e.target.value)} />
                <input className="form-input" placeholder="Value (e.g. $2,000)" value={form.newPortValue} onChange={e=>u('newPortValue',e.target.value)} />
              </div>
              <button className="btn btn-outline btn-sm" onClick={()=>{if(form.newPortTitle){setPortfolio(p=>[...p,{title:form.newPortTitle,desc:form.newPortDesc,year:form.newPortYear,value:form.newPortValue}]);u('newPortTitle','');u('newPortDesc','');u('newPortYear','');u('newPortValue','');}}}>+ Add Portfolio Item</button>
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={save}>Save Changes ✓</button>
        </div>
      </div>
    </div>
  );
}

// ─── Client Edit Profile Modal ───────────────────────────────────────────────
function ClientEditProfileModal({ onClose }) {
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || ''
  });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    updateProfile({
      name: form.name,
      bio: form.bio,
      location: form.location,
      phone: form.phone
    });
    onClose();
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 480 }}>
        <div className="modal-hd">
          <h3>Edit Profile</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Company Info</div>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input className="form-input" value={form.name} onChange={e => u('name', e.target.value)} placeholder="Your company or organization name" />
          </div>
          <div className="form-group">
            <label className="form-label">Bio / Description</label>
            <textarea className="form-input" rows={3} value={form.bio} onChange={e => u('bio', e.target.value)} placeholder="Tell engineers about your company and projects..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => u('location', e.target.value)} placeholder="City, Country" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="+92-300-1234567" />
            </div>
          </div>
          <button className="btn btn-primary btn-full" onClick={save}>Save Changes ✓</button>
        </div>
      </div>
    </div>
  );
}

// ─── View Bids Modal (for clients) ───────────────────────────────────────────
function ViewBidsModal({ job, onClose }) {
  const { api, apiOnline, toast } = useApp();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiOnline || !job?._id) {
      setLoading(false);
      return;
    }
    const fetchBids = async () => {
      try {
        const data = await api.getJobBids(job._id);
        setBids(data || []);
      } catch {
        toast('Could not load bids', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [job, apiOnline]);

  const handleAction = async (bidId, status) => {
    try {
      await api.acceptBid(bidId, status);
      setBids(b => b.map(bid => bid._id === bidId ? { ...bid, status } : bid));
      toast(status === 'accepted' ? 'Bid accepted! 🎉' : 'Bid rejected');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const statusBadge = (s) => {
    if (s === 'pending') return 'badge-blue';
    if (s === 'accepted') return 'badge-green';
    return 'badge-gray';
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 620 }}>
        <div className="modal-hd">
          <div>
            <h3>Bids on Your Job</h3>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{job?.title}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading bids...</div>
          ) : bids.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>
              No bids yet. Check back later!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bids.map(bid => (
                <div key={bid._id} style={{
                  padding: '1rem', background: 'var(--steel-light)', borderRadius: 'var(--rm)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{bid.engineerName}</div>
                      <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        {bid.engineerId?.rating ? `★ ${bid.engineerId.rating} (${bid.engineerId.reviews} reviews)` : 'New Engineer'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-d)', fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>
                        ${bid.amount}
                      </div>
                      {bid.duration > 0 && (
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{bid.duration} days</div>
                      )}
                    </div>
                  </div>
                  {bid.engineerId?.skills?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                      {bid.engineerId.skills.slice(0, 5).map(s => <span key={s} className="tag">{s}</span>)}
                    </div>
                  )}
                  {bid.cover && (
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 10 }}>
                      {bid.cover.slice(0, 150)}{bid.cover.length > 150 ? '...' : ''}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${statusBadge(bid.status)}`}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </span>
                    {bid.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => handleAction(bid._id, 'rejected')}>
                          Reject
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => handleAction(bid._id, 'accepted')}>
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, jobs, myDrafts, deleteDraft, openModal, setPage, logout, myBids, api, apiOnline, loadMyBids, orders, loadOrders, updateOrderStatus } = useApp();
  const [editProfile, setEditProfile] = useState(false);
  const [clientEditProfile, setClientEditProfile] = useState(false);
  const [viewBidsJob, setViewBidsJob] = useState(null);

  useEffect(() => { loadMyBids(); loadOrders(); }, []);

  if (!user) return (
    <div className="wrap" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: '1rem' }}>🔐</div>
      <h3>Login karo Dashboard dekhne ke liye</h3>
      <button className="btn btn-primary mt-2" onClick={() => openModal('auth')}>Login</button>
    </div>
  );

  const myJobs = jobs.filter(j => String(j.clientId) === String(user._id || user.id));

  const completion = user.role === 'freelancer' ? (() => {
    let pts = 0;
    if (user.bio) pts += 20;
    if (user.skills?.length) pts += 20;
    if (user.education?.length) pts += 20;
    if (user.portfolio?.length) pts += 20;
    if (user.services?.length) pts += 20;
    return pts;
  })() : 100;

  return (
    <div className="wrap" style={{ padding: '2rem 1.5rem' }}>
      {editProfile && <EditProfileModal onClose={() => setEditProfile(false)} />}
      {clientEditProfile && <ClientEditProfileModal onClose={() => setClientEditProfile(false)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="sec-label">Account</div>
          <h2>Dashboard</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {user.role === 'freelancer' && <button className="btn btn-outline btn-sm" onClick={() => setEditProfile(true)}>✏️ Edit Profile</button>}
          {user.role === 'client' && <button className="btn btn-outline btn-sm" onClick={() => setClientEditProfile(true)}>✏️ Edit Profile</button>}
          {user.role === 'client' && <button className="btn btn-primary btn-sm" onClick={() => openModal('postjob')}>+ Post Job</button>}
        </div>
      </div>

      {/* Profile summary */}
      <div className="card card-pad mb-2">
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="av av-lg" style={{ background: user.avatar?.bg, color: user.avatar?.color, fontSize: 20 }}>
            {user.avatar?.initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.2rem' }}>{user.name}</h3>
              <span className={`badge badge-${user.role === 'freelancer' ? 'teal' : 'blue'}`}>
                {user.role === 'freelancer' ? ' Engineer' : ' Client'}
              </span>
              {user.verified && <span className="badge badge-green">✅ Verified</span>}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{user.email}</div>
            {user.location && <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>📍 {user.location}</div>}

            {user.role === 'freelancer' && (
              <div style={{ marginTop: '1rem', maxWidth: 300 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-2)' }}>Profile Completion</span>
                  <span style={{ fontFamily: 'var(--font-m)', color: completion === 100 ? '#4ADE80' : 'var(--accent)' }}>{completion}%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${completion}%` }}></div>
                </div>
                {completion < 100 && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
                  Profile complete karo — {['bio', 'skills', 'education', 'portfolio', 'services'].filter(f => !user[f]?.length).join(', ')} add karo
                </div>}
              </div>
            )}
          </div>

          {/* Quick stats */}
          {(() => {
            const clientOrders = orders.filter(o => String(o.clientId) === String(user._id || user.id));
            const totalSpent = clientOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
            const statItems = user.role === 'freelancer'
              ? [{ label: 'Rating', val: user.rating || '—' }, { label: 'Jobs Done', val: user.completedJobs || 0 }, { label: 'Earned', val: user.totalEarned || '$0' }]
              : [{ label: 'Jobs Posted', val: myJobs.length }, { label: 'Total Spent', val: totalSpent > 0 ? `$${totalSpent}` : (user.totalSpent || '$0') }];
            return (
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {statItems.map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{s.val}</div>
                    <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      <div className="g2">
        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* My Jobs (client) */}
          {user.role === 'client' && (
            <div className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4>My Posted Jobs ({myJobs.length})</h4>
                <button className="btn btn-primary btn-sm" onClick={() => openModal('postjob')}>+ New</button>
              </div>
              {myJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-3)', fontSize: 13 }}>
                  Abhi koi job post nahi ki. <button className="btn-ghost" onClick={() => openModal('postjob')} style={{ color: 'var(--accent)' }}>Post karo →</button>
                </div>
              ) : myJobs.map(j => (
                <div key={j._id || j.id} style={{ padding: '0.75rem', background: 'var(--steel-light)', borderRadius: 'var(--r)', border: '1px solid var(--border)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{j.title}</span>
                    <span className="badge badge-green">{j.status}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                    {j.bids || 0} bids · {j.budget} · {j.posted}
                  </div>
                  {j._id && (
                    <button
                      className="btn btn-outline btn-sm mt-2"
                      style={{ fontSize: 11, padding: '2px 8px' }}
                      onClick={() => setViewBidsJob(j)}
                    >
                      View Bids →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Freelancer services */}
          {user.role === 'freelancer' && (
            <div className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4>My Profile Quick View</h4>
                <button className="btn btn-outline btn-sm" onClick={() => setEditProfile(true)}>Edit</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-dim">Hourly Rate</span>
                  <span className="text-accent" style={{ fontFamily: 'var(--font-d)', fontWeight: 700 }}>${user.hourlyRate || '—'}/hr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-dim">Skills</span>
                  <span>{user.skills?.length || 0} skills</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-dim">Portfolio Items</span>
                  <span>{user.portfolio?.length || 0} projects</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-dim">Education</span>
                  <span>{user.education?.length || 0} degrees</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-dim">Availability</span>
                  <span style={{ color: user.available ? '#4ADE80' : 'var(--text-3)' }}>{user.available ? '✅ Available' : '⛔ Busy'}</span>
                </div>
              </div>
              <button className="btn btn-outline btn-full mt-2" onClick={() => setPage('engineers')}>View My Public Profile →</button>
            </div>
          )}

          {/* My Bids (freelancer) */}
          {user.role === 'freelancer' && (
            <div className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4>My Bids ({myBids.length})</h4>
                <button className="btn btn-outline btn-sm" onClick={() => loadMyBids()}>↻</button>
              </div>
              {myBids.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-3)', fontSize: 13 }}>
                  Abhi koi bid nahi di. <button className="btn-ghost" onClick={() => setPage('jobs')} style={{ color: 'var(--accent)' }}>Jobs dekho →</button>
                </div>
              ) : myBids.map(b => (
                <div key={b._id} style={{ padding: '0.75rem', background: 'var(--steel-light)', borderRadius: 'var(--r)', border: '1px solid var(--border)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{b.jobId?.title || 'Job'}</span>
                    <span className={`badge ${
                      b.status === 'accepted' ? 'badge-green' :
                      b.status === 'rejected' ? 'badge-red' : 'badge-blue'
                    }`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>
                    ${b.amount} · {b.duration ? `${b.duration} days` : 'No duration'} · {b.jobId?.category || ''}
                  </div>
                  {b.cover && (
                    <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                      {b.cover.slice(0, 80)}{b.cover.length > 80 ? '...' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Incoming Orders (freelancer) */}
          {user.role === 'freelancer' && (() => {
            const incomingOrders = orders.filter(o => String(o.engineerId) === String(user._id || user.id));
            return (
              <div className="card card-pad">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4>Incoming Orders ({incomingOrders.length})</h4>
                  <button className="btn btn-outline btn-sm" onClick={() => loadOrders()}>↻</button>
                </div>
                {incomingOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-3)', fontSize: 13 }}>
                    Abhi koi order nahi. Gigs se kaam hasil karo!
                  </div>
                ) : incomingOrders.map(o => (
                  <div key={o._id} style={{ padding: '0.75rem', background: 'var(--steel-light)', borderRadius: 'var(--r)', border: '1px solid var(--border)', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{o.gigTitle || 'Gig Order'}</span>
                      <span className={`badge ${
                        o.status === 'completed' ? 'badge-green' :
                        o.status === 'cancelled' ? 'badge-red' :
                        o.status === 'in-progress' ? 'badge-blue' :
                        'badge-gray'
                      }`}>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-m)', fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>
                      ${o.amount} · {o.package?.name || 'Package'} · Client: {o.clientName || 'Client'}
                    </div>
                    {o.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => updateOrderStatus(o._id, 'cancelled')}>Decline</button>
                        <button className="btn btn-primary btn-sm" onClick={() => updateOrderStatus(o._id, 'accepted')}>Accept</button>
                      </div>
                    )}
                    {o.status === 'accepted' && (
                      <button className="btn btn-primary btn-sm mt-2" onClick={() => updateOrderStatus(o._id, 'in-progress')}>Start Work</button>
                    )}
                    {o.status === 'in-progress' && (
                      <button className="btn btn-primary btn-sm mt-2" onClick={() => updateOrderStatus(o._id, 'delivered')}>Mark Delivered</button>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Right col — Drafts */}
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4>💾 Saved Drafts ({myDrafts.length})</h4>
          </div>
          {myDrafts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-3)', fontSize: 13 }}>
              Koi draft nahi. Job post karte waqt "Save Draft" dabao.
            </div>
          ) : myDrafts.map(d => (
            <div key={d.draftId} style={{ padding: '0.75rem', background: 'var(--steel-light)', borderRadius: 'var(--r)', border: '1px solid var(--border)', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.form?.title || 'Untitled Draft'}</div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>
                    Saved: {new Date(d.savedAt).toLocaleDateString()} · {d.form?.category || '—'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openModal('postjob', { draftId: d.draftId })}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteDraft(d.draftId)}>×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {viewBidsJob && <ViewBidsModal job={viewBidsJob} onClose={() => setViewBidsJob(null)} />}
    </div>
  );
}
