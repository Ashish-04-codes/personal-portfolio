import React, { useState, useEffect } from "react";
import {
    fetchAbout,
    fetchExperience,
    fetchProjects,
    fetchContact,
    fetchSocials,
} from "../../services/api";
import "./Admin.scss";

/**
 * AdminDashboard
 *
 * Overview / stats page for the admin panel.
 * Fetches data counts from Firestore and displays them.
 */
function AdminDashboard() {
    const [stats, setStats] = useState({
        about: false,
        experience: 0,
        projects: 0,
        contact: false,
        socials: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [about, experience, projects, contact, socials] =
                    await Promise.all([
                        fetchAbout().catch(() => null),
                        fetchExperience().catch(() => []),
                        fetchProjects().catch(() => []),
                        fetchContact().catch(() => null),
                        fetchSocials().catch(() => []),
                    ]);

                setStats({
                    about: !!about,
                    experience: experience.length,
                    projects: projects.length,
                    contact: !!contact,
                    socials: socials.length,
                });
            } catch (err) {
                console.error("Failed to load dashboard stats:", err);
            }
            setLoading(false);
        };
        loadStats();
    }, []);

    if (loading) return <div className="admin-page"><p>Loading...</p></div>;

    return (
        <div className="admin-page">
            <h1>Dashboard</h1>

            <div className="admin-stats">
                <div className="admin-stat-card">
                    <span className="admin-stat-card__value">
                        {stats.about ? "✓" : "✗"}
                    </span>
                    <span className="admin-stat-card__label">About Data</span>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-card__value">
                        {stats.experience}
                    </span>
                    <span className="admin-stat-card__label">Experience</span>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-card__value">
                        {stats.projects}
                    </span>
                    <span className="admin-stat-card__label">Projects</span>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-card__value">
                        {stats.contact ? "✓" : "✗"}
                    </span>
                    <span className="admin-stat-card__label">Contact Info</span>
                </div>
                <div className="admin-stat-card">
                    <span className="admin-stat-card__value">
                        {stats.socials}
                    </span>
                    <span className="admin-stat-card__label">Social Links</span>
                </div>
            </div>

            <div className="admin-info-box" style={{ marginTop: "2rem" }}>
                <h3>🚀 Quick Start</h3>
                <ol style={{ paddingLeft: "1.2rem", lineHeight: "1.8" }}>
                    <li>Fill in your <strong>About</strong> info and upload a profile image</li>
                    <li>Add your <strong>Experience</strong> entries</li>
                    <li>Add <strong>Projects</strong> with descriptions and links</li>
                    <li>Update <strong>Contact</strong> details and <strong>Social</strong> links</li>
                    <li>Customize <strong>Settings</strong> (site title, hero text)</li>
                </ol>
            </div>
        </div>
    );
}

export default AdminDashboard;
