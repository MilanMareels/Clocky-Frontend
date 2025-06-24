import React, { useState, useEffect } from "react";
import { getReport } from "./api";
import { WorkRecord } from "./types";
import "./AdminReport.css"; // We importeren een apart CSS bestand

interface Props {
  username: string;
}

interface Report {
  days: WorkRecord[];
  totalWorked: string;
}

export const AdminReport: React.FC<Props> = ({ username }) => {
  const [report, setReport] = useState<Report>({ days: [], totalWorked: "0u 0m" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await getReport(username);
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
        setError(e.message || "Er is iets misgegaan");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [username]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  if (loading)
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );

  if (error)
    return (
      <div className="error-message">
        <p className="error-title">Fout</p>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="report-container">
      <div className="report-card">
        <div className="report-header">
          <h2>Werkrapport voor {username}</h2>
        </div>

        <div className="report-summary">
          <div className="total-hours">
            <span className="summary-label">Totaal gewerkte uren:</span>
            <span className="hours-badge">{report.totalWorked}</span>
          </div>
        </div>

        <div className="table-container">
          <table className="report-table">
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
              {report.days.length === 0 ? (
                <tr>
                  <td colSpan={5} className="no-data">
                    Geen werkgegevens gevonden
                  </td>
                </tr>
              ) : (
                report.days.map((day) => (
                  <tr key={day.date} className="table-row">
                    <td className="date-cell">
                      <div>{formatDate(day.date)}</div>
                    </td>
                    <td>
                      <div>{formatTime(day.clockIn)}</div>
                    </td>
                    <td>
                      <div>{day.clockOut ? formatTime(day.clockOut) : "-"}</div>
                    </td>
                    <td className="breaks-cell">
                      {day.breaks.length > 0 ? (
                        <ul className="breaks-list">
                          {day.breaks.map((b, i) => (
                            <li key={i}>
                              {formatTime(b.start)} - {b.end ? formatTime(b.end) : "..."}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="no-breaks">-</span>
                      )}
                    </td>
                    <td>
                      <span className="worked-hours-badge">{day.workedHours}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
