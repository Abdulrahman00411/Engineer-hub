import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function AuthModal() {
  const { login, register, closeModal, openModal, setPage } = useApp();
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("client");
  const [step, setStep] = useState(1);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
    location: "",
    phone: "",
    category: "",
    hourlyRate: "",
  });

  const u = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    if (!form.email || !form.password) return setErr("fill all field");
    setLoading(true);
    const error = await login(form.email, form.password);
    if (error) setErr(error);
    else {
      closeModal();
      setPage("dashboard");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password)
        return setErr("All filed is required");
      if (form.password.length < 6)
        return setErr("Password minimum 6 characters");
      if (form.password !== form.confirmPass)
        return setErr("Passwords do not match");
      setErr("");
      return setStep(2);
    }
    if (!form.location) return setErr("Location is required");
    if (role === "freelancer" && !form.category)
      return setErr("Select Engineering category");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const error = await register({ ...form, role, engineeringField: form.category });
    if (error) {
      setErr(error);
      setLoading(false);
    } else {
      // Reset form state to prevent stale data on next open
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPass: "",
        location: "",
        phone: "",
        category: "",
        hourlyRate: "",
      });
      setStep(1);
      setTab("login");
      closeModal();
      setPage("dashboard");
      setLoading(false);
    }
  };

  const tryLogin = (email, password) => {
    u("email", email);
    u("password", password);
    setTimeout(() => {
      const error = login(email, password);
      if (!error) {
        closeModal();
        setPage("dashboard");
      }
    }, 100);
  };

  return (
    <div
      className="modal-bg"
      onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-box" style={{ maxWidth: 460 }}>
        <div className="modal-hd">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "var(--font-d)",
                fontSize: 22,
                fontWeight: 800,
              }}>
              Engineers<span style={{ color: "var(--accent)" }}>Hub</span>
            </span>
          </div>
          <button className="modal-close" onClick={closeModal}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="tabs mb-3">
            <button
              className={`tab ${tab === "login" ? "active" : ""}`}
              onClick={() => {
                setTab("login");
                setErr("");
                setStep(1);
              }}>
              Login
            </button>
            <button
              className={`tab ${tab === "register" ? "active" : ""}`}
              onClick={() => {
                setTab("register");
                setErr("");
                setStep(1);
              }}>
              Register
            </button>
          </div>

          {tab === "login" ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="enter@email.com"
                  value={form.email}
                  onChange={(e) => u("email", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => u("password", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              {err && <div className="alert alert-error">{err}</div>}
              <button
                className="btn btn-primary btn-full"
                onClick={handleLogin}
                disabled={loading}>
                {loading ? <span className="spin">⟳</span> : "Login"}
              </button>

              {/* Demo accounts */}
              {/* <div style={{ padding: '1rem', background: 'var(--steel-light)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Demo Accounts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: ' Engineer (Ahmed)', email: 'ahmed@example.com', pass: '123456' },
                    { label: ' Engineer (Sara)', email: 'sara@example.com', pass: '123456' },
                    { label: ' Client', email: 'client@example.com', pass: '123456' }
                  ].map(d => (
                    <button key={d.email} onClick={() => tryLogin(d.email, d.pass)} style={{
                      padding: '7px 12px', background: 'var(--steel)', border: '1px solid var(--border)',
                      borderRadius: 'var(--r)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer',
                      fontFamily: 'var(--font-m)', textAlign: 'left', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
                    >{d.label} — {d.email}</button>
                  ))}
                </div>
              </div> */}
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Step bar */}
              <div className="step-bar">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`step-seg ${s <= step ? "done" : ""}`}></div>
                ))}
              </div>

              {step === 1 && (
                <>
                  {/* Role selection */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      marginBottom: 4,
                    }}>
                    {[
                      {
                        id: "client",
                        icon: "🏢",
                        title: "Client",
                        desc: "Post a project, hire engineers",
                      },
                      {
                        id: "freelancer",
                        icon: "👷",
                        title: "Engineer",
                        desc: "Create a gig, get projects",
                      },
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        style={{
                          padding: "14px 12px",
                          border: `2px solid ${role === r.id ? "var(--accent)" : "var(--border)"}`,
                          background:
                            role === r.id ? "var(--accent-dim)" : "transparent",
                          borderRadius: "var(--rm)",
                          cursor: "pointer",
                          transition: "all 0.18s",
                          textAlign: "center",
                        }}>
                        <div style={{ fontSize: 26, marginBottom: 6 }}>
                          {r.icon}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-d)",
                            fontSize: 15,
                            fontWeight: 600,
                            color:
                              role === r.id ? "var(--accent)" : "var(--text-1)",
                          }}>
                          {r.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-2)",
                            marginTop: 3,
                          }}>
                          {r.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      placeholder={
                        role === "freelancer"
                          ? "Ahmed Khan"
                          : "Company / Your Name"
                      }
                      value={form.name}
                      onChange={(e) => u("name", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => u("email", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={(e) => u("password", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="••••••••"
                      value={form.confirmPass}
                      onChange={(e) => u("confirmPass", e.target.value)}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="alert alert-warn" style={{ marginBottom: 4 }}>
                    Step 2:{" "}
                    {role === "freelancer" ? "Engineer Details" : "Client Info"}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / City</label>
                    <input
                      className="form-input"
                      placeholder="Lahore, Karachi, Islamabad..."
                      value={form.location}
                      onChange={(e) => u("location", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      placeholder="+92-300-1234567"
                      value={form.phone}
                      onChange={(e) => u("phone", e.target.value)}
                    />
                  </div>
                  {role === "freelancer" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">
                          Engineering Category
                        </label>
                        <select
                          className="form-input"
                          value={form.category}
                          onChange={(e) => u("category", e.target.value)}>
                          <option value="">Select...</option>
                          {[
                            "Frontend",
                            "Backend",
                            "Full Stack",
                            "DevOps",
                            "Mobile",
                          ].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Hourly Rate (USD)</label>
                        <input
                          className="form-input"
                          type="number"
                          placeholder="e.g. 25"
                          value={form.hourlyRate}
                          onChange={(e) => u("hourlyRate", e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {err && <div className="alert alert-error">{err}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                {step === 2 && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setStep(1)}>
                    ← Back
                  </button>
                )}
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleRegister}
                  disabled={loading}>
                  {loading ? (
                    <span className="spin">⟳</span>
                  ) : step === 1 ? (
                    "Next →"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
