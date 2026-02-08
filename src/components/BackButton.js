import React from "react";
import { useTransition } from "../context/TransitionContext";
import "../styles/BackButton.scss";

/**
 * BackButton
 *
 * Icon-only back button with an animated circular SVG border.
 * On hover, the SVG circle border draws itself (stroke-dashoffset animation).
 * On click, triggers the reverse transition (page slides down, home slides in).
 *
 * Pure CSS animation — no Framer Motion needed for this.
 */

/* Circle geometry constants */
const CIRCLE_RADIUS = 24;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

function BackButton() {
    const { navigateTo } = useTransition();

    const handleBack = () => {
        navigateTo("/");
    };

    return (
        <button
            className="back-btn"
            onClick={handleBack}
            type="button"
            aria-label="Go back to home"
        >
            {/* Animated circle border */}
            <svg
                className="back-btn__circle"
                viewBox="0 0 56 56"
                width="56"
                height="56"
            >
                {/* Background circle (subtle) */}
                <circle
                    className="back-btn__circle-bg"
                    cx="28"
                    cy="28"
                    r={CIRCLE_RADIUS}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                />
                {/* Animated circle (draws on hover) */}
                <circle
                    className="back-btn__circle-fg"
                    cx="28"
                    cy="28"
                    r={CIRCLE_RADIUS}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray={CIRCLE_CIRCUMFERENCE}
                    strokeDashoffset={CIRCLE_CIRCUMFERENCE}
                    strokeLinecap="round"
                    transform="rotate(-90 28 28)"
                />
            </svg>

            {/* Arrow icon */}
            <span className="back-btn__icon">&#8592;</span>
        </button>
    );
}

export default BackButton;
