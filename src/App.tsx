import React, { useState } from "react";
import { ClockInOut } from "./ClockInOut";
import { AdminReport } from "./AdminReport";

const App: React.FC = () => {
  const [view, setView] = useState<"user" | "admin">("user");
  const [adminUser, setAdminUser] = useState("");

  return (
    <div>
      <nav style={{ padding: 20 }}>
        <button onClick={() => setView("user")}>Gebruiker</button>
      </nav>

      {view === "user" && <ClockInOut />}

      {view === "admin" && (
        <div style={{ padding: 20 }}>
          <input placeholder="Admin: vul gebruikersnaam in" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} />
          {adminUser && <AdminReport username={adminUser} />}
        </div>
      )}
    </div>
  );
};

export default App;
