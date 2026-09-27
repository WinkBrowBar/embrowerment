import type { ReactNode } from "react";

export function AuthShell({ title, sub, children, foot }: { title: string; sub?: ReactNode; children?: ReactNode; foot?: ReactNode }) {
  return <section className="auth">
    <div className="auth-card">
      <h1 className="h-display">{title}</h1>
      {sub && <p className="lede">{sub}</p>}
      {children}
      {foot && <div className="auth-foot">{foot}</div>}
    </div>
  </section>;
}

/** Only allow same-site relative redirects. */
export const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/account");
