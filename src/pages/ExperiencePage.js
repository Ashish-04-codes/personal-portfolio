import React from "react";
import PageLayout from "../components/PageLayout";
import { useData } from "../context/DataContext";
import "../styles/Pages.scss";

/**
 * ExperiencePage
 *
 * Uses PageLayout for consistent structure.
 * Data pulled from DataContext (Firestore / fallback).
 */
function ExperiencePage() {
  const { data } = useData();
  const experiences = data.experience || [];

  return (
    <PageLayout title="Experience">
      {experiences.map((exp) => (
        <div key={exp.id} className="experience-item">
          <div className="experience-header">
            <span className="experience-company">{exp.company}</span>
            <span className="experience-duration">{exp.period}</span>
          </div>
          <div className="experience-role">{exp.role}</div>
          <p className="experience-description">{exp.description}</p>
        </div>
      ))}
    </PageLayout>
  );
}

export default ExperiencePage;
