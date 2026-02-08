import React, { useEffect, useState } from "react";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/api";
import { uploadToCloudinary } from "../../services/cloudinary";
import "./Admin.scss";

function AdminProjects() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const emptyItem = {
    name: "",
    description: "",
    tech_stack: [],
    image_url: "",
    live_url: "",
    github_url: "",
    sort_order: 0,
  };

  const load = async () => {
    try {
      const data = await fetchProjects();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (item) => {
    setEditing({ ...item, tech_stack: item.tech_stack || [] });
    setTechInput("");
    setMessage("");
  };

  const handleNew = () => {
    setEditing({ ...emptyItem, sort_order: items.length + 1, tech_stack: [] });
    setTechInput("");
    setMessage("");
  };

  const handleCancel = () => {
    setEditing(null);
    setMessage("");
  };

  const handleChange = (e) => {
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage("Uploading image...");
    try {
      const { url } = await uploadToCloudinary(file);
      setEditing({ ...editing, image_url: url });
      setMessage("Image uploaded!");
    } catch (err) {
      setMessage("Upload failed: " + err.message);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !editing.tech_stack.includes(techInput.trim())) {
      setEditing({
        ...editing,
        tech_stack: [...editing.tech_stack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (index) => {
    setEditing({
      ...editing,
      tech_stack: editing.tech_stack.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      if (editing.id) {
        await updateProject(editing.id, editing);
      } else {
        await createProject(editing);
      }
      await load();
      setEditing(null);
      setMessage("Saved successfully!");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      await load();
      setMessage("Deleted.");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  // LIST VIEW
  if (!editing) {
    return (
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Projects</h1>
            <p className="admin-page__subtitle">Manage your portfolio projects</p>
          </div>
          <button className="admin-btn admin-btn--primary" onClick={handleNew}>
            + Add Project
          </button>
        </div>

        {message && <div className="admin-message">{message}</div>}

        <div className="admin-list">
          {items.length === 0 && (
            <div className="admin-empty">No projects yet. Add your first one!</div>
          )}
          {items.map((item) => {
            const techs = item.tech_stack || [];
            return (
              <div key={item.id} className="admin-card admin-card--project">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="admin-card__thumb"
                  />
                )}
                <div className="admin-card__body">
                  <h3>{item.name}</h3>
                  <p className="admin-card__desc">{item.description}</p>
                  <div className="admin-tags admin-tags--inline">
                    {techs.map((t, i) => (
                      <span key={i} className="admin-tag admin-tag--readonly">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="admin-card__actions">
                  <button className="admin-btn admin-btn--small" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // EDIT / CREATE VIEW
  return (
    <div className="admin-page">
      <h1 className="admin-page__title">
        {editing.id ? "Edit Project" : "New Project"}
      </h1>

      {message && <div className="admin-message">{message}</div>}

      <div className="admin-form">
        <div className="admin-form__group">
          <label>Project Name</label>
          <input name="name" value={editing.name} onChange={handleChange} placeholder="My Awesome Project" />
        </div>

        <div className="admin-form__group">
          <label>Description</label>
          <textarea name="description" value={editing.description} onChange={handleChange} rows={4}
            placeholder="A brief description of the project..." />
        </div>

        {/* Tech Stack */}
        <div className="admin-form__group">
          <label>Tech Stack</label>
          <div className="admin-tags">
            {editing.tech_stack.map((tech, i) => (
              <span key={i} className="admin-tag">
                {tech}
                <button type="button" onClick={() => removeTech(i)}>&times;</button>
              </span>
            ))}
          </div>
          <div className="admin-form__row">
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
              placeholder="React, Laravel, MySQL..."
            />
            <button type="button" className="admin-btn admin-btn--small" onClick={addTech}>Add</button>
          </div>
        </div>

        {/* Image */}
        <div className="admin-form__group">
          <label>Project Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {editing.image_url && (
            <img src={editing.image_url} alt="Preview" className="admin-preview-img" />
          )}
        </div>

        <div className="admin-form__group">
          <label>Live URL</label>
          <input name="live_url" value={editing.live_url} onChange={handleChange} placeholder="https://myproject.com" />
        </div>

        <div className="admin-form__group">
          <label>GitHub URL</label>
          <input name="github_url" value={editing.github_url} onChange={handleChange} placeholder="https://github.com/user/repo" />
        </div>

        <div className="admin-form__group">
          <label>Sort Order</label>
          <input name="sort_order" type="number" value={editing.sort_order} onChange={handleChange} />
        </div>

        <div className="admin-form__actions">
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="admin-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AdminProjects;
