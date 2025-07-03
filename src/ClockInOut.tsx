import React, { useState, useEffect } from "react";
import { clockIn, clockOut, startBreak, endBreak } from "./api";
import { containerStyle, inputStyle, getButtonStyle, messageStyle, inlogStyle } from "./styles";

interface Props {
  onAuthChange?: () => void;
}

export const ClockInOut: React.FC<Props> = ({ onAuthChange }) => {
  const [username, setUsername] = useState("");
  const [project, setProject] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"out" | "in" | "break">("out");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);

  // Timer effect voor pauzetijd
  useEffect(() => {
    const timer = setInterval(() => {
      if (status === "break" && breakStartTime) {
        setBreakTime(Math.floor((new Date().getTime() - breakStartTime.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status, breakStartTime]);

  // Initialisatie van localStorage data
  useEffect(() => {
    const savedStatus = localStorage.getItem("clock-status");
    const savedUsername = localStorage.getItem("clock-username");
    const savedCode = localStorage.getItem("clock-code");

    if (savedStatus === "in" || savedStatus === "break") {
      setStatus(savedStatus);
    }
    if (savedUsername) setUsername(savedUsername);
    if (savedCode) setCode(savedCode);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours > 0 ? `${hours}u ` : ""}${minutes}m ${secs}s`;
  };

  const handleAction = async (action: () => Promise<void>, successMessage: string, newStatus?: "out" | "in" | "break") => {
    setLoading(true);
    setMessage(null);
    try {
      await action();
      if (newStatus) {
        setStatus(newStatus);
        localStorage.setItem("clock-status", newStatus);

        if (newStatus === "in") {
          localStorage.setItem("clock-username", username);
          localStorage.setItem("clock-code", code);
          setBreakTime(0);
          if (onAuthChange) onAuthChange();
        }
        if (newStatus === "break") {
          const now = new Date();
          setBreakStartTime(now);
          localStorage.setItem("break-start-time", now.toISOString());
        }
        if (newStatus === "out") {
          localStorage.removeItem("clock-username");
          localStorage.removeItem("clock-code");
          localStorage.removeItem("break-start-time");
          setUsername("");
          setCode("");
          setBreakStartTime(null);
          setBreakTime(0);
          if (onAuthChange) onAuthChange();
        }
      }
      setMessage(successMessage);
    } catch (e: any) {
      const errorData = JSON.parse(e.message);
      setMessage(errorData.message || "Er is een fout opgetreden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <a href="https://www.lannie.be" target="_blank" style={{ color: "black", textDecoration: "none" }}>
            <h1>Clocky by Lannie</h1>
          </a>
        </div>

        {status === "out" && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p style={inlogStyle}>Geef je inloggegevens in om in te klokken.</p>
            </div>
          </>
        )}

        {status === "out" && (
          <>
            <input style={inputStyle(false)} placeholder="Naam" value={username.toLocaleLowerCase()} onChange={(e) => setUsername(e.target.value)} />
            <input style={inputStyle(false)} placeholder="Project naam" value={project.toLocaleLowerCase()} onChange={(e) => setProject(e.target.value)} />
            <input style={inputStyle(false)} placeholder="Code" type="password" value={code} onChange={(e) => setCode(e.target.value)} />
          </>
        )}

        {status !== "out" && (
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              Hallo {username.substring(0, 1).toLocaleUpperCase()}
              {username.substring(1)}
            </p>
            <div
              style={{
                backgroundColor: status === "in" ? "#e8f5e9" : "#fff8e1",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>{status === "in" ? "Je bent ingeklokt" : "Je bent in pauze"}</p>
              {status === "break" && breakStartTime && <p style={{ margin: "5px 0 0 0" }}>Pauzeduur: {formatTime(breakTime)}</p>}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        {status === "out" && (
          <button
            onClick={() => handleAction(() => clockIn(username, code, project), "Succesvol ingeklokt", "in")}
            disabled={loading || !username || !code || !project}
            style={getButtonStyle(loading || !username || !code || !project, "#3a86ff")}
          >
            {loading ? <ButtonSpinner text="Inklokken" /> : "Inklokken"}
          </button>
        )}

        {status === "in" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={() => handleAction(() => startBreak(username, code, project), "Pauze gestart", "break")} disabled={loading} style={getButtonStyle(loading, "#4CAF50")}>
              {loading ? <ButtonSpinner text="Pauze Starten" /> : "Pauze Starten"}
            </button>

            <button onClick={() => handleAction(() => clockOut(username, code, project), "Succesvol uitgeklokt", "out")} disabled={loading} style={getButtonStyle(loading, "#F44336")}>
              {loading ? <ButtonSpinner text="Uitklokken" /> : "Uitklokken"}
            </button>
          </div>
        )}

        {status === "break" && (
          <button onClick={() => handleAction(() => endBreak(username, code, project), "Pauze beëindigd", "in")} disabled={loading} style={getButtonStyle(loading, "#FF9800")}>
            {loading ? <ButtonSpinner text="Pauze Stoppen" /> : "Pauze Stoppen"}
          </button>
        )}
      </div>

      {message && <div style={messageStyle}>{message}</div>}
    </div>
  );
};

interface ButtonSpinnerProps {
  text: string;
}

const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({ text }) => (
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
