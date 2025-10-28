import { getLatestStreamIP, publishTimeControl } from "../services/mqttService.js";

export const getStream = (req, res) => {
  const ip = getLatestStreamIP();
  if (!ip) return res.status(404).json({ message: "No stream IP yet" });
  res.json({ stream_ip: ip });
};

export const sendTimeControl = (req, res) => {
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime)
    return res.status(400).json({ message: "Missing parameters" });

  // Split "HH:MM" format into numbers
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Pass numeric values to MQTT publisher
  publishTimeControl({ startHour, startMinute, endHour, endMinute });

  res.json({ message: "✅ Time control command sent successfully!" });
};