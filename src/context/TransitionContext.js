import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * TransitionContext
 * 
 * Centralizes page transition state so SharedHeader, Milestone,
 * and page components can coordinate the click-pause → animate-out
 * → route-change → animate-in sequence.
 * 
 * Framer Motion's AnimatePresence handles the actual animation timing;
 * this context manages the 300ms click pause and home/page awareness.
 */

const TransitionContext = createContext(null);

/* ========================
   CONSTANTS
======================== */
const CLICK_PAUSE_MS = 300;

/* ========================
   PROVIDER
======================== */
export function TransitionProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    /* Is the user currently on the home page? */
    const isHome = location.pathname === "/";

    /* Tracks whether a transition is in-flight (prevents double-clicks) */
    const [isTransitioning, setIsTransitioning] = useState(false);

    /* Ref for the pause timer — avoids stale closure issues */
    const pauseTimerRef = useRef(null);

    /**
     * navigateTo(path)
     * 
     * Called by Milestone clicks and NextProjectLink.
     * 1. Sets transitioning flag (triggers click visual feedback)
     * 2. Waits 300ms (click emphasis pause)
     * 3. Performs actual React Router navigation
     * 4. Framer AnimatePresence picks up the route change
     *    and handles exit/enter animations automatically
     */
    const navigateTo = useCallback(
        (path) => {
            /* Guard: prevent double-navigation during transition */
            if (isTransitioning) return;
            /* Guard: don't navigate to the current page */
            if (location.pathname === path) return;

            setIsTransitioning(true);

            /* Clear any lingering timer */
            if (pauseTimerRef.current) {
                clearTimeout(pauseTimerRef.current);
            }

            /* 300ms click pause for visual emphasis */
            pauseTimerRef.current = setTimeout(() => {
                navigate(path);
                /* Reset transitioning flag after navigation triggers.
                   The exit animation is handled by AnimatePresence,
                   so we don't need to wait for it here. */
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100);
            }, CLICK_PAUSE_MS);
        },
        [isTransitioning, location.pathname, navigate]
    );

    const value = {
        isHome,
        isTransitioning,
        navigateTo,
        currentPath: location.pathname,
    };

    return (
        <TransitionContext.Provider value={value}>
            {children}
        </TransitionContext.Provider>
    );
}

/* ========================
   HOOK
======================== */
export function useTransition() {
    const context = useContext(TransitionContext);
    if (!context) {
        throw new Error("useTransition must be used within a TransitionProvider");
    }
    return context;
}

export default TransitionContext;
