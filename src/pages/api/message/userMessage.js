import jwt from 'jsonwebtoken';
import { mongoClient } from "@/lib/mongoDb/mongoclient";

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const userCookie = req.cookies['user-token'];
            const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
            const user = decodedUser.data;
            const myId = user._id;
            const { userId } = req.body;

            const collection = (await mongoClient()).collection("messages");

            const userMessage = await collection.find({
                $or: [
                    { senderId: myId, receiverId: userId },
                    { senderId: userId, receiverId: myId }
                ]
            }).sort({ createdAt: 1 }).toArray();

            res.status(202).json({ message: userMessage, success: true });
        } catch (error) {
            console.log('error is : ', error);
            res.status(404).json({ message: 'failed', success: false });
        }
    }
}