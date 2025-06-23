import React, { useState, useEffect } from "react";
import { getReport } from "./api";
import { WorkRecord } from "./types";

interface Props {
  username: string;
}

interface Report {
  days: WorkRecord[];
  totalHours: number;
}

export const AdminReport: React.FC<Props> = ({ username }) => {
  // Default state voorkomt undefined errors
  const [report, setReport] = useState<Report>({ days: [], totalHours: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await getReport(username);
        // Log voor debuggen
        console.log("Report data:", data);
        // Check of data shape klopt, anders fallback
        if (data && Array.isArray(data.days) && typeof data.totalHours === "number") {
          setReport(data);
          setError(null);
        } else {
          setError("Ongeldige data ontvangen van server");
          setReport({ days: [], totalHours: 0 });
        }
      } catch (e: any) {
        setError(e.message || "Er is iets misgegaan");
        setReport({ days: [], totalHours: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [username]);

  if (loading) return <p>Laden...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Rapport voor {username}</h2>
      <p>
        <strong>Totaal gewerkte uren:</strong> {report.totalHours.toFixed(2)}
      </p>
      <table border={1} cellPadding={5} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Inklok</th>
            <th>Uitklok</th>
            <th>Pauzes</th>
            <th>Gewerkte uren</th>
          </tr>
        </thead>
        <tbody>
          {report.days.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Geen data gevonden
              </td>
            </tr>
          )}
          {report.days.map((day) => (
            <tr key={day.date}>
              <td>{day.date}</td>
              <td>{new Date(day.clockIn).toLocaleTimeString()}</td>
              <td>{day.clockOut ? new Date(day.clockOut).toLocaleTimeString() : "-"}</td>
              <td>{day.breaks.length > 0 ? day.breaks.map((b) => `${new Date(b.start).toLocaleTimeString()} - ${b.end ? new Date(b.end).toLocaleTimeString() : "..."}`).join(", ") : "-"}</td>
              <td>{day.workedHours.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
