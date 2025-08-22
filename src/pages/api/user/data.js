import { mongoClient } from '@/lib/mongoDb/mongoclient';
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb';
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const idCookie = req.cookies['user-token'];
            const decodedId = jwt.verify(idCookie, process.env.JWT_SECRET);
            const userId = decodedId.id;
            const collection = (await mongoClient()).collection('myprofiles');
            const data = await collection.findOne({_id: new ObjectId(userId)});
            res.status(202).json({message: data, success: true});
        } catch (error) {
            console.log(error);
            res.status(404).json({message: '', success: false});
        }
    }
}