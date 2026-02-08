import React, { useState, useEffect, useCallback } from "react";
import { fetchSettings, updateSettings } from "../../services/api";
import { uploadToCloudinary } from "../../services/cloudinary";
import "./Admin.scss";

/**
 * Default pages — used when no pages exist in Firestore yet.
 */
const DEFAULT_PAGES = [
    { id: "about", name: "About Me", path: "/about", visible: true, sort_order: 1 },
    { id: "experience", name: "Experience", path: "/experience", visible: true, sort_order: 2 },
    { id: "projects", name: "Projects", path: "/projects", visible: true, sort_order: 3 },
    { id: "contact", name: "Contact Me", path: "/contact", visible: true, sort_order: 4 },
];

/**
 * AdminSettings
 *
 * Global site settings stored in Firestore document `portfolio/settings`.
 * Now includes page/navigation management: rename, show/hide, reorder pages.
 */
function AdminSettings() {
    const [form, setForm] = useState({
        site_title: "",
        hero_name: "",
        hero_heading: "",
        hero_subheading: "",
        hero_tagline: "",
        footer_text: "",
        meta_description: "",
        years_of_experience: "",
        current_location: "",
        job_title: "",
        favicon_url: "",
        theme_color: "#4801ff",
    });
    const [pages, setPages] = useState(DEFAULT_PAGES);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSettings();
                if (data) {
                    const { pages: savedPages, ...rest } = data;
                    setForm((prev) => ({ ...prev, ...rest }));
                    if (savedPages && savedPages.length > 0) {
                        setPages(savedPages.sort((a, b) => a.sort_order - b.sort_order));
                    }
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        load();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        try {
            await updateSettings({ ...form, pages });
            setMessage({ type: "success", text: "Settings saved!" });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        }
    };

    const change = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleFaviconUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const { url } = await uploadToCloudinary(file);
            change("favicon_url", url);
            setMessage({ type: "success", text: "Favicon uploaded!" });
        } catch (err) {
            setMessage({ type: "error", text: "Favicon upload failed: " + err.message });
        }
    };

    /* ── Page management helpers ── */

    const updatePage = useCallback((index, field, value) => {
        setPages((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }, []);

    const movePage = useCallback((index, direction) => {
        setPages((prev) => {
            const arr = [...prev];
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= arr.length) return arr;
            // Swap items
            [arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]];
            // Recalculate sort_order
            return arr.map((p, i) => ({ ...p, sort_order: i + 1 }));
        });
    }, []);

    const addPage = useCallback(() => {
        setPages((prev) => [
            ...prev,
            {
                id: `custom-${Date.now()}`,
                name: "New Page",
                path: `/page-${prev.length + 1}`,
                visible: true,
                sort_order: prev.length + 1,
                is_custom: true,
            },
        ]);
    }, []);

    const removePage = useCallback((index) => {
        setPages((prev) => {
            const arr = prev.filter((_, i) => i !== index);
            return arr.map((p, i) => ({ ...p, sort_order: i + 1 }));
        });
    }, []);

    if (loading) return <div className="admin-page"><p>Loading...</p></div>;

    return (
        <div className="admin-page">
            <h1>Settings</h1>

            {message.text && (
                <div className={`admin-message admin-message--${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form admin-form--wide">
                {/* ═══ PAGES / NAVIGATION ═══ */}
                <h2 className="admin-form__section">Pages / Navigation</h2>
                <p className="admin-form__hint">
                    Manage which pages appear on the home screen. Rename, reorder, show or hide them.
                </p>

                <div className="admin-pages-list">
                    {pages.map((page, index) => (
                        <div
                            key={page.id}
                            className={`admin-pages-item ${!page.visible ? "admin-pages-item--hidden" : ""}`}
                        >
                            {/* Sort order number */}
                            <span className="admin-pages-item__order">{index + 1}</span>

                            {/* Move up / down */}
                            <div className="admin-pages-item__arrows">
                                <button
                                    type="button"
                                    className="admin-pages-item__arrow"
                                    onClick={() => movePage(index, -1)}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    ▲
                                </button>
                                <button
                                    type="button"
                                    className="admin-pages-item__arrow"
                                    onClick={() => movePage(index, 1)}
                                    disabled={index === pages.length - 1}
                                    title="Move down"
                                >
                                    ▼
                                </button>
                            </div>

                            {/* Name */}
                            <div className="admin-pages-item__name">
                                <label>Name</label>
                                <input
                                    value={page.name}
                                    onChange={(e) => updatePage(index, "name", e.target.value)}
                                    placeholder="Page Name"
                                />
                            </div>

                            {/* Path */}
                            <div className="admin-pages-item__path">
                                <label>Path</label>
                                <input
                                    value={page.path}
                                    onChange={(e) => updatePage(index, "path", e.target.value)}
                                    placeholder="/about"
                                    disabled={!page.is_custom}
                                    title={page.is_custom ? "Edit path" : "Built-in page path (not editable)"}
                                />
                            </div>

                            {/* Visible toggle */}
                            <label className="admin-toggle" title={page.visible ? "Visible" : "Hidden"}>
                                <input
                                    type="checkbox"
                                    checked={page.visible}
                                    onChange={(e) => updatePage(index, "visible", e.target.checked)}
                                />
                                <span className="admin-toggle__slider" />
                                <span className="admin-toggle__label">
                                    {page.visible ? "Visible" : "Hidden"}
                                </span>
                            </label>

                            {/* Remove (custom pages only) */}
                            {page.is_custom && (
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--danger admin-btn--small"
                                    onClick={() => removePage(index)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="admin-btn admin-btn--outline admin-btn--small"
                    onClick={addPage}
                    style={{ marginTop: "0.5rem" }}
                >
                    + Add Custom Page
                </button>

                {/* ═══ GENERAL ═══ */}
                <h2 className="admin-form__section">General</h2>

                <div className="admin-form__group">
                    <label>Site Title (Browser Tab)</label>
                    <input
                        value={form.site_title}
                        onChange={(e) => change("site_title", e.target.value)}
                        placeholder="Ashish — Portfolio"
                    />
                </div>

                <div className="admin-form__group">
                    <label>Favicon (Browser Tab Icon)</label>
                    <input
                        type="file"
                        accept="image/png,image/x-icon,image/svg+xml,image/jpeg"
                        onChange={handleFaviconUpload}
                    />
                    {form.favicon_url && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.4rem" }}>
                            <img
                                src={form.favicon_url}
                                alt="Favicon preview"
                                style={{ width: 32, height: 32, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)" }}
                            />
                            <a href={form.favicon_url} target="_blank" rel="noreferrer" className="admin-file-link">
                                View favicon
                            </a>
                            <button
                                type="button"
                                className="admin-btn admin-btn--danger admin-btn--small"
                                onClick={() => change("favicon_url", "")}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <div className="admin-form__group">
                    <label>Meta Description</label>
                    <textarea
                        rows={2}
                        value={form.meta_description}
                        onChange={(e) => change("meta_description", e.target.value)}
                        placeholder="Portfolio of Ashish, a Laravel Developer..."
                    />
                </div>

                <div className="admin-form__group">
                    <label>Theme Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <input
                            type="color"
                            value={form.theme_color || "#4801ff"}
                            onChange={(e) => change("theme_color", e.target.value)}
                            style={{
                                width: 48,
                                height: 36,
                                padding: 2,
                                border: "1px solid #2a2a2a",
                                borderRadius: 8,
                                background: "#141414",
                                cursor: "pointer",
                            }}
                        />
                        <input
                            value={form.theme_color || "#4801ff"}
                            onChange={(e) => change("theme_color", e.target.value)}
                            placeholder="#4801ff"
                            style={{ width: 120, fontFamily: "monospace" }}
                        />
                        <button
                            type="button"
                            className="admin-btn admin-btn--outline admin-btn--small"
                            onClick={() => change("theme_color", "#4801ff")}
                        >
                            Reset
                        </button>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#777", marginTop: "0.25rem" }}>
                        Changes the background color of your entire portfolio
                    </span>
                </div>

                {/* ═══ HERO ═══ */}
                <h2 className="admin-form__section">Hero Section</h2>

                <div className="admin-form__group">
                    <label>Logo Name (displayed in header)</label>
                    <input
                        value={form.hero_name}
                        onChange={(e) => change("hero_name", e.target.value)}
                        placeholder="ASH"
                    />
                </div>

                <div className="admin-form__group">
                    <label>Hero Heading</label>
                    <input
                        value={form.hero_heading}
                        onChange={(e) => change("hero_heading", e.target.value)}
                        placeholder="LARAVEL DEVELOPER"
                    />
                </div>

                <div className="admin-form__group">
                    <label>Hero Sub-heading</label>
                    <input
                        value={form.hero_subheading}
                        onChange={(e) => change("hero_subheading", e.target.value)}
                        placeholder="Based in Mumbai"
                    />
                </div>

                <div className="admin-form__group">
                    <label>Hero Tagline</label>
                    <input
                        value={form.hero_tagline}
                        onChange={(e) => change("hero_tagline", e.target.value)}
                        placeholder="Building modern web experiences"
                    />
                </div>

                {/* ═══ ABOUT YOU ═══ */}
                <h2 className="admin-form__section">About You</h2>

                <div className="admin-form__group">
                    <label>Job Title</label>
                    <input
                        value={form.job_title}
                        onChange={(e) => change("job_title", e.target.value)}
                        placeholder="Backend Developer"
                    />
                </div>

                <div className="admin-form__group">
                    <label>Years of Experience</label>
                    <input
                        value={form.years_of_experience}
                        onChange={(e) => change("years_of_experience", e.target.value)}
                        placeholder="0.5"
                    />
                </div>

                <div className="admin-form__group">
                    <label>Current Location</label>
                    <input
                        value={form.current_location}
                        onChange={(e) => change("current_location", e.target.value)}
                        placeholder="Surat, Gujarat"
                    />
                </div>

                {/* ═══ FOOTER ═══ */}
                <h2 className="admin-form__section">Footer</h2>

                <div className="admin-form__group">
                    <label>Footer Text</label>
                    <input
                        value={form.footer_text}
                        onChange={(e) => change("footer_text", e.target.value)}
                        placeholder="© 2026 Ashish. All rights reserved."
                    />
                </div>

                <div className="admin-form__actions">
                    <button type="submit" className="admin-btn admin-btn--primary">
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminSettings;
