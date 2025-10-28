import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

// Broker options — no authentication needed
const options = {
  reconnectPeriod: 1000, // auto-reconnect every second if disconnected
};

const client = mqtt.connect(process.env.MQTT_BROKER_URL, options);

client.on("connect", () => {
  console.log("✅ Connected to MQTT Broker:", process.env.MQTT_BROKER_URL);
});

client.on("error", (err) => {
  console.error("❌ MQTT Connection Error:", err);
});

export default client;
