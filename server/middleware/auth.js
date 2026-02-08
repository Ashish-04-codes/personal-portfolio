const admin = require("firebase-admin");
require("dotenv").config();

/**
 * Firebase Admin SDK Initialization
 *
 * Used to verify Firebase Auth tokens sent from the admin panel.
 * Requires a service account key JSON file.
 */
try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const fs = require("fs");

    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(require("path").resolve(serviceAccountPath));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("✅ Firebase Admin initialized");
    } else {
        console.warn("⚠️  Firebase service account not found. Admin auth will be disabled.");
        console.warn("   Download it from Firebase Console > Project Settings > Service Accounts");
    }
} catch (error) {
    console.error("❌ Firebase Admin init failed:", error.message);
}

/**
 * Auth Middleware
 *
 * Verifies the Firebase ID token from the Authorization header.
 * Protects all admin API routes.
 * 
 * ⚠️ TEMP BYPASS: Auth disabled for testing. Remove the early return below to re-enable.
 */
async function authMiddleware(req, res, next) {
    // TEMP BYPASS — remove this block to re-enable auth
    req.user = { uid: "dev-user", email: "admin@test.com" };
    return next();

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

module.exports = { authMiddleware };
