import axios from "axios";
import { getLatestStreamIP } from "./mqttService.js";

/**
 * Relays the MJPEG stream from the ESP32-CAM to the Express response.
 * @param {express.Response} res - The Express response object.
 */
export const relayStream = async (res) => {
  const ip = getLatestStreamIP();

  if (!ip) {
    return res.status(503).send("Stream not available yet. ESP32-CAM has not published its IP via MQTT.");
  }

  // Common ESP32-CAM MJPEG stream URL is http://<ip>:81/stream or http://<ip>/stream
  // We'll try the standard IP first. If the hardware uses port 81, we might need to adjust.
  // Given the previous code used http://<ip>/capture.jpg, it's likely on port 80.
  const streamUrl = `http://${ip}/stream`;

  console.log(`📡 Relaying stream from: ${streamUrl}`);

  try {
    const response = await axios({
      method: "get",
      url: streamUrl,
      responseType: "stream",
      timeout: 10000, // 10s timeout to connect
    });

    // Set headers for MJPEG
    res.setHeader("Content-Type", "multipart/x-mixed-replace; boundary=frame");
    
    // Pipe the data
    response.data.pipe(res);

    // Handle client disconnect
    res.on("close", () => {
      console.log("🔌 Client disconnected from live stream relay.");
      if (response.data.destroy) response.data.destroy();
    });

  } catch (error) {
    console.error("❌ Stream Relay Error:", error.message);
    if (!res.headersSent) {
      res.status(502).send("Failed to connect to ESP32-CAM stream. Hardware might be offline or URL is incorrect.");
    }
  }
};
