import React, { useState, useEffect } from "react";
import { fetchContact, updateContact } from "../../services/api";
import "./Admin.scss";

/**
 * AdminContact
 *
 * Simple form to update contact details (email, phone, location).
 * Data stored in Firestore document `portfolio/contact`.
 */
function AdminContact() {
    const [form, setForm] = useState({ email: "", phone: "", location: "" });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchContact();
                if (data) setForm(data);
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
            await updateContact(form);
            setMessage({ type: "success", text: "Contact info updated!" });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        }
    };

    const change = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    if (loading) return <div className="admin-page"><p>Loading...</p></div>;

    return (
        <div className="admin-page">
            <h1>Contact Info</h1>

            {message.text && (
                <div className={`admin-message admin-message--${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form__group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => change("email", e.target.value)}
                        placeholder="you@example.com"
                    />
                </div>

                <div className="admin-form__group">
                    <label>Phone</label>
                    <input
                        value={form.phone}
                        onChange={(e) => change("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div className="admin-form__group">
                    <label>Location</label>
                    <input
                        value={form.location}
                        onChange={(e) => change("location", e.target.value)}
                        placeholder="Mumbai, India"
                    />
                </div>

                <div className="admin-form__actions">
                    <button type="submit" className="admin-btn admin-btn--primary">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminContact;
