import { useApp } from "../context/AppContext";

export default function Footer() {
  const { setPage, openModal } = useApp();
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "3rem 0 1.5rem",
        marginTop: "auto",
      }}>
      <div className="wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "2rem",
            marginBottom: "2rem",
          }}>
          <div>
            <div
              style={{
                fontFamily: "var(--font-d)",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}>
              Engineers<span style={{ color: "var(--accent)" }}>Hub</span>
            </div>
            <p style={{ fontSize: 13, maxWidth: 260, lineHeight: 1.7 }}>
              Pakistan’s first dedicated engineering freelance marketplace.
              PEC-verified professionals, secure payments.
            </p>
            <div style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
              {["LinkedIn", "Twitter", "Facebook"].map((s) => (
                <span
                  key={s}
                  style={{
                    padding: "5px 10px",
                    background: "var(--steel-light)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r)",
                    fontSize: 11,
                    color: "var(--text-2)",
                    fontFamily: "var(--font-m)",
                    cursor: "pointer",
                  }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 10,
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
              }}>
              Platform
            </div>
            {[
              ["engineers", "Find Engineers"],
              ["jobs", "Browse Jobs"],
              ["gigs", "Gig Services"],
            ].map(([pg, lbl]) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  color: "var(--text-2)",
                  fontSize: 13,
                  cursor: "pointer",
                  marginBottom: 8,
                  padding: 0,
                  textAlign: "left",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-2)")}>
                {lbl}
              </button>
            ))}
            <button
              onClick={() => openModal("auth")}
              style={{
                display: "block",
                background: "none",
                border: "none",
                color: "var(--text-2)",
                fontSize: 13,
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--text-2)")}>
              Join Free
            </button>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 10,
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
              }}>
              Categories
            </div>
            {["Frontend", "Backend", "Full Stack", "DevOps", "Mobile"].map(
              (l) => (
                <div
                  key={l}
                  style={{
                    fontSize: 13,
                    color: "var(--text-3)",
                    marginBottom: 8,
                  }}>
                  {l}
                </div>
              ),
            )}
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 10,
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
              }}>
              Contact
            </div>
            <div
              style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 8 }}>
              📧 engineershub@gmail.com.pk
            </div>
            <div
              style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 8 }}>
              📞 +92-300-7854321
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-3)",
                marginBottom: 16,
              }}>
              🏢 Kashmir, Pakistan
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "var(--r)",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="live-dot"></span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#4ADE80",
                    fontFamily: "var(--font-m)",
                  }}>
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="div"></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              fontFamily: "var(--font-m)",
            }}>
            © 2025 EngineersHub · Made in Pakistan 🇵🇰
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy Policy", "Terms of Service", "PEC Guidelines"].map(
              (l) => (
                <span
                  key={l}
                  style={{
                    fontSize: 12,
                    color: "var(--text-3)",
                    cursor: "pointer",
                  }}>
                  {l}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
