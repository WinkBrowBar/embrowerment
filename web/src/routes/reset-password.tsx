import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { api, type User } from "@/lib/api";
import { AuthShell, useStore } from "@/components/site";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s["token"] === "string" ? s["token"] : "", email: typeof s["email"] === "string" ? s["email"] : "" }),
  head: () => ({ meta: [{ title: "Choose a new password — Embrowerment®" }, { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const { token, email } = Route.useSearch(); const nav = useNavigate(); const { refreshUser } = useStore();
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr("");
    if (password !== confirm) { setErr("Passwords don't match"); return; }
    setBusy(true);
    try { await api<{ user: User }>("/auth/reset", { body: { token, email, password } }); await refreshUser(); nav({ to: "/account" }); }
    catch (x) { setErr((x as Error).message); setBusy(false); }
  };
  if (!token || !email) return <AuthShell title="Reset password" sub="This reset link is incomplete. Please request a new one." />;
  return <AuthShell title="Choose a new password" sub={email}>
    <form className="form" onSubmit={submit}>
      <label>New password<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></label>
      <label>Confirm password<input type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={e => setConfirm(e.target.value)} /></label>
      {err && <p className="form-error">{err}</p>}
      <button className="btn-solid" disabled={busy}>{busy ? "Saving…" : "Save password"}</button>
    </form>
  </AuthShell>;
}
