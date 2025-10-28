import mqttClient from "../config/mqttConfig.js";
import { io } from "../utils/socketManager.js";
import { sendMotionEmail } from "../services/emailService.js";

const TOPICS = {
  STREAM: "ESP32CAM_234/Stream",
  MOTION: "ESP32CAM_234/Motion",
  TIME_CONTROL: "ESP32CAM_234/time_control",
};

let latestStreamIP = null;

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
    // Emit for frontend to update images
    io.emit("motion_detected", { timestamp: new Date(), message: data });

    // ✅ Only send email if message starts with "motion detected" (case-insensitive)
    if (data.toLowerCase().startsWith("motion detected")) {
      try {
        console.log("🚨 Motion detected! Sending email alert...");
        await sendMotionEmail(
          process.env.ALERT_EMAIL,
          latestStreamIP ? `http://${latestStreamIP}/capture.jpg` : null
        );
      } catch (error) {
        console.error("❌ Failed to send motion email:", error.message);
      }
    } else {
      console.log("⚙️ Motion topic updated, but not a 'Motion Detected' event. Ignoring...");
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
