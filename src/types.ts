export interface WorkRecord {
  date: string;
  clockIn: string;
  clockOut: string | null;
  breaks: { start: string; end: string | null }[];
  workedHours: number; // uren als getal (decimaal)
}

export interface Report {
  days: WorkRecord[];
  totalHours: number;
}
