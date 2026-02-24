// firebase.js
import admin from "firebase-admin";
import dotenv from "dotenv";


dotenv.config();

dotenv.config();

const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let serviceAccount;

try {
  if (creds && creds.trim().startsWith("{")) {
    console.log("📦 Detected JSON string for Firebase credentials. Parsing...");
    serviceAccount = JSON.parse(creds);
  } else {
    console.log("📄 Using Firebase credentials from file path:", creds);
    serviceAccount = creds;
  }
} catch (error) {
  console.error("❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS:", error.message);
  serviceAccount = creds; // fallback
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


export const messaging = admin.messaging();
