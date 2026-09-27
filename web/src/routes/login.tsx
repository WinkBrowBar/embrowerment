import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useStore, AuthShell, safeNext } from "@/components/site";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { next?: string | undefined } => ({ next: typeof s["next"] === "string" ? s["next"] : undefined }),
  head: () => ({ meta: [{ title: "Log in — Embrowerment®" }] }),
  component: Login,
});

function Login() {
  const { login, user, ready } = useStore(); const { next } = Route.useSearch(); const nav = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (ready && user) nav({ to: safeNext(next) as "/" }); }, [ready, user, next, nav]);
  const submit = async (e: FormEvent) => { e.preventDefault(); setErr(""); setBusy(true); try { await login(email, password); } catch (x) { setErr((x as Error).message); setBusy(false); } };
  return <AuthShell title="Log in" foot={<>New here? <Link to="/register" search={{ next }}>Create an account</Link></>}>
    <form className="form" onSubmit={submit}>
      <label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      {err && <p className="form-error" role="alert">{err}</p>}
      <button className="btn-solid" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      <Link to="/forgot-password" className="link small">Forgot your password?</Link>
    </form>
  </AuthShell>;
}
