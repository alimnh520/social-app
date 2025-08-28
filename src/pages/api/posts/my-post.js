import { mongoClient } from '@/lib/mongoDb/mongoclient';
import jwt from 'jsonwebtoken'
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {

            const userCookie = req.cookies['user-token'];
            const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
            const user = decodedUser.data;
            const userId = user._id;

            const postCollection = (await mongoClient()).collection('posts');
            const userPost = await postCollection.find({ userId }).toArray();
            res.status(202).json({ message: userPost , success: true });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: '', success: false });
        }
    }
}