import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables early

import express from "express";
import http from "http";
import cors from "cors";
import apiRoutes from "./routes/api.js";
import motionRoutes from "./routes/motionRoutes.js";
import { initSocket } from "./utils/socketManager.js";
import "./services/mqttService.js"; // initialize MQTT
import "./firebase.js"; // initialize Firebase Admin SDK (optional if still used)

const app = express();

// ✅ Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());

// ✅ API Routes
app.use("/api", apiRoutes);
app.use("/api/motion", motionRoutes);

// ✅ Server and Socket.io setup
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Email alerts active for: ${process.env.ALERT_EMAIL}`);
});
