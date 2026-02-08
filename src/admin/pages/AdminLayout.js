import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Admin.scss";

/**
 * AdminLayout
 *
 * Sidebar navigation + content area for all admin pages.
 * Uses react-router Outlet for nested routes.
 */
function AdminLayout() {
    const { user, logout } = useAuth();

    // Override body background for admin pages
    useEffect(() => {
        document.body.style.backgroundColor = "#0a0a0a";
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    const navItems = [
        { path: "/admin", label: "Dashboard", icon: "📊", end: true },
        { path: "/admin/about", label: "About", icon: "👤" },
        { path: "/admin/experience", label: "Experience", icon: "💼" },
        { path: "/admin/projects", label: "Projects", icon: "🚀" },
        { path: "/admin/contact", label: "Contact", icon: "📧" },
        { path: "/admin/socials", label: "Social Links", icon: "🔗" },
        { path: "/admin/settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar__header">
                    <h2>Portfolio Admin</h2>
                    <span className="admin-sidebar__email">{user?.email || "Dev Mode"}</span>
                </div>

                <nav className="admin-sidebar__nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`
                            }
                        >
                            <span className="admin-sidebar__icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar__footer">
                    <a href="/" className="admin-sidebar__link" target="_blank" rel="noreferrer">
                        <span className="admin-sidebar__icon">🌐</span>
                        View Site
                    </a>
                    <button onClick={logout} className="admin-sidebar__link admin-sidebar__logout">
                        <span className="admin-sidebar__icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
