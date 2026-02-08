import React from "react";
import PageLayout from "../components/PageLayout";
import { useData } from "../context/DataContext";
import "../styles/Pages.scss";

/**
 * ProjectsPage
 *
 * Uses PageLayout for consistent structure.
 * Data pulled from DataContext (Firestore / fallback).
 */
function ProjectsPage() {
  const { data } = useData();
  const projects = data.projects || [];

  return (
    <PageLayout title="Projects">
      <div className="project-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3 className="project-title">{project.name || project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {(project.tech_stack || project.tech || []).map((tech, i) => (
                <span key={i} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
            <div className="project-links">
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className="project-link">
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="project-link">
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export default ProjectsPage;
