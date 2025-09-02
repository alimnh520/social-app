import jwt from 'jsonwebtoken';
import { mongoClient } from "@/lib/mongoDb/mongoclient";

export default async (req, res) => {

    const userCookie = req.cookies['user-token'];
    const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
    const user = decodedUser.data;
    const myId = user._id;
    const { userId } = req.body;

    if (req.method === 'POST') {
        try {

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

    if (req.method === 'GET') {
        try {
            const collection = (await mongoClient()).collection("members");

            const messageHistory = await collection.find({}).sort({ updatedAt: -1 }).toArray();

            res.status(202).json({ message: messageHistory, success: true });
        } catch (error) {
            console.log('error is : ', error);
            res.status(404).json({ message: 'failed', success: false });
        }
    }
}