import jwt from 'jsonwebtoken'
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import message from '@/models/message';
import { connectDb } from '@/lib/mongoDb/connectDb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const userCookie = req.cookies['user-token'];
            const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
            const user = decodedUser.data;
            const myId = user._id;

            const { userId, text } = req.body;

            await connectDb();
            const saveUserMessage = new message({
                senderId: myId,
                receiverId: userId,
                text,
            });
            await saveUserMessage.save();

            res.status(202).json({ message: '', success: true });
        } catch (error) {
            console.log('error is : ', error);
            res.status(404).json({ message: 'failed', success: false });
        }
    }

    if (req.method === 'GET') {
        try {
            const collection = (await mongoClient()).collection("messages");

            

            res.status(202).json({ message: '', success: true });
        } catch (error) {
            console.log('error is : ', error);
            res.status(404).json({ message: 'failed', success: false });
        }
    }
}