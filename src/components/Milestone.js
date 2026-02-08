import React from "react";
import { useTransition } from "../context/TransitionContext";
import "../styles/Journey.scss";

/**
 * Milestone
 *
 * Navigation item on the home page Journey section.
 * Uses TransitionContext.navigateTo() instead of <Link>
 * to trigger the 300ms click pause before route change.
 *
 * All 3D perspective hover effects remain pure CSS.
 */
function Milestone({ name, path, index, totalPages, animationComplete }) {
  const { navigateTo, isTransitioning } = useTransition();

  const handleClick = () => {
    navigateTo(path);
  };

  // Dynamic waterfall delay — last item drops first, first item drops last
  // e.g. 4 items → delays: 0.8s, 0.6s, 0.4s, 0.2s
  const entryDelay = ((totalPages || 4) - index) * 0.2;

  // Full transition set inline to avoid CSS shorthand vs longhand conflicts
  const style = animationComplete
    ? { transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }
    : { transition: `transform 1.5s cubic-bezier(0.075, 0.82, 0.165, 1) ${entryDelay}s` };

  return (
    <div
      className={`milestone milestone-link ${isTransitioning ? "milestone--clicked" : ""}`}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      style={style}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div></div>
      <div>/</div>
      <div>{name}</div>
    </div>
  );
}

export default Milestone;
