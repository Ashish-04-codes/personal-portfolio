import React, { useState, useEffect } from "react";
import { fetchSocials, updateSocials } from "../../services/api";
import "./Admin.scss";

/**
 * AdminSocials
 *
 * Manage social-media links (GitHub, LinkedIn, Instagram, etc.).
 * Each entry = { platform, url }.
 * Stored in Firestore `socials` collection (one doc per link).
 */

const PLATFORM_OPTIONS = [
    "resume",
    "github",
    "linkedin",
    "instagram",
    "twitter",
    "dribbble",
    "behance",
    "youtube",
    "facebook",
    "other",
];

function AdminSocials() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSocials();
                setLinks(data.length > 0 ? data : [{ platform: "github", url: "" }]);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        load();
    }, []);

    const change = (index, field, value) => {
        setLinks((prev) =>
            prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
        );
    };

    const addLink = () =>
        setLinks((prev) => [...prev, { platform: "github", url: "" }]);

    const removeLink = (index) =>
        setLinks((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        // Filter out entries with empty URLs
        const validLinks = links.filter((l) => l.url.trim() !== "");

        try {
            await updateSocials(validLinks);
            setMessage({ type: "success", text: "Social links updated!" });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        }
    };

    if (loading) return <div className="admin-page"><p>Loading...</p></div>;

    return (
        <div className="admin-page">
            <h1>Social Links</h1>

            {message.text && (
                <div className={`admin-message admin-message--${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form">
                {links.map((link, index) => (
                    <div key={index} className="admin-form__row">
                        <select
                            className="admin-select"
                            value={link.platform}
                            onChange={(e) => change(index, "platform", e.target.value)}
                        >
                            {PLATFORM_OPTIONS.map((p) => (
                                <option key={p} value={p}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </option>
                            ))}
                        </select>

                        <input
                            type="url"
                            value={link.url}
                            onChange={(e) => change(index, "url", e.target.value)}
                            placeholder="https://..."
                            style={{ flex: 1 }}
                        />

                        <button
                            type="button"
                            className="admin-btn admin-btn--small admin-btn--danger"
                            onClick={() => removeLink(index)}
                        >
                            ✕
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    onClick={addLink}
                    style={{ marginBottom: "1.5rem" }}
                >
                    + Add Link
                </button>

                <div className="admin-form__actions">
                    <button type="submit" className="admin-btn admin-btn--primary">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminSocials;
