export class HttpError extends Error {
  constructor(status, message, details) { super(message); this.status = status; this.details = details; }
}
export const bad = (msg, details) => new HttpError(400, msg, details);
export const notFound = (msg = "Not found") => new HttpError(404, msg);
export const forbidden = (msg = "Forbidden") => new HttpError(403, msg);
export const unauthorized = (msg = "Please log in") => new HttpError(401, msg);

/** Validate req[part] with a zod schema; returns parsed data. */
export const parse = (schema, data) => {
  const r = schema.safeParse(data);
  if (!r.success) throw bad("Invalid input", r.error.issues.map(i => ({ path: i.path.join("."), message: i.message })));
  return r.data;
};

export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
