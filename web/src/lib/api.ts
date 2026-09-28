export const API = (import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:4000";

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: { path: string; message: string }[]) { super(message); }
}

export async function api<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const init: RequestInit = { method: opts.method || (opts.body ? "POST" : "GET"), credentials: "include" };
  if (opts.body) { init.headers = { "Content-Type": "application/json" }; init.body = JSON.stringify(opts.body); }
  const res = await fetch(`${API}/api${path}`, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.details?.[0]?.message || data.error || "Something went wrong", data.details);
  return data as T;
}

export const money = (n?: number) => `$${Number(n || 0).toFixed(2)}`;

export type Variant = { name: string; inStock: boolean };
export type Product = { id: string; name: string; slug: string; tagline: string; description: string; price: number; compareAtPrice?: number; category: string; images: string[]; variantLabel: string; variants: Variant[]; sections: { title: string; body: string }[]; inStock: boolean; featured: boolean; comingSoon?: boolean };
export type Lesson = { id: string; title: string; durationMin: number; preview: boolean; videoUrl?: string; content?: string };
export type Course = { id: string; title: string; slug: string; summary: string; description: string; price: number; image: string; points: string[]; owned: boolean; lessonCount: number; totalMinutes: number; lessons: Lesson[] };
export type Line = { kind: "product" | "course"; ref: string; variant?: string | undefined; qty: number };
export type QuoteItem = { kind: "product" | "course"; ref: string; slug: string; name: string; variant: string; image: string; price: number; qty: number; inStock: boolean };
export type Quote = { items: QuoteItem[]; subtotal: number; discount: number; shipping: number; tax: number; total: number; requiresShipping: boolean; problems: { ref: string; message: string }[]; couponError: string | null; coupon: { code: string; type: string; value: number; description: string } | null };
export type User = { id: string; name: string; email: string; role: string };
export type Order = { id: string; number: string; status: string; items: (QuoteItem & { ref: string })[]; subtotal: number; discount: number; shipping: number; tax: number; total: number; coupon: { code: string } | null; shippingAddress?: { name?: string; line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string }; trackingNumber?: string; createdAt: string; paidAt?: string; history: { status: string; note: string; at: string }[] };