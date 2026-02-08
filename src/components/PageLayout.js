import React, { useRef, useEffect, useCallback } from "react";
import NextProjectLink from "./NextProjectLink";
import useParallax from "../hooks/useParallax";
import "../styles/PageLayout.scss";

/**
 * PageLayout
 *
 * Shared wrapper for all sub-pages. Provides:
 * - Large outlined title (top-right, each word stacked vertically, right-aligned)
 * - Content area on the left, directly below navbar
 * - NextProjectLink at bottom
 *
 * Multi-word titles stack vertically (right-aligned), creating a
 * staircase effect where shorter words appear naturally indented.
 * Each word auto-scales via CSS transform so it never overflows.
 *
 * @param {string} title - Page title (displayed outlined, top-right)
 * @param {React.ReactNode} children - Page content
 */
function PageLayout({ title, children }) {
    const { registerParallax } = useParallax();
    const wrapperRef = useRef(null);

    /* Split title into individual words for vertical stacking */
    const titleWords = title.split(" ");

    /**
     * Auto-fit: measures each word's actual rendered width via
     * getBoundingClientRect (works with any font, 100% reliable).
     * If a word is wider than the container, applies scaleX()
     * to shrink it visually — no layout shift, no clipping.
     */
    const fitWords = useCallback(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const containerWidth = wrapper.getBoundingClientRect().width;
        const words = wrapper.querySelectorAll(".page-layout__title-word");

        words.forEach((el) => {
            /* Reset previous transform to measure natural width */
            el.style.transform = "none";

            /* getBoundingClientRect gives the TRUE rendered width,
               including font metrics and letter-spacing */
            const textWidth = el.getBoundingClientRect().width;

            if (textWidth > containerWidth && containerWidth > 0) {
                el.style.transform = `scaleX(${containerWidth / textWidth})`;
            } else {
                el.style.transform = "";
            }
        });
    }, []);

    useEffect(() => {
        /* Delay initial fit to ensure webfonts are loaded */
        const timer = setTimeout(fitWords, 100);
        fitWords();

        const observer = new ResizeObserver(fitWords);
        if (wrapperRef.current) {
            observer.observe(wrapperRef.current);
        }

        /* Also refit when fonts finish loading */
        document.fonts?.ready?.then(fitWords);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [title, fitWords]);

    return (
        <div className="page-layout">
            {/* Large outlined title — each word stacked, right-aligned, parallax at 30% */}
            <div
                className="page-layout__title-wrapper"
                ref={registerParallax(0.3)}
            >
                <div className="page-layout__title" ref={wrapperRef}>
                    {titleWords.map((word, i) => (
                        <span key={i} className="page-layout__title-word">
                            {word}
                        </span>
                    ))}
                </div>
            </div>

            {/* Main content area — starts directly below navbar */}
            <div className="page-layout__content">
                {children}
            </div>

            {/* Next project link at bottom */}
            <NextProjectLink />
        </div>
    );
}

export default PageLayout;
