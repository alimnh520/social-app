import { mongoClient } from '@/lib/mongoDb/mongoclient';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { newName } = req.body;

            const userCookie = req.cookies['user-token'];
            const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
            const user = decodedUser.data;
            const userId = user._id;

            const collection = (await mongoClient()).collection('myprofiles');
            const postCollection = (await mongoClient()).collection('posts');


            await collection.findOneAndUpdate({ _id: new ObjectId(userId) }, {
                $set: {
                    username: newName
                }
            });
            
            await postCollection.updateMany({ userId }, {
                $set: {
                    username: newName
                }
            });

            const data = await collection.findOne({ _id: new ObjectId(userId) });
            const decodedId = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.setHeader('Set-Cookie',
                `user-token=${decodedId}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/; `
            );

            res.status(202).json({ message: 'success', success: 'true' });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: '', success: false });
        }
    }
}