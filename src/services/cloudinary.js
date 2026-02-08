/**
 * Cloudinary Upload Service
 *
 * Uploads files directly from the browser to Cloudinary (unsigned).
 * Free tier: 25GB storage, 25GB bandwidth/month.
 *
 * No backend needed — works on GitHub Pages.
 */

const CLOUD_NAME = "dwuf5psag";
const UPLOAD_PRESET = "portfolio_unsigned";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

/**
 * Upload a file to Cloudinary.
 * @param {File} file - The file to upload (image, PDF, etc.)
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Upload failed");
    }

    const data = await res.json();
    return {
        url: data.secure_url,
        public_id: data.public_id,
    };
}
