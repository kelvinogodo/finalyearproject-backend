// firebase.js
import admin from "firebase-admin";
import dotenv from "dotenv";


dotenv.config();

let serviceAccount;
try {
  // Check if it's a JSON string (typical for Render/Cloud envs)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS.startsWith("{")) {
    serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  } else {
    // Assume it's a file path
    serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
} catch (error) {
  console.error("❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS:", error.message);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


export const messaging = admin.messaging();
