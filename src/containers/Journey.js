import React, { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import Milestone from "../components/Milestone";
import "../styles/Journey.scss";

/**
 * Default navigation — used when settings.pages is not available.
 */
const DEFAULT_NAV = [
    { id: "about", name: "About Me", path: "/about", visible: true, sort_order: 1 },
    { id: "experience", name: "Experience", path: "/experience", visible: true, sort_order: 2 },
    { id: "projects", name: "Projects", path: "/projects", visible: true, sort_order: 3 },
    { id: "contact", name: "Contact Me", path: "/contact", visible: true, sort_order: 4 },
];

function Journey() {
  const { data, loading } = useData();
  const [isJourneyMounted, setIsJourneyMounted] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Get pages from settings, filter visible ones and sort
  const pages = (data.settings?.pages || DEFAULT_NAV)
      .filter((p) => p.visible)
      .sort((a, b) => a.sort_order - b.sort_order);

  // Stable key from page IDs + order — resets animation when order changes
  const pagesKey = pages.map((p) => p.id).join("-");

  useEffect(() => {
    // Don't start animation until data has loaded from Firestore
    if (loading) return;

    // Reset states first
    setIsJourneyMounted(false);
    setIsAnimationComplete(false);

    // Double rAF: ensures browser paints the reset (items at -1500px)
    // before we trigger the entry transition
    let raf;
    const startAnimation = () => {
      raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsJourneyMounted(true);
        });
      });
    };
    startAnimation();

    // Mark animation complete after all items have finished
    const longestDelay = pages.length * 0.2;
    const animationTimer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 1500 + longestDelay * 1000 + 150);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(animationTimer);
    };
  }, [loading, pagesKey, pages.length]);

  return (
    <div
      className={`journey ${isJourneyMounted ? "is-journey-mounted" : ""} ${
        isAnimationComplete ? "animation-complete" : ""
      }`}
    >
      {pages.map((item, index) => (
        <Milestone
          key={item.id}
          name={item.name}
          path={item.path}
          index={index}
          totalPages={pages.length}
          animationComplete={isAnimationComplete}
        />
      ))}
    </div>
  );
}

export default Journey;