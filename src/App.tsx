import React, { useState } from "react";
import { ClockInOut } from "./ClockInOut";
import { AdminReport } from "./AdminReport";
import "./styles.css";
import { inputStyle } from "./styles";

const App: React.FC = () => {
  const [view, setView] = useState<"user" | "werkrapport">("user");
  const [adminUser, setAdminUser] = useState("");

  return (
    <div>
      <nav style={{ padding: 20 }}>
        <div className="view-toggle-container">
          <button className={`toggle-button ${view === "user" ? "active" : ""}`} onClick={() => setView("user")}>
            Gebruiker
          </button>
          <button className={`toggle-button ${view === "werkrapport" ? "active" : ""}`} onClick={() => setView("werkrapport")}>
            Werkrapport
          </button>
        </div>
      </nav>

      {view === "user" && <ClockInOut />}

      {view === "werkrapport" && (
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h1 style={{ fontFamily: "sans-serif" }}>Werkrapport</h1>
          </div>
          <input style={inputStyle(false)} placeholder="Admin: vul gebruikersnaam in" value={adminUser.toLocaleLowerCase()} onChange={(e) => setAdminUser(e.target.value)} />
          {adminUser && <AdminReport username={adminUser} />}
        </div>
      )}
    </div>
  );
};

export default App;
