// firebase.js - UPDATED VERSION 3.0
import admin from "firebase-admin";
import dotenv from "dotenv";

console.log("🚀 [Firebase] Initializing v3.0 logic...");

dotenv.config();

const rawCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let serviceAccount;

if (!rawCreds) {
  console.warn("⚠️ [Firebase] GOOGLE_APPLICATION_CREDENTIALS is missing in environment.");
} else {
  const trimmed = rawCreds.trim();

  if (trimmed.startsWith("{")) {
    console.log("📦 [Firebase] Detected JSON string. Attempting to parse...");
    try {
      // Fix for common newline issues in env vars
      const sanitized = trimmed.replace(/\\n/g, '\n');
      serviceAccount = JSON.parse(sanitized);
      console.log("✅ [Firebase] JSON parsed successfully.");
    } catch (err) {
      console.error("❌ [Firebase] JSON parse failed:", err.message);
      serviceAccount = trimmed;
    }
  } else {
    console.log("📄 [Firebase] Using credentials as file path/token.");
    serviceAccount = trimmed;
  }
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("⭐ [Firebase] initialized successfully.");
} catch (err) {
  console.error("🔥 [Firebase] initializeApp failed:", err.message);
  // Important: if we reach here and it still tries to 'open' a JSON string as a file,
  // it means serviceAccount was still a string but not a valid path.
}

export const messaging = admin.messaging();
