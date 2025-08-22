import cloudinary from '@/lib/cloudinary/cloudConfig';
import { mongoClient } from '@/lib/mongoDb/mongoclient';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { img_url, img_id } = req.body;

            const idCookie = req.cookies['user-token'];
            const decodedId = jwt.verify(idCookie, process.env.JWT_SECRET);
            const userId = decodedId.id;

            const collection = (await mongoClient()).collection('myprofiles');

            const user = await collection.findOne({ _id: new ObjectId(userId) });
            if (user.imageId) {
                await cloudinary.uploader.destroy(user.imageId.toString());
            }

            await collection.findOneAndUpdate({ _id: new ObjectId(userId) }, {
                $set: {
                    image: img_url,
                    imageId: img_id,
                }
            });

            res.status(202).json({ message: 'success', success: true });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: '', success: 'false' });
        }
    }
}