import React, { createContext, useContext, useState, useEffect } from "react";
import {
    fetchAbout,
    fetchExperience,
    fetchProjects,
    fetchContact,
    fetchSocials,
    fetchSettings,
} from "../services/api";

/**
 * DataContext
 *
 * Fetches all portfolio data from Firestore on mount.
 * Provides data + loading state + refresh function to all components.
 * Falls back to hardcoded defaults if Firestore is unreachable.
 */

const DataContext = createContext();

/* ========================
   FALLBACK DATA
   Used when Firestore is not configured or unreachable
======================== */
const FALLBACK = {
    about: {
        title: "Laravel Developer",
        short_bio:
            "I'm Ashish, a passionate Laravel Developer based in Gujarat, India with 3 years of experience building robust web applications.",
        full_bio:
            "I specialize in creating scalable backend solutions and RESTful APIs that power modern web experiences.",
        what_i_do:
            "I love turning complex problems into elegant, efficient solutions. From database design to API development, I focus on writing clean, maintainable code that delivers real value to users and businesses.",
        skills: ["Laravel", "PHP", "MySQL", "JavaScript", "React", "REST APIs", "Git", "HTML/CSS", "Vue.js", "Redis"],
        image_url: null,
        resume_url: null,
    },
    experience: [
        {
            id: "1",
            company: "Your Company",
            role: "Laravel Developer",
            period: "2022 - Present",
            description: "Add your real experience from the admin panel.",
        },
    ],
    projects: [
        {
            id: "1",
            name: "Your Project",
            description: "Add your real projects from the admin panel.",
            tech_stack: ["Laravel", "React"],
            image_url: null,
            live_url: null,
            github_url: null,
        },
    ],
    contact: {
        email: "ashishvala2004@gmail.com",
        phone: "",
        location: "Gujarat, India",
    },
    socials: [
        { platform: "resume", url: "/resume.pdf" },
        { platform: "linkedin", url: "https://www.linkedin.com/in/ashish-vala/" },
        { platform: "github", url: "https://github.com/ashishvala" },
        { platform: "instagram", url: "https://instagram.com/" },
    ],
    settings: {
        site_title: "Ashish Vala | Laravel Developer",
        hero_name: "Ashish",
        job_title: "Laravel Developer",
        years_of_experience: "3",
        current_location: "Gujarat, INDIA",
        pages: [
            { id: "about", name: "About Me", path: "/about", visible: true, sort_order: 1 },
            { id: "experience", name: "Experience", path: "/experience", visible: true, sort_order: 2 },
            { id: "projects", name: "Projects", path: "/projects", visible: true, sort_order: 3 },
            { id: "contact", name: "Contact Me", path: "/contact", visible: true, sort_order: 4 },
        ],
    },
};

export function DataProvider({ children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [about, experience, projects, contact, socials, settings] =
                await Promise.all([
                    fetchAbout().catch(() => null),
                    fetchExperience().catch(() => null),
                    fetchProjects().catch(() => null),
                    fetchContact().catch(() => null),
                    fetchSocials().catch(() => null),
                    fetchSettings().catch(() => null),
                ]);

            setData({
                about: about || FALLBACK.about,
                experience: experience?.length ? experience : FALLBACK.experience,
                projects: projects?.length ? projects : FALLBACK.projects,
                contact: contact?.email ? contact : FALLBACK.contact,
                socials: socials?.length ? socials : FALLBACK.socials,
                settings: settings?.site_title ? settings : FALLBACK.settings,
            });
        } catch (error) {
            console.warn("Firestore unavailable, using fallback data:", error.message);
            setData(FALLBACK);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Dynamically set browser tab title & favicon when data is ready
    useEffect(() => {
        if (!data) return;

        // Set document title
        const title = data.settings?.site_title;
        if (title) document.title = title;

        // Set theme color (CSS variable)
        const themeColor = data.settings?.theme_color;
        if (themeColor) {
            document.documentElement.style.setProperty("--primary-color", themeColor);
            // Also update meta theme-color for mobile browsers
            let metaTheme = document.querySelector("meta[name='theme-color']");
            if (metaTheme) metaTheme.content = themeColor;
        }

        // Set favicon
        const faviconUrl = data.settings?.favicon_url;
        if (faviconUrl) {
            let link = document.querySelector("link[rel='icon']");
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            link.href = faviconUrl;

            // Also update apple-touch-icon
            let appleLink = document.querySelector("link[rel='apple-touch-icon']");
            if (appleLink) appleLink.href = faviconUrl;
        }
    }, [data]);

    // Show loading screen until real data is fetched
    if (loading || !data) {
        return (
            <div style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "var(--primary-color, #4801ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 99999,
            }}>
                <div style={{
                    color: "#fff",
                    fontFamily: '"Druk Wide Web Bold", "Poppins", sans-serif',
                    fontSize: "1.5rem",
                    letterSpacing: "2px",
                    animation: "pulse 1.5s ease-in-out infinite",
                }}>
                    LOADING
                </div>
                <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
            </div>
        );
    }

    return (
        <DataContext.Provider value={{ data, loading, refreshData: loadData }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
