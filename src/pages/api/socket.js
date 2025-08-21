import { Server } from "socket.io";

export default function handler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, {
            path: "/api/socket_io",
        });
        res.socket.server.io = io;
        console.log("✅ Socket.io server started!");

        io.on("connection", (socket) => {
            console.log("🟢 User connected:", socket.id);

            socket.on("message", (data) => {
                console.log("📨 Message received:", data);
                socket.broadcast.emit("message", data); // send to others
            });

            socket.on("disconnect", () => {
                console.log("🔴 User disconnected:", socket.id);
            });
        });
    }
    res.end();
}

export const config = {
    api: {
        bodyParser: false,
    },
};
