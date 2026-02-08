import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Admin.scss";

/**
 * AdminLogin
 *
 * Firebase email/password login form for the admin panel.
 */
function AdminLogin() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Override body background for login page
    useEffect(() => {
        document.body.style.backgroundColor = "#0a0a0a";
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(
                err.code === "auth/invalid-credential"
                    ? "Invalid email or password"
                    : err.message
            );
        }
        setLoading(false);
    };

    return (
        <div className="admin-login">
            <div className="admin-login__card">
                <h1 className="admin-login__title">Admin Panel</h1>
                <p className="admin-login__subtitle">Sign in to manage your portfolio</p>

                {error && <div className="admin-login__error">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-login__form">
                    <div className="admin-login__group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div className="admin-login__group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="admin-btn admin-btn--primary admin-btn--full"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
