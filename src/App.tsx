import React, { useState, useEffect } from "react";
import { ClockInOut } from "./ClockInOut";
import { AdminReport } from "./AdminReport";
import "./styles.css";

const App: React.FC = () => {
  const [view, setView] = useState<"user" | "werkrapport">("user");
  const [hasUser, setHasUser] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Check of er een user is opgeslagen
  const checkUserStatus = () => {
    const savedUsername = localStorage.getItem("clock-username");
    setHasUser(!!savedUsername);
    if (savedUsername) {
      setAdminUsername(savedUsername);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const handleAdminCheck = () => {
    setAdminLoading(true);
    setAdminError("");

    // Simuleer login
    setTimeout(() => {
      setAdminLoading(false);
      setHasUser(true);
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100svh" }}>
      <div style={{ flex: 1 }}>
        <nav style={{ padding: 20 }}>
          <div className="view-toggle-container">
            <button className={`toggle-button ${view === "user" ? "active" : ""}`} onClick={() => setView("user")}>
              Klokken
            </button>
            <button className={`toggle-button ${view === "werkrapport" ? "active" : ""}`} onClick={() => setView("werkrapport")}>
              Werkrapport
            </button>
          </div>
        </nav>

        {view === "user" && <ClockInOut onAuthChange={checkUserStatus} />}

        {view === "werkrapport" && (
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h1 style={{ fontFamily: "sans-serif" }}>Werkrapport</h1>
            </div>

            {!hasUser ? (
              <div
                style={{
                  maxWidth: 400,
                  margin: "auto",
                  padding: 20,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              >
                <h3 style={{ textAlign: "center", marginBottom: 15, fontFamily: "sans-serif" }}>Inloggen voor werkrapport</h3>
                <input style={{ ...inputStyle(false), marginBottom: 10 }} placeholder="Naam" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} />
                <input style={{ ...inputStyle(false), marginBottom: 15 }} placeholder="Code" type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
                <button onClick={handleAdminCheck} disabled={adminLoading || !adminUsername || !adminCode} style={getButtonStyle(adminLoading || !adminUsername || !adminCode, "#3a86ff")}>
                  {adminLoading ? <ButtonSpinner text="Inloggen" /> : "Rapport tonen"}
                </button>
                {adminError && <p style={{ color: "red", marginTop: 10 }}>{adminError}</p>}
              </div>
            ) : (
              <>
                <AdminReport username={adminUsername} />
              </>
            )}
          </div>
        )}
      </div>
      <footer style={{ textAlign: "center", fontFamily: "sans-serif", padding: 20, backgroundColor: "#3a86ff" }}>
        <a href="https://www.lannie.be" target="_blank" style={{ color: "white", textDecoration: "none" }}>
          &copy; {new Date().getFullYear()} Lannie. Ontworpen en ontwikkeld door Lannie
        </a>
      </footer>
    </div>
  );
};

// Styling helpers
const inputStyle = (disabled: boolean) => ({
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box" as const,
  width: "100%",
  opacity: disabled ? 0.7 : 1,
  backgroundColor: disabled ? "#f5f5f5" : "white",
});

const getButtonStyle = (disabled: boolean, color: string) => ({
  padding: "10px 15px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: disabled ? "#cccccc" : color,
  color: "white",
  fontSize: "16px",
  cursor: disabled ? "not-allowed" : "pointer",
  width: "100%",
  position: "relative" as const,
});

const ButtonSpinner: React.FC<{ text: string }> = ({ text }) => (
  <>
    <span style={{ visibility: "hidden" }}>{text}</span>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          border: "3px solid rgba(255,255,255,0.3)",
          borderRadius: "50%",
          borderTopColor: "white",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  </>
);

export default App;
