import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { AuthShell } from "@/components/site";

export const Route = createFileRoute("/forgot-password")({ head: () => ({ meta: [{ title: "Reset password — Embrowerment®" }] }), component: Forgot });

function Forgot() {
  const [email, setEmail] = useState(""); const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => { e.preventDefault(); setErr(""); setBusy(true); try { setMsg((await api<{ message: string }>("/auth/forgot", { body: { email } })).message); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); } };
  return <AuthShell title="Reset password" sub="Enter your email and we'll send you a link to reset your password." foot={<Link to="/login" search={{ next: undefined }}>Back to log in</Link>}>
    {msg ? <p className="notice">{msg}</p> : <form className="form" onSubmit={submit}>
      <label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      {err && <p className="form-error">{err}</p>}
      <button className="btn-solid" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
    </form>}
  </AuthShell>;
}
