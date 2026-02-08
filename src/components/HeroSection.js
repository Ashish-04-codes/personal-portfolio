import React from "react";
import "../styles/PageLayout.scss";

/**
 * HeroSection
 *
 * Gradient background section at the top of each sub-page.
 * Accepts a gradient prop for per-page color variation.
 * Parallax-ready via ref callback from useParallax.
 *
 * @param {string} gradient - CSS gradient string
 * @param {function} parallaxRef - ref callback from useParallax(0.5)
 * @param {React.ReactNode} children - optional hero content
 */
function HeroSection({ gradient, parallaxRef, children }) {
  return (
    <div
      className="hero-section"
      ref={parallaxRef}
      style={{ background: gradient }}
    >
      <div className="hero-section__content">
        {children}
      </div>
    </div>
  );
}

export default HeroSection;
