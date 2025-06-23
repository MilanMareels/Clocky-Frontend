import React, { useState, useEffect } from "react";
import { clockIn, clockOut, startBreak, endBreak } from "./api";

interface Props {}

export const ClockInOut: React.FC<Props> = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"out" | "in" | "break">("out");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check localStorage for current status (simple client-side)
  useEffect(() => {
    const savedStatus = localStorage.getItem("clock-status");
    if (savedStatus === "in" || savedStatus === "break") setStatus(savedStatus);
  }, []);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await clockIn(username, code);
      setStatus("in");
      localStorage.setItem("clock-status", "in");
      setMessage("Succesvol ingeklokt");
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await clockOut(username, code);
      setStatus("out");
      localStorage.removeItem("clock-status");
      setMessage("Succesvol uitgeklokt");
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartBreak = async () => {
    setLoading(true);
    try {
      await startBreak(username, code);
      setStatus("break");
      localStorage.setItem("clock-status", "break");
      setMessage("Pauze gestart");
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndBreak = async () => {
    setLoading(true);
    try {
      await endBreak(username, code);
      setStatus("in");
      localStorage.setItem("clock-status", "in");
      setMessage("Pauze beëindigd");
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Klok Systeem</h2>

      <input placeholder="Naam" value={username} onChange={(e) => setUsername(e.target.value)} disabled={status !== "out"} />
      <input placeholder="Code" type="password" value={code} onChange={(e) => setCode(e.target.value)} disabled={status === "in" || status === "break"} />

      <div style={{ marginTop: 20 }}>
        {status === "out" && (
          <button onClick={handleClockIn} disabled={loading || !username || !code}>
            Inklokken
          </button>
        )}

        {status === "in" && (
          <>
            <button onClick={handleStartBreak} disabled={loading}>
              Pauze Starten
            </button>
            <button onClick={handleClockOut} disabled={loading}>
              Uitklokken
            </button>
          </>
        )}

        {status === "break" && (
          <button onClick={handleEndBreak} disabled={loading}>
            Pauze Stoppen
          </button>
        )}
      </div>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
};
