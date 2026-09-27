import { StrictMode, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import { AuthProvider, useAuth } from "./auth";
import { Layout } from "./components/Layout";
import { Toasts } from "./components/ui";
import { Dashboard } from "./pages/Dashboard";
import { Orders, OrderDetail } from "./pages/Orders";
import { Products, ProductEdit } from "./pages/Products";
import { Courses, CourseEdit } from "./pages/Courses";
import { Coupons } from "./pages/Coupons";
import { Customers } from "./pages/Customers";
import { Settings } from "./pages/Settings";
import { Donations, Messages } from "./pages/Foundation";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setErr(""); try { await login(email, password); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); } };
  return <div className="login"><form onSubmit={submit}>
    <div className="brand">EMBROWERMENT<small>Admin</small></div>
    <label className="field"><span>Email</span><input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
    <label className="field"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
    {err && <p className="error">{err}</p>}
    <button className="btn primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
  </form></div>;
}

function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="boot">Loading…</div>;
  if (!user || user.role !== "admin") return <Login />;
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="orders" element={<Orders />} /><Route path="orders/:id" element={<OrderDetail />} />
      <Route path="products" element={<Products />} /><Route path="products/:id" element={<ProductEdit />} />
      <Route path="courses" element={<Courses />} /><Route path="courses/:id" element={<CourseEdit />} />
      <Route path="coupons" element={<Coupons />} />
      <Route path="customers" element={<Customers />} />
      <Route path="settings" element={<Settings />} />
      <Route path="foundation/donations" element={<Donations />} />
      <Route path="foundation/messages" element={<Messages />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><BrowserRouter><AuthProvider><App /><Toasts /></AuthProvider></BrowserRouter></StrictMode>);
