import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";

const NAV = [["/", "Dashboard"], ["/orders", "Orders"], ["/products", "Products"], ["/courses", "Courses"], ["/coupons", "Coupons"], ["/customers", "Customers"], ["/foundation/donations", "Foundation · Donations"], ["/foundation/messages", "Foundation · Messages"], ["/settings", "Settings"]];

export function Layout() {
  const { user, logout } = useAuth();
  return <div className="shell">
    <aside className="side">
      <div className="brand">EMBROWERMENT<small>Admin</small></div>
      <nav>{NAV.map(([to, l]) => <NavLink key={to} to={to} end={to === "/"}>{l}</NavLink>)}</nav>
      <div className="me"><span>{user?.email}</span><button className="link" onClick={logout}>Log out</button></div>
    </aside>
    <main className="main"><Outlet /></main>
  </div>;
}
