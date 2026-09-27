import { useState } from "react";
import { Link } from "react-router-dom";
import { api, money, date } from "../api";
import { Page, Badge, useLoad, Empty } from "../components/ui";

function RevenueChart({ series }: { series: { date: string; total: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720, H = 200, P = { l: 44, r: 8, t: 12, b: 24 };
  const max = Math.max(10, ...series.map(s => s.total));
  const step = Math.pow(10, Math.floor(Math.log10(max))); const top = Math.ceil(max / step) * step;
  const bw = (W - P.l - P.r) / series.length; const y = (v: number) => P.t + (H - P.t - P.b) * (1 - v / top);
  const ticks = [0, top / 2, top];
  return <div className="chart">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Revenue per day, last 30 days" onMouseLeave={() => setHover(null)}>
      {ticks.map(t => <g key={t}><line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="grid" /><text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="tick">${t >= 1000 ? `${t / 1000}k` : t}</text></g>)}
      {series.map((s, i) => {
        const x = P.l + i * bw, h = Math.max(0, y(0) - y(s.total)), r = Math.min(4, h / 2, (bw - 2) / 2);
        return <g key={s.date} onMouseEnter={() => setHover(i)}>
          <rect x={x} y={P.t} width={bw} height={H - P.t - P.b} fill="transparent" />
          {h > 0 && <path className={`bar${hover === i ? " on" : ""}`} d={`M${x + 1},${y(0)} v${-(h - r)} q0,${-r} ${r},${-r} h${bw - 2 - 2 * r} q${r},0 ${r},${r} v${h - r} z`} />}
          {i % 7 === 0 && <text x={x + bw / 2} y={H - 6} textAnchor="middle" className="tick">{s.date.slice(5)}</text>}
        </g>;
      })}
    </svg>
    {hover !== null && <div className="tip" style={{ left: `${((P.l + hover * bw + bw / 2) / W) * 100}%` }}><b>{money(series[hover].total)}</b><span>{new Date(series[hover].date + "T00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></div>}
  </div>;
}

export function Dashboard() {
  const { data, error } = useLoad(() => api("/admin/stats"));
  if (error) return <Page title="Dashboard"><p className="error">{error}</p></Page>;
  if (!data) return <Page title="Dashboard"><p className="muted">Loading…</p></Page>;
  return <Page title="Dashboard">
    <div className="stats">
      <div className="stat"><span>Revenue · 30 days</span><b>{money(data.revenue30)}</b><small>{data.orders30} orders</small></div>
      <div className="stat"><span>Revenue · all time</span><b>{money(data.revenueAll)}</b><small>{data.ordersAll} orders</small></div>
      <div className="stat"><span>Customers</span><b>{data.customers}</b></div>
      <div className="stat"><span>Catalog</span><b>{data.products}</b><small>products · {data.courses} courses</small></div>
    </div>
    <section className="card"><h2>Revenue per day · last 30 days</h2><RevenueChart series={data.series} /></section>
    <div className="two">
      <section className="card"><h2>Recent orders</h2>
        {data.recent.length ? <table className="table"><tbody>{data.recent.map((o: any) => <tr key={o._id}><td><Link to={`/orders/${o._id}`}>{o.number}</Link></td><td className="muted">{o.email}</td><td><Badge status={o.status} /></td><td className="num">{money(o.total)}</td></tr>)}</tbody></table> : <Empty>No orders yet.</Empty>}
      </section>
      <section className="card"><h2>Low stock (≤ 5)</h2>
        {data.lowStock.length ? <table className="table"><tbody>{data.lowStock.map((p: any) => <tr key={p.id + p.variant}><td><Link to={`/products/${p.id}`}>{p.name}</Link>{p.variant && <span className="muted"> · {p.variant}</span>}</td><td className="num">{p.stock}</td></tr>)}</tbody></table> : <Empty>All products are well stocked.</Empty>}
      </section>
    </div>
    <p className="muted small">Last updated {date(new Date().toISOString())}</p>
  </Page>;
}
