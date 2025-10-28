import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (io) io.emit("stream_update", { ip: data });
 else console.warn("⚠️ Socket.IO not initialized yet");

  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New WebSocket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 WebSocket disconnected:", socket.id);
    });
  });

  return io;
};

export { io };
