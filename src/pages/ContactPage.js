import React from "react";
import PageLayout from "../components/PageLayout";
import { useData } from "../context/DataContext";
import "../styles/Pages.scss";

/**
 * ContactPage
 *
 * Uses PageLayout for consistent structure.
 * Data pulled from DataContext (Firestore / fallback).
 */
function ContactPage() {
  const { data } = useData();
  const { contact, socials } = data;
  const linkedin = socials.find((s) => s.platform === "linkedin");

  return (
    <PageLayout title="Contact Me">
      <div className="page-section">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-text">
          I'm always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision. Feel free to reach out!
        </p>
      </div>

      <div className="page-section">
        <div className="contact-info">
          {contact.email && (
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>
          )}
          {linkedin && (
            <div className="contact-item">
              <span className="contact-label">LinkedIn</span>
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkedin.url.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}
          {contact.location && (
            <div className="contact-item">
              <span className="contact-label">Location</span>
              <span>{contact.location}</span>
            </div>
          )}
          {contact.phone && (
            <div className="contact-item">
              <span className="contact-label">Phone</span>
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default ContactPage;
