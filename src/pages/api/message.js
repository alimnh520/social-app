
export default async function handler(req, res) {
    try {
        const body = req.body;

        // ✅ Emit via socket.io
        const io = req.socket?.server?.io;
        
        if (io) {
            io.emit("newMessage", {
                text: body.text,
                time: new Date().toLocaleTimeString(),
            });
        }

        res.status(202).json({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: 'Failed' });
    }
}