import jwt from 'jsonwebtoken'
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import message from '@/models/message';
import { connectDb } from '@/lib/mongoDb/connectDb';
import Members from '@/models/Members';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {

    const userCookie = req.cookies['user-token'];
    const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
    const user = decodedUser.data;
    const myId = user._id;

    const { userId, text } = req.body;

    if (req.method === 'POST') {
        try {

            await connectDb();

            const collection = (await mongoClient()).collection("members");

            const isConversation = await collection.findOne({ members: { $all: [myId, userId] } });

            if (!isConversation) {

                const members = new Members({
                    members: [myId, userId],
                    lastMessage: text,
                });
                await members.save();

                const saveUserMessage = new message({
                    conversationId: members._id,
                    senderId: myId,
                    receiverId: userId,
                    text,
                });

                await saveUserMessage.save();
            } else {

                await collection.findOneAndUpdate({ _id: new ObjectId(isConversation._id) }, {
                    $set: {
                        lastMessage: text,
                        updatedAt: new Date()
                    }
                });

                const saveUserMessage = new message({
                    conversationId: isConversation._id,
                    senderId: myId,
                    receiverId: userId,
                    text,
                });

                await saveUserMessage.save();
            }

            res.status(202).json({ message: '', success: true });
        } catch (error) {
            console.log('error is : ', error);
            res.status(404).json({ message: 'failed', success: false });
        }
    }

}