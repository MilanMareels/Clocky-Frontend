import React, { useState, useEffect } from "react";
import { getReport } from "./api";
import { WorkRecord } from "./types";
import "./AdminReport.css";

interface Report {
  days: WorkRecord[];
  totalWorked: string;
}

interface AdminReportProps {
  username: string;
  code: string;
}

export const AdminReport: React.FC<AdminReportProps> = ({ username, code }) => {
  const [report, setReport] = useState<Report>({ days: [], totalWorked: "0u 0m" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await getReport(username, code);
        if (data && Array.isArray(data.days)) {
          setReport({
            days: data.days.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            totalWorked: data.totalWorked || "0u 0m",
          });
          setError(null);
        } else {
          setError("Ongeldige data ontvangen van server");
        }
      } catch (e: any) {
        setError(e.message || "Er is iets misgegaan bij het ophalen van het rapport");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchReport();
    }
  }, [username]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p className="error-title">Fout</p>
        <p>{error}</p>
        <p>Controleer of je gegevens correct zijn ingevuld en probeer opnieuw.</p>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Werkrapport voor {username}</h2>
        <div className="total-hours">
          <span>Totaal gewerkte uren: </span>
          <strong>{report.totalWorked}</strong>
        </div>
      </div>

      <div className="days-container">
        {report.days.length === 0 ? (
          <div className="no-data">Geen werkgegevens gevonden</div>
        ) : (
          report.days.map((day) => (
            <div key={day.date} className="day-card">
              <div className="day-header">
                <h3>{formatDate(day.date)}</h3>
                <span className="worked-hours">{day.workedHours}</span>
              </div>

              <div className="time-row">
                <span className="time-label">Inklok:</span>
                <span>{formatTime(day.clockIn)}</span>
              </div>

              <div className="time-row">
                <span className="time-label">Uitklok:</span>
                <span>{day.clockOut ? formatTime(day.clockOut) : "-"}</span>
              </div>

              {day.breaks.length > 0 && (
                <div className="breaks-section">
                  <div className="time-label">Pauzes:</div>
                  <ul className="breaks-list">
                    {day.breaks.map((b, i) => (
                      <li key={i}>
                        {formatTime(b.start)} - {b.end ? formatTime(b.end) : "..."}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
