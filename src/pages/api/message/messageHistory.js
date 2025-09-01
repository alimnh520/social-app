import { mongoClient } from "@/lib/mongoDb/mongoclient";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

export default async function handler(req, res) {

    const userCookie = req.cookies['user-token'];
    const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
    const user = decodedUser.data;
    const userId = user._id;

    if (req.method === 'POST') {
        try {
            const { userId } = req.body;
            console.log('userId is : ', userId);

            return res.status(202).json({ message: 'success', success: true });
        } catch (error) {
            console.log('error is : ', error);
            return res.status(500).json({ message: 'failed', success: false });
        }
    }

    if (req.method === 'GET') {
        try {

            const userCollection = (await mongoClient()).collection("myprofiles");
            const collection = (await mongoClient()).collection("messages");

            const messages = await collection.find({
                $or: [{ senderId: userId }, { receiverId: userId }]
            }).toArray();

            let userIds = messages.map(m =>
                m.senderId === userId ? m.receiverId : m.senderId
            );

            userIds = [...new Set(userIds)].map(id => new ObjectId(id));

            const data = await userCollection.find({ _id: { $in: userIds } }, {
                projection: {
                    email: 0,
                    password: 0,
                    imageId: 0,
                },
            }).toArray();

            res.status(202).json({ message: data, success: true });
        } catch (error) {
            console.log('error is : ', error);
            res.status(404).json({ message: 'failed', success: false });
        }
    }
}
