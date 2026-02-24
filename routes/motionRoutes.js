import express from "express";
import { sendMotionEmail } from "../services/emailService.js";
import { io } from "../utils/socketManager.js";
import { relayStream } from "../services/streamRelay.js";

const router = express.Router();

// 📺 Live Stream Relay (CCTV Style)
router.get("/live", (req, res) => {
  relayStream(res);
});

// Route for motion detection alerts
router.post("/motion-detected", async (req, res) => {
  const { imageUrl } = req.body;

  try {
    // 📧 Send motion alert email (reads ALERT_EMAIL from .env)
    await sendMotionEmail(process.env.ALERT_EMAIL, imageUrl || null);


    // 🔄 Emit real-time socket event to frontend
    io.emit("motion_detected", { message: "motion detected", imageUrl });

    return res.status(200).json({ message: "Email notification sent successfully" });
  } catch (error) {
    console.error("❌ Error in motion route:", error.message);
    return res.status(500).json({ error: "Failed to send email notification" });
  }
});

export default router;
