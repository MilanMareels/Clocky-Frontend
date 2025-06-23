const BASE_URL = "https://clocky-backend.vercel.app/api/v1";

async function postJSON(path: string, data: any) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const clockIn = (username: string, code: string) => postJSON("/clockin", { username, code });

export const clockOut = (username: string, code: string) => postJSON("/clockout", { username, code });

export const startBreak = (username: string, code: string) => postJSON("/startBreak", { username, code });

export const endBreak = (username: string, code: string) => postJSON("/endBreak", { username, code });

export async function getReport(username: string) {
  const res = await fetch(`${BASE_URL}/clock/${username}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
