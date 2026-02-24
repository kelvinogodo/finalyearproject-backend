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
      // PRO TIP: Do NOT replace \\n with \n BEFORE parsing. 
      // JSON.parse handles \n automatically.
      serviceAccount = JSON.parse(trimmed);
      console.log("✅ [Firebase] JSON parsed successfully.");
    } catch (err) {
      console.error("❌ [Firebase] JSON parse failed:", err.message);
      console.log("💡 [Firebase] Attempting recovery by fixing literal newlines...");
      try {
        // If there are literal newlines (actual line breaks), JSON.parse fails.
        // We replace actual line breaks with \\n
        const fixed = trimmed.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
        serviceAccount = JSON.parse(fixed);
        console.log("✅ [Firebase] JSON parsed successfully after fixing literal newlines.");
      } catch (err2) {
        console.error("💀 [Firebase] Recovery failed. Please ensure the env var is a single-line JSON string.");
        serviceAccount = trimmed;
      }
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
