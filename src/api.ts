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

export const clockIn = (username: string, code: string, project: string) => postJSON("/clockin", { username, code, project });

export const clockOut = (username: string, code: string, project: string) => postJSON("/clockout", { username, code, project });

export const startBreak = (username: string, code: string, project: string) => postJSON("/startBreak", { username, code, project });

export const endBreak = (username: string, code: string, project: string) => postJSON("/endBreak", { username, code, project });

export async function getReport(username: string, code: string, project: string) {
  const res = await fetch(`${BASE_URL}/clock/${username}/${code}/${project}`);
  if (!res.ok) throw new Error(await res.text());

  return res.json();
}
