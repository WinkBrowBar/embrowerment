import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useStore, AuthShell, safeNext } from "@/components/site";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { next?: string | undefined } => ({ next: typeof s["next"] === "string" ? s["next"] : undefined }),
  head: () => ({ meta: [{ title: "Create account — Embrowerment®" }] }),
  component: Register,
});

function Register() {
  const { register, user, ready } = useStore(); const { next } = Route.useSearch(); const nav = useNavigate();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (ready && user) nav({ to: safeNext(next) as "/" }); }, [ready, user, next, nav]);
  const submit = async (e: FormEvent) => { e.preventDefault(); setErr(""); setBusy(true); try { await register(name, email, password); } catch (x) { setErr((x as Error).message); setBusy(false); } };
  return <AuthShell title="Create account" foot={<>Already have an account? <Link to="/login" search={{ next }}>Log in</Link></>}>
    <form className="form" onSubmit={submit}>
      <label>Name<input autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></label>
      <label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /><small className="muted-t">At least 8 characters</small></label>
      {err && <p className="form-error" role="alert">{err}</p>}
      <button className="btn-solid" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
    </form>
  </AuthShell>;
}
