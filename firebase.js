// firebase.js - UPDATED VERSION 3.3
import admin from "firebase-admin";
import dotenv from "dotenv";

console.log("🚀 [Firebase] Initializing v3.3 logic...");

dotenv.config();

const rawCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let serviceAccount;

if (!rawCreds) {
  console.warn("⚠️ [Firebase] GOOGLE_APPLICATION_CREDENTIALS is missing!");
} else {
  let cleaned = rawCreds.trim();

  // 1. Remove enclosing quotes if present
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }

  if (cleaned.startsWith("{")) {
    console.log("📦 [Firebase] JSON detected. Pre-sanitizing string...");
    try {
      // 2. Aggressive Pre-Sanitization
      // Replace literal newlines/tabs with escaped versions BEFORE any parse attempt
      const sanitized = cleaned
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");

      serviceAccount = JSON.parse(sanitized);
      console.log("✅ [Firebase] JSON parsed successfully on first try.");
    } catch (err) {
      console.error("❌ [Firebase] Initial parse failed:", err.message);
      console.log("💡 [Firebase] Attempting double-escape recovery...");
      try {
        const doubleFixed = cleaned.replace(/\\\\n/g, "\\n");
        serviceAccount = JSON.parse(doubleFixed);
        console.log("✅ [Firebase] JSON parsed after double-escape fix.");
      } catch (err2) {
        console.error("🆘 [Firebase] All parsing failed. Falls back to raw string.");
        serviceAccount = cleaned;
      }
    }
  } else {
    serviceAccount = cleaned;
  }
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("⭐ [Firebase] initialized successfully.");
} catch (err) {
  console.error("🔥 [Firebase] initializeApp failed:", err.message);
}

export const messaging = admin.messaging();
