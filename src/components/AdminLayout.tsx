import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/dashboard" className="admin-logo">
          Blog Admin
        </Link>

        <nav className="admin-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            Blogs
          </NavLink>

          <NavLink
            to="/blogs/new"
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            Add Blog
          </NavLink>

          <div className="admin-logout-wrap">
            <button type="button" onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">Sevenmen Blog Admin</h1>

          <button
            type="button"
            onClick={handleLogout}
            className="mobile-logout-btn"
          >
            Logout
          </button>
        </header>

        <div className="admin-page-content">{children}</div>
      </main>
    </div>
  );
}