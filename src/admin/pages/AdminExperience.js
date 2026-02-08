import React, { useState, useEffect } from "react";
import {
    fetchExperience,
    createExperience,
    updateExperience,
    deleteExperience,
} from "../../services/api";
import "./Admin.scss";

/**
 * AdminExperience
 *
 * CRUD interface for experience / timeline entries.
 * Data stored in Firestore `experience` collection.
 */
function AdminExperience() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // null = list view, object = form
    const [message, setMessage] = useState({ type: "", text: "" });

    const blank = {
        company: "",
        role: "",
        period: "",
        description: "",
        type: "work", // work | education
    };

    /* ───── Load ───── */
    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            const data = await fetchExperience();
            setEntries(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    /* ───── Save ───── */
    const handleSave = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        try {
            if (editing.id) {
                await updateExperience(editing.id, editing);
                setMessage({ type: "success", text: "Entry updated!" });
            } else {
                await createExperience(editing);
                setMessage({ type: "success", text: "Entry created!" });
            }
            setEditing(null);
            setLoading(true);
            await loadEntries();
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        }
    };

    /* ───── Delete ───── */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
            await deleteExperience(id);
            setMessage({ type: "success", text: "Entry deleted." });
            setLoading(true);
            await loadEntries();
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        }
    };

    /* ───── Field change ───── */
    const change = (field, value) =>
        setEditing((prev) => ({ ...prev, [field]: value }));

    /* ───── Render ───── */
    if (loading) return <div className="admin-page"><p>Loading...</p></div>;

    // ─── Form View ───
    if (editing) {
        return (
            <div className="admin-page">
                <h1>{editing.id ? "Edit" : "New"} Experience</h1>

                {message.text && (
                    <div className={`admin-message admin-message--${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className="admin-form">
                    <div className="admin-form__group">
                        <label>Company / Institution</label>
                        <input
                            value={editing.company}
                            onChange={(e) => change("company", e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-form__group">
                        <label>Role / Degree</label>
                        <input
                            value={editing.role}
                            onChange={(e) => change("role", e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-form__group">
                        <label>Period (e.g. Jan 2023 – Present)</label>
                        <input
                            value={editing.period}
                            onChange={(e) => change("period", e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-form__group">
                        <label>Type</label>
                        <select
                            className="admin-select"
                            value={editing.type}
                            onChange={(e) => change("type", e.target.value)}
                        >
                            <option value="work">Work</option>
                            <option value="education">Education</option>
                        </select>
                    </div>

                    <div className="admin-form__group">
                        <label>Description</label>
                        <textarea
                            rows={4}
                            value={editing.description}
                            onChange={(e) => change("description", e.target.value)}
                        />
                    </div>

                    <div className="admin-form__actions">
                        <button type="submit" className="admin-btn admin-btn--primary">
                            Save
                        </button>
                        <button
                            type="button"
                            className="admin-btn"
                            onClick={() => setEditing(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // ─── List View ───
    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h1>Experience</h1>
                <button
                    className="admin-btn admin-btn--primary"
                    onClick={() => setEditing({ ...blank })}
                >
                    + Add Entry
                </button>
            </div>

            {message.text && (
                <div className={`admin-message admin-message--${message.type}`}>
                    {message.text}
                </div>
            )}

            {entries.length === 0 ? (
                <p className="admin-empty">No experience entries yet.</p>
            ) : (
                <div className="admin-list">
                    {entries.map((entry) => (
                        <div key={entry.id} className="admin-card">
                            <div className="admin-card__body">
                                <h3>{entry.role}</h3>
                                <p>
                                    {entry.company} &middot; {entry.period}
                                </p>
                                {entry.description && (
                                    <p className="admin-card__desc">
                                        {entry.description}
                                    </p>
                                )}
                            </div>
                            <div className="admin-card__actions">
                                <button
                                    className="admin-btn admin-btn--small"
                                    onClick={() => setEditing({ ...entry })}
                                >
                                    Edit
                                </button>
                                <button
                                    className="admin-btn admin-btn--small admin-btn--danger"
                                    onClick={() => handleDelete(entry.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminExperience;
