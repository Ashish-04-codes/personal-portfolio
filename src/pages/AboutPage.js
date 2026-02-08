import React from "react";
import PageLayout from "../components/PageLayout";
import { useData } from "../context/DataContext";
import "../styles/Pages.scss";

/**
 * AboutPage
 *
 * Uses PageLayout for consistent header, title, and next-project link.
 * Data pulled from DataContext (Firestore / fallback).
 */
function AboutPage() {
  const { data } = useData();
  const { about } = data;
  const skills = about.skills || [];

  return (
    <PageLayout title="About Me">
      <div className="page-section">
        <h2 className="section-title">Who I Am</h2>
        <p className="section-text">
          {about.short_bio}
        </p>
      </div>

      <div className="page-section">
        <h2 className="section-title">What I Do</h2>
        <p className="section-text">
          {about.what_i_do}
        </p>
      </div>

      <div className="page-section">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default AboutPage;
