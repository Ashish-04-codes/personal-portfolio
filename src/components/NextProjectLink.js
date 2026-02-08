import React from "react";
import { useLocation } from "react-router-dom";
import { useTransition } from "../context/TransitionContext";
import navigation from "../data/navigation.json";
import "../styles/PageLayout.scss";

/**
 * NextProjectLink
 *
 * Renders at the bottom of each sub-page.
 * Shows the next page name in large outlined text (same style as milestones).
 * Loops: last item → first item.
 *
 * Uses TransitionContext for the same transition flow as Milestone clicks.
 */
function NextProjectLink() {
    const location = useLocation();
    const { navigateTo } = useTransition();

    /* Find current page index in navigation */
    const currentIndex = navigation.findIndex(
        (item) => item.path === location.pathname
    );

    /* Determine next page (loop around) */
    const nextIndex = (currentIndex + 1) % navigation.length;
    const nextPage = navigation[nextIndex];

    if (!nextPage) return null;

    const handleClick = () => {
        navigateTo(nextPage.path);
    };

    return (
        <div className="next-project" onClick={handleClick} role="link" tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className="next-project__label">Next</div>
            <div className="next-project__name">{nextPage.name}</div>
            <div className="next-project__arrow">&#8594;</div>
        </div>
    );
}

export default NextProjectLink;
