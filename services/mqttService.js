import mqttClient from "../config/mqttConfig.js";
import { io } from "../utils/socketManager.js";
import { sendMotionEmail } from "../services/emailService.js";
import { broadcastMotionAlert } from "./fcmService.js";

const TOPICS = {
  STREAM: "ESP32CAM_234/Stream",
  MOTION: "ESP32CAM_234/Motion",
  TIME_CONTROL: "ESP32CAM_234/time_control",
};

let latestStreamIP = null;

// ⏱️ Email rate-limiting variables
let lastEmailSentAt = 0; // timestamp in ms
const EMAIL_DELAY = 2 * 60 * 1000; // 2 minutes

mqttClient.on("connect", () => {
  mqttClient.subscribe([TOPICS.STREAM, TOPICS.MOTION], (err) => {
    if (!err) console.log("📡 Subscribed to ESP32 topics");
  });
});

mqttClient.on("message", async (topic, message) => {
  const data = message.toString().trim();
  console.log(`📨 MQTT Message [${topic}]: ${data}`);

  if (topic === TOPICS.STREAM) {
    latestStreamIP = data;
    io.emit("stream_update", { ip: data });
  }

  if (topic === TOPICS.MOTION) {
    const snapshotUrl = latestStreamIP ? `http://${latestStreamIP}/capture.jpg` : null;
    io.emit("motion_detected", {
      timestamp: new Date(),
      message: data,
      snapshotUrl: snapshotUrl
    });

    if (data.toLowerCase().startsWith("motion detected")) {
      const now = Date.now();
      if (now - lastEmailSentAt >= EMAIL_DELAY) {
        try {
          console.log("🚨 Motion detected! Sending email alert...");
          await sendMotionEmail(
            process.env.ALERT_EMAIL,
            latestStreamIP ? `http://${latestStreamIP}/capture.jpg` : null
          );

          // 📱 Send Push Notification
          await broadcastMotionAlert({
            title: "🚨 Motion Detected",
            body: `Camera active at ${latestStreamIP || "unknown IP"}. Check the dashboard now!`,
            data: { ip: latestStreamIP || "" }
          });

          lastEmailSentAt = now; // update last email timestamp
        } catch (error) {
          console.error("❌ Failed to send motion email:", error.message);
        }
      } else {
        console.log(
          "⏱️ Motion detected, but waiting for 2 minutes delay before next email."
        );
      }
    } else {
      console.log(
        "⚙️ Motion topic updated, but not a 'Motion Detected' event. Ignoring..."
      );
    }
  }
});

export const getLatestStreamIP = () => latestStreamIP;

export const publishTimeControl = (payload) => {
  const { startHour, startMinute, endHour, endMinute } = payload;
  const message = `${startHour},${startMinute},${endHour},${endMinute}`;
  mqttClient.publish(TOPICS.TIME_CONTROL, message);
  console.log("⏱️ Sent time control payload:", message);
};
