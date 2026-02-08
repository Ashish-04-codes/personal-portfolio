import React, { useEffect, useState } from "react";
import { fetchAbout, updateAbout, updateSkills } from "../../services/api";
import { uploadToCloudinary } from "../../services/cloudinary";
import "./Admin.scss";

/**
 * AdminAbout
 *
 * Edit about section: bio, skills, profile image, resume upload.
 */
function AdminAbout() {
  const [form, setForm] = useState({
    title: "",
    short_bio: "",
    full_bio: "",
    what_i_do: "",
    image_url: "",
    resume_url: "",
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAbout();
        setForm({
          title: data.title || "",
          short_bio: data.short_bio || "",
          full_bio: data.full_bio || "",
          what_i_do: data.what_i_do || "",
          image_url: data.image_url || "",
          resume_url: data.resume_url || "",
        });
        setSkills(data.skills || []);
      } catch (e) {
        console.error("Load error:", e);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage("Uploading image...");
    try {
      const { url } = await uploadToCloudinary(file);
      setForm({ ...form, image_url: url });
      setMessage("Image uploaded!");
    } catch (err) {
      setMessage("Upload failed: " + err.message);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage("Uploading resume...");
    try {
      const { url } = await uploadToCloudinary(file);
      setForm({ ...form, resume_url: url });
      setMessage("Resume uploaded!");
    } catch (err) {
      setMessage("Upload failed: " + err.message);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateAbout(form);
      await updateSkills(skills);
      setMessage("Saved successfully!");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
    setSaving(false);
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">About</h1>
      <p className="admin-page__subtitle">Edit your bio, skills, and profile photo</p>

      {message && <div className="admin-message">{message}</div>}

      <div className="admin-form">
        <div className="admin-form__group">
          <label>Job Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Laravel Developer" />
        </div>

        <div className="admin-form__group">
          <label>Short Bio (Who I Am)</label>
          <textarea name="short_bio" value={form.short_bio} onChange={handleChange} rows={3}
            placeholder="I'm Ashish, a passionate Laravel Developer..." />
        </div>

        <div className="admin-form__group">
          <label>Full Bio (additional detail)</label>
          <textarea name="full_bio" value={form.full_bio} onChange={handleChange} rows={3}
            placeholder="I specialize in creating scalable backend solutions..." />
        </div>

        <div className="admin-form__group">
          <label>What I Do</label>
          <textarea name="what_i_do" value={form.what_i_do} onChange={handleChange} rows={3}
            placeholder="I love turning complex problems into elegant solutions..." />
        </div>

        {/* Profile Image */}
        <div className="admin-form__group">
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {form.image_url && (
            <img src={form.image_url} alt="Profile" className="admin-preview-img" />
          )}
        </div>

        {/* Resume PDF */}
        <div className="admin-form__group">
          <label>Resume (PDF)</label>
          <input type="file" accept=".pdf" onChange={handleResumeUpload} />
          {form.resume_url && (
            <a href={form.resume_url} target="_blank" rel="noreferrer" className="admin-file-link">
              📄 View Resume
            </a>
          )}
        </div>

        {/* Skills */}
        <div className="admin-form__group">
          <label>Skills</label>
          <div className="admin-tags">
            {skills.map((skill, i) => (
              <span key={i} className="admin-tag">
                {skill}
                <button type="button" onClick={() => removeSkill(i)}>&times;</button>
              </span>
            ))}
          </div>
          <div className="admin-form__row">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..."
            />
            <button type="button" className="admin-btn admin-btn--small" onClick={addSkill}>Add</button>
          </div>
        </div>

        <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default AdminAbout;
