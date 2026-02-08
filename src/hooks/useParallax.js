import { useRef, useEffect, useCallback } from "react";

/**
 * useParallax
 *
 * Custom hook for performant scroll-based parallax.
 * Uses direct DOM manipulation via refs to bypass React's
 * reconciliation — critical for 60fps scroll performance.
 *
 * Strategy:
 * - Listens to scroll events with passive: true
 * - Throttles updates via requestAnimationFrame
 * - Applies transform: translate3d() for GPU compositing
 * - No React state → no re-renders
 *
 * Usage:
 *   const { registerParallax } = useParallax();
 *   <div ref={registerParallax(0.3)}>Slow parallax</div>
 *   <div ref={registerParallax(0.5)}>Medium parallax</div>
 */
export function useParallax() {
    /* Store all registered elements with their speed multipliers */
    const elementsRef = useRef([]);
    /* RAF handle for cleanup */
    const rafRef = useRef(null);
    /* Track if scroll listener is attached */
    const isAttachedRef = useRef(false);

    /**
     * Core update function — called on each animation frame during scroll.
     * Reads scrollY once, then batch-writes transforms to all elements.
     */
    const updateElements = useCallback(() => {
        const scrollY = window.scrollY;

        elementsRef.current.forEach(({ element, speed }) => {
            if (element) {
                const offset = scrollY * (1 - speed);
                element.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        });

        rafRef.current = null;
    }, []);

    /**
     * Scroll handler — requests animation frame if one isn't pending.
     * This naturally throttles to ~60fps.
     */
    const handleScroll = useCallback(() => {
        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(updateElements);
        }
    }, [updateElements]);

    /* Attach/detach scroll listener */
    useEffect(() => {
        if (!isAttachedRef.current) {
            window.addEventListener("scroll", handleScroll, { passive: true });
            isAttachedRef.current = true;
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            isAttachedRef.current = false;
        };
    }, [handleScroll]);

    /**
     * registerParallax(speed)
     *
     * Returns a ref callback. Attach to any DOM element to
     * enable parallax at the given speed.
     *
     * @param {number} speed - 0 = fixed, 1 = normal scroll.
     *   0.3 = scrolls at 30% speed (slow drift)
     *   0.5 = scrolls at 50% speed (medium parallax)
     */
    const registerParallax = useCallback((speed) => {
        return (element) => {
            if (element) {
                /* Add will-change for GPU layer promotion */
                element.style.willChange = "transform";

                /* Check if already registered */
                const existing = elementsRef.current.find((e) => e.element === element);
                if (!existing) {
                    elementsRef.current.push({ element, speed });
                }
            }
        };
    }, []);

    return { registerParallax };
}

export default useParallax;
