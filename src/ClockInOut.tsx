import React, { useState, useEffect } from "react";
import { clockIn, clockOut, startBreak, endBreak } from "./api";
import { containerStyle, inputStyle, getButtonStyle, messageStyle } from "./styles";

interface Props {}

export const ClockInOut: React.FC<Props> = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"out" | "in" | "break">("out");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedStatus = localStorage.getItem("clock-status");
    if (savedStatus === "in" || savedStatus === "break") {
      setStatus(savedStatus);
    }
  }, []);

  const handleAction = async (action: () => Promise<void>, successMessage: string, newStatus?: "out" | "in" | "break") => {
    setLoading(true);
    setMessage(null);
    try {
      await action();
      if (newStatus) {
        setStatus(newStatus);
        localStorage.setItem("clock-status", newStatus);
      }
      setMessage(successMessage);
    } catch (e: any) {
      setMessage(e.message || "Er is een fout opgetreden");
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
          <h1>Clocky</h1>
        </div>
        <input style={inputStyle(status !== "out")} placeholder="Naam" value={username} onChange={(e) => setUsername(e.target.value)} disabled={status !== "out"} />

        <input
          style={inputStyle(status === "in" || status === "break")}
          placeholder="Code"
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={status === "in" || status === "break"}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        {status === "out" && (
          <button
            onClick={() => handleAction(() => clockIn(username, code), "Succesvol ingeklokt", "in")}
            disabled={loading || !username || !code}
            style={getButtonStyle(loading || !username || !code, "#3a86ff")}
          >
            {loading ? <ButtonSpinner text="Inklokken" /> : "Inklokken"}
          </button>
        )}

        {status === "in" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={() => handleAction(() => startBreak(username, code), "Pauze gestart", "break")} disabled={loading} style={getButtonStyle(loading, "#4CAF50")}>
              {loading ? <ButtonSpinner text="Pauze Starten" /> : "Pauze Starten"}
            </button>

            <button onClick={() => handleAction(() => clockOut(username, code), "Succesvol uitgeklokt", "out")} disabled={loading} style={getButtonStyle(loading, "#F44336")}>
              {loading ? <ButtonSpinner text="Uitklokken" /> : "Uitklokken"}
            </button>
          </div>
        )}

        {status === "break" && (
          <button onClick={() => handleAction(() => endBreak(username, code), "Pauze beëindigd", "in")} disabled={loading} style={getButtonStyle(loading, "#FF9800")}>
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
