export const API = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: { path: string; message: string }[]) { super(message); }
}

export async function api<T = any>(path: string, opts: { method?: string; body?: unknown; form?: FormData } = {}): Promise<T> {
  const res = await fetch(`${API}/api${path}`, {
    method: opts.method || (opts.body || opts.form ? "POST" : "GET"),
    credentials: "include",
    headers: opts.body ? { "Content-Type": "application/json" } : undefined,
    body: opts.form ?? (opts.body ? JSON.stringify(opts.body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.details?.length ? `${data.error}: ${data.details.map((d: any) => `${d.path || "field"} — ${d.message}`).join("; ")}` : data.error || res.statusText;
    throw new ApiError(res.status, msg, data.details);
  }
  return data as T;
}

export const money = (n?: number) => `$${Number(n || 0).toFixed(2)}`;
export const date = (d?: string) => (d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");
