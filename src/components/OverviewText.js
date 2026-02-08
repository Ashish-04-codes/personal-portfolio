import React from "react";
import { useData } from "../context/DataContext";
import "../styles/Overview.scss";

/**
 * OverviewText
 *
 * Displays job title, experience, location, and email
 * on the home page. Data from DataContext (Firestore / fallback).
 */
function OverviewText() {
  const { data } = useData();
  const { settings, contact } = data;

  const openEmail = () => {
    if (contact.email) window.open(`mailto:${contact.email}`);
  };

  return (
    <div className="overview-text">
      <div className="overview-details">
        <div>
          <div>{settings?.job_title || "Laravel Developer"}</div>
          <div>{settings?.years_of_experience ? `${settings.years_of_experience} Years Experience` : "3 Years Experience"}</div>
        </div>
        <div className="overview-location">
          <div>{settings?.current_location || contact.location || "Gujarat, INDIA"}</div>
          <button className="overview-location-email" onClick={openEmail}>
            <strong>{contact.email || "ashishvala2004@gmail.com"}</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OverviewText;
