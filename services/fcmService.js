import { messaging } from "../firebase.js";

/**
 * Sends a push notification to a specific token or topic.
 * @param {string} token - The device's FCM registration token.
 * @param {object} payload - The notification payload (title, body, data).
 */
export const sendPushNotification = async (token, payload) => {
    if (!token) {
        console.warn("⚠️ No FCM token provided. Skipping push notification.");
        return;
    }

    const message = {
        notification: {
            title: payload.title || "Motion Detected!",
            body: payload.body || "Unexpected activity captured by ESP32-CAM.",
        },
        data: payload.data || {},
        token: token,
    };

    try {
        const response = await messaging.send(message);
        console.log("✅ FCM Notification sent successfully:", response);
        return response;
    } catch (error) {
        console.error("❌ FCM Error:", error.message);
        throw error;
    }
};

/**
 * Sends a notification to a topic (e.g., 'motion_alerts').
 * Useful if multiple devices are subscribed to the same camera.
 */
export const broadcastMotionAlert = async (payload) => {
    const message = {
        notification: {
            title: payload.title || "🚨 Security Alert",
            body: payload.body || "Motion detected in the surveillance area.",
        },
        data: {
            click_action: "FLUTTER_NOTIFICATION_CLICK", // for mobile
            status: "done",
            ...payload.data,
        },
        topic: "motion_alerts",
    };

    try {
        const response = await messaging.send(message);
        console.log("📢 Broadcast FCM successful:", response);
        return response;
    } catch (error) {
        console.error("❌ FCM Broadcast Error:", error.message);
    }
};
