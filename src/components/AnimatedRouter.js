import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useData } from "../context/DataContext";
import Home from "../containers/Home";
import AboutPage from "../pages/AboutPage";
import ExperiencePage from "../pages/ExperiencePage";
import ProjectsPage from "../pages/ProjectsPage";
import ContactPage from "../pages/ContactPage";

/**
 * Map of built-in page IDs to their React components.
 * Only pages present in settings.pages AND visible will be rendered.
 */
const PAGE_COMPONENTS = {
    about: AboutPage,
    experience: ExperiencePage,
    projects: ProjectsPage,
    contact: ContactPage,
};

/**
 * AnimatedRouter
 *
 * Wraps React Router with Framer Motion's AnimatePresence
 * to enable exit animations before route unmount.
 *
 * mode="wait" — waits for exit animation to complete before
 * mounting the entering page.
 *
 * Animation strategy:
 * - Home page exits by sliding to the RIGHT
 * - Sub-pages enter by sliding UP from the bottom
 * - Sub-pages exit by sliding DOWN (when going back home)
 * - Sub-page → Sub-page: current slides down, new slides up
 */

/* ========================
   ANIMATION VARIANTS
======================== */
const homeVariants = {
    initial: { x: 0, opacity: 1 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
        x: "100vw",
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
};

const pageVariants = {
    initial: {
        y: "100vh",
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
        y: "100vh",
        opacity: 0,
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
    },
};

/* ========================
   WRAPPER COMPONENTS
======================== */

/**
 * HomeWrapper — applies home-specific exit animation (slide right)
 */
function HomeWrapper({ children }) {
    return (
        <motion.div
            className="page-transition-wrapper"
            variants={homeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: "absolute", inset: 0 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * PageWrapper — applies sub-page enter/exit animation (slide up/down)
 */
function PageWrapper({ children }) {
    return (
        <motion.div
            className="page-transition-wrapper"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: "absolute", inset: 0 }}
        >
            {children}
        </motion.div>
    );
}

/* ========================
   ANIMATED ROUTER
======================== */
function AnimatedRouter() {
    const location = useLocation();
    const { data } = useData();

    // Get visible pages from settings
    const visiblePages = (data.settings?.pages || [])
        .filter((p) => p.visible && PAGE_COMPONENTS[p.id])
        .sort((a, b) => a.sort_order - b.sort_order);

    return (
        <div className="router-container" style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <HomeWrapper>
                                <Home />
                            </HomeWrapper>
                        }
                    />
                    {visiblePages.map((page) => {
                        const Component = PAGE_COMPONENTS[page.id];
                        return (
                            <Route
                                key={page.id}
                                path={page.path}
                                element={
                                    <PageWrapper>
                                        <Component />
                                    </PageWrapper>
                                }
                            />
                        );
                    })}
                </Routes>
            </AnimatePresence>
        </div>
    );
}

export default AnimatedRouter;
