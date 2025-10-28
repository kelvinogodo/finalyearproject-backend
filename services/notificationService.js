// services/notificationService.js
import { messaging } from "../firebase.js"; // ✅ fixed path

export async function sendMotionAlert(fcmToken, imageUrl) {
  const message = {
    token: fcmToken,
    notification: {
      title: "Motion Detected 📸",
      body: "Your ESP32-CAM just detected movement.",
      image: imageUrl,
    },
    webpush: {
      fcmOptions: {
        link: "https://projectfrontend-nu.vercel.app/motions", // frontend page
      },
    },
  };

  try {
    await messaging.send(message);
    console.log("✅ Motion alert sent successfully!");
  } catch (error) {
    console.error("❌ Error sending motion alert:", error);
  }
}
