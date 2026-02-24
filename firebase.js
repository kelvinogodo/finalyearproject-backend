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
  let trimmed = rawCreds.trim();

  // Handle cases where the whole JSON might be wrapped in quotes by the environment manager
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    console.log("🛰️ [Firebase] Removing enclosing quotes from credentials string...");
    trimmed = trimmed.substring(1, trimmed.length - 1);
  }

  if (trimmed.startsWith("{")) {
    console.log("📦 [Firebase] Detected JSON string. Attempting to parse...");
    try {
      serviceAccount = JSON.parse(trimmed);
      console.log("✅ [Firebase] JSON parsed successfully.");
    } catch (err) {
      console.error("❌ [Firebase] Standard JSON parse failed:", err.message);
      console.log("💡 [Firebase] Attempting aggressive recovery/sanitization...");
      try {
        const sanitized = trimmed
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t");

        serviceAccount = JSON.parse(sanitized);
        console.log("✅ [Firebase] JSON parsed successfully after sanitization.");
      } catch (err2) {
        console.error("💀 [Firebase] Sanitization failed:", err2.message);
        try {
          const fixed = trimmed.replace(/\\\\n/g, "\\n");
          serviceAccount = JSON.parse(fixed);
          console.log("✅ [Firebase] JSON parsed successfully after double-escape fix.");
        } catch (err3) {
          console.error("🆘 [Firebase] All parsing attempts failed.");
          serviceAccount = trimmed;
        }
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
