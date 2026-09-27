import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";

type User = { id: string; name: string; email: string; role: string };
const Ctx = createContext<{ user: User | null; loading: boolean; login: (e: string, p: string) => Promise<void>; logout: () => Promise<void> } | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api("/auth/me").then(d => setUser(d.user)).finally(() => setLoading(false)); }, []);
  const login = async (email: string, password: string) => {
    const d = await api("/auth/login", { body: { email, password } });
    if (d.user.role !== "admin") { await api("/auth/logout", { method: "POST" }); throw new Error("This account doesn't have admin access"); }
    setUser(d.user);
  };
  const logout = async () => { await api("/auth/logout", { method: "POST" }); setUser(null); };
  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx)!;
