import { mongoClient } from '@/lib/mongoDb/mongoclient';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { newName } = req.body;

            const idCookie = req.cookies['user-token'];
            const decodedId = jwt.verify(idCookie, process.env.JWT_SECRET);
            const userId = decodedId.id;

            const collection = (await mongoClient()).collection('myprofiles');
            await collection.findOneAndUpdate({ _id: new ObjectId(userId) }, { $set : {
                username: newName
            }});

            res.status(202).json({ message: 'success', success: true });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: '', success: false });
        }
    }
}