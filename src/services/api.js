import { db } from "../firebase";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from "firebase/firestore";

/**
 * Firebase API Service
 *
 * Replaces the Express/MySQL backend with direct Firestore + Storage calls.
 * Works on static hosting (GitHub Pages) — no server needed.
 *
 * Firestore structure:
 *   portfolio/about        — single doc (bio, title, skills, image_url, resume_url)
 *   portfolio/contact      — single doc (email, phone, location)
 *   portfolio/settings     — single doc (site_title, hero_name, etc.)
 *   experience/{id}        — collection of experience entries
 *   projects/{id}          — collection of project entries
 *   socials/{id}           — collection of social links
 */

// ─── Helper: no-op for setAuthToken (kept for compatibility) ───
export function setAuthToken() {}

// ═══════════════════════════════════════════
//  PUBLIC — FETCH
// ═══════════════════════════════════════════

export async function fetchAbout() {
    const snap = await getDoc(doc(db, "portfolio", "about"));
    return snap.exists() ? snap.data() : null;
}

export async function fetchExperience() {
    try {
        const q = query(collection(db, "experience"), orderBy("sort_order", "asc"));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
        // Fallback: no index or sort_order field
        const snap = await getDocs(collection(db, "experience"));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
}

export async function fetchProjects() {
    try {
        const q = query(collection(db, "projects"), orderBy("sort_order", "asc"));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
        const snap = await getDocs(collection(db, "projects"));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
}

export async function fetchContact() {
    const snap = await getDoc(doc(db, "portfolio", "contact"));
    return snap.exists() ? snap.data() : null;
}

export async function fetchSocials() {
    try {
        const q = query(collection(db, "socials"), orderBy("sort_order", "asc"));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
        const snap = await getDocs(collection(db, "socials"));
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
}

export async function fetchSettings() {
    const snap = await getDoc(doc(db, "portfolio", "settings"));
    return snap.exists() ? snap.data() : null;
}

// ═══════════════════════════════════════════
//  ADMIN — ABOUT
// ═══════════════════════════════════════════

export async function updateAbout(aboutData) {
    await setDoc(doc(db, "portfolio", "about"), aboutData, { merge: true });
    return { success: true };
}

export async function updateSkills(skills) {
    await setDoc(doc(db, "portfolio", "about"), { skills }, { merge: true });
    return { success: true };
}

// ═══════════════════════════════════════════
//  ADMIN — EXPERIENCE
// ═══════════════════════════════════════════

export async function createExperience(data) {
    const docRef = await addDoc(collection(db, "experience"), {
        ...data,
        sort_order: data.sort_order || 0,
        created_at: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
}

export async function updateExperience(id, data) {
    await updateDoc(doc(db, "experience", id), data);
    return { id, ...data };
}

export async function deleteExperience(id) {
    await deleteDoc(doc(db, "experience", id));
    return { success: true };
}

// ═══════════════════════════════════════════
//  ADMIN — PROJECTS
// ═══════════════════════════════════════════

export async function createProject(data) {
    const docRef = await addDoc(collection(db, "projects"), {
        ...data,
        sort_order: data.sort_order || 0,
        created_at: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
}

export async function updateProject(id, data) {
    await updateDoc(doc(db, "projects", id), data);
    return { id, ...data };
}

export async function deleteProject(id) {
    await deleteDoc(doc(db, "projects", id));
    return { success: true };
}

// ═══════════════════════════════════════════
//  ADMIN — CONTACT
// ═══════════════════════════════════════════

export async function updateContact(contactData) {
    await setDoc(doc(db, "portfolio", "contact"), contactData, { merge: true });
    return { success: true };
}

// ═══════════════════════════════════════════
//  ADMIN — SOCIALS
// ═══════════════════════════════════════════

export async function updateSocials(socialsArray) {
    // Delete all existing, then re-create
    const existing = await getDocs(collection(db, "socials"));
    const deletePromises = existing.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    // Add new ones
    const addPromises = socialsArray.map((social, i) =>
        addDoc(collection(db, "socials"), {
            platform: social.platform,
            url: social.url,
            sort_order: social.sort_order || i + 1,
        })
    );
    await Promise.all(addPromises);
    return { success: true };
}

// ═══════════════════════════════════════════
//  ADMIN — SETTINGS
// ═══════════════════════════════════════════

export async function updateSettings(settingsData) {
    await setDoc(doc(db, "portfolio", "settings"), settingsData, { merge: true });
    return { success: true };
}

// ═══════════════════════════════════════════
//  FILE UPLOADS — removed (no Firebase Storage on Spark plan)
//  Use direct URLs instead (Imgur, Cloudinary, GitHub, etc.)
// ═══════════════════════════════════════════
