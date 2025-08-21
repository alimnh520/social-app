
export default async function handler(req, res) {
    try {
        const body = req.body;
        // const db = await dbConnection();
        // const collection = db.collection("messages");

        // const result = await collection.insertOne({
        //     text: body.text,
        //     time: new Date().toLocaleTimeString(),
        // });

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

export async function GET(req, res) {
    try {
        const db = await dbConnection();
        const collection = db.collection("messages");
        const message = await collection.find({}).toArray();
        return NextResponse.json({ message });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed' });
    }
}