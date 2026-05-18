import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const CATS = ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile'];
const LEVELS = ['Entry Level', 'Intermediate', 'Expert'];

export default function PostJobModal() {
  const { postJob, saveDraft, deleteDraft, myDrafts, user, closeModal, setPage, toast, modalData } = useApp();
  const [step, setStep] = useState(1);
  const [draftId] = useState(modalData?.draftId || 'd' + Date.now());
  const [form, setForm] = useState({
    title: '', category: '', type: 'Fixed Price',
    budgetMin: '', budgetMax: '', hourlyRate: '',
    level: 'Intermediate', location: user?.location || '',
    tags: '', description: '', deadline: '', urgent: false
  });
  const [err, setErr] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load draft if editing
  useEffect(() => {
    if (modalData?.draftId) {
      const draft = myDrafts.find(d => d.draftId === modalData.draftId);
      if (draft) setForm(draft.form);
    }
  }, []);

  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSaveDraft = () => {
    saveDraft({ draftId, userId: user.id, form, savedAt: new Date().toISOString() });
  };

  const validate = () => {
    if (!form.title.trim()) return 'Tilte is must';
    if (!form.category) return 'Select category';
    if (!form.description.trim()) return ' Write Description';
    if (form.type === 'Fixed Price' && !form.budgetMin) return 'Write budget';
    if (form.type === 'Hourly' && !form.hourlyRate) return 'Write Hourly rate';
    return null;
  };

  const handleSubmit = () => {
    const e = validate();
    if (e) return setErr(e);
    const budget = form.type === 'Fixed Price'
      ? `$${form.budgetMin}${form.budgetMax ? '–' + form.budgetMax : ''}`
      : `$${form.hourlyRate}/hr`;
    postJob({
      ...form,
      budget,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    // Remove draft if it was one
    if (modalData?.draftId) deleteDraft(draftId);
    setSubmitted(true);
    setTimeout(closeModal, 2200);
  };

  if (submitted) return (
    <div className="modal-bg">
      <div className="modal-box" style={{ maxWidth: 400, textAlign: 'center' }}>
        <div className="modal-body" style={{ padding: '3rem 2rem' }}>
          <div style={{ fontSize: 52, marginBottom: '1rem' }}>🚀</div>
          <h3 style={{ color: 'var(--green)', marginBottom: 8 }}>Job is live!</h3>
          <p style={{ fontSize: 14 }}>Engineers will start bidding now</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && closeModal()}>
      <div className="modal-box" style={{ maxWidth: 560 }}>
        <div className="modal-hd">
          <h3>Post a Job</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSaveDraft} className="btn btn-outline btn-sm">💾 Save Draft</button>
            <button className="modal-close" onClick={closeModal}>✕</button>
          </div>
        </div>
        <div className="modal-body">
          <div className="step-bar mb-3">
            {[1,2,3].map(s => <div key={s} className={`step-seg ${s<=step?'done':''}`}></div>)}
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" placeholder="e.g. Structural Design for G+3 House" value={form.title} onChange={e=>u('title',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Engineering Category *</label>
                <select className="form-input" value={form.category} onChange={e=>u('category',e.target.value)}>
                  <option value="">Select category...</option>
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Project Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Fixed Price', 'Hourly'].map(t=>(
                    <button key={t} onClick={()=>u('type',t)} style={{
                      flex: 1, padding: '10px', border: `2px solid ${form.type===t?'var(--accent)':'var(--border)'}`,
                      background: form.type===t?'var(--accent-dim)':'transparent',
                      color: form.type===t?'var(--accent)':'var(--text-2)',
                      borderRadius: 'var(--r)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-b)', transition: 'all 0.15s'
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              {form.type === 'Fixed Price' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group">
                    <label className="form-label">Min Budget ($)</label>
                    <input className="form-input" type="number" placeholder="500" value={form.budgetMin} onChange={e=>u('budgetMin',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Budget ($)</label>
                    <input className="form-input" type="number" placeholder="1000" value={form.budgetMax} onChange={e=>u('budgetMax',e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Hourly Rate ($)</label>
                  <input className="form-input" type="number" placeholder="e.g. 35" value={form.hourlyRate} onChange={e=>u('hourlyRate',e.target.value)} />
                </div>
              )}
              {err && <div className="alert alert-error">{err}</div>}
              <button className="btn btn-primary btn-full" onClick={()=>{setErr('');setStep(2);}}>Next →</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Project Description *</label>
                <textarea className="form-input" rows={5} placeholder="Project ki detail likhain... kya chahiye, koi special requirements, deliverables kya honge..." value={form.description} onChange={e=>u('description',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Required Skills (comma separated)</label>
                <input className="form-input" placeholder="ETABS, AutoCAD, Foundation Design" value={form.tags} onChange={e=>u('tags',e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select className="form-input" value={form.level} onChange={e=>u('level',e.target.value)}>
                    {LEVELS.map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" placeholder="Lahore / Remote" value={form.location} onChange={e=>u('location',e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label className="form-label">Deadline (optional)</label>
                  <input className="form-input" type="date" value={form.deadline} onChange={e=>u('deadline',e.target.value)} />
                </div>
                <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                  <label className="form-label">Urgent?</label>
                  <button onClick={()=>u('urgent',!form.urgent)} style={{
                    padding: '8px 16px', border: `2px solid ${form.urgent?'var(--red)':'var(--border)'}`,
                    background: form.urgent?'rgba(239,68,68,0.1)':'transparent',
                    color: form.urgent?'#F87171':'var(--text-2)',
                    borderRadius: 'var(--r)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-b)'
                  }}>🔥 {form.urgent?'Yes — Urgent':'Mark Urgent'}</button>
                </div>
              </div>
              {err && <div className="alert alert-error">{err}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={()=>{setErr('');setStep(3);}}>Review Job →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', background: 'var(--steel-light)', borderRadius: 'var(--rm)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Job Preview</div>
                <h3 style={{ marginBottom: 8 }}>{form.title || '—'}</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {form.category && <span className="badge badge-blue">{form.category}</span>}
                  {form.urgent && <span className="badge badge-red">🔥 URGENT</span>}
                  <span className="badge badge-gray">{form.type}</span>
                </div>
                <p style={{ fontSize: 13, marginBottom: 10, color: 'var(--text-2)' }}>{form.description?.slice(0, 150)}{form.description?.length > 150 ? '...' : ''}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, flexWrap: 'wrap' }}>
                  <span className="text-accent" style={{ fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700 }}>
                    {form.type === 'Fixed Price' ? `$${form.budgetMin}${form.budgetMax?'–'+form.budgetMax:''}` : `$${form.hourlyRate}/hr`}
                  </span>
                  <span className="text-dim">📍 {form.location||'Remote'}</span>
                  <span className="text-dim">⭐ {form.level}</span>
                </div>
              </div>
              {err && <div className="alert alert-error">{err}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={()=>setStep(2)}>← Edit</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}> Post Job Live</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
