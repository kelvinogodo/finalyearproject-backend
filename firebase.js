// firebase.js
import admin from "firebase-admin";
import dotenv from "dotenv";


dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});


export const messaging = admin.messaging();
