import cloudinary from '@/lib/cloudinary/cloudConfig';
import { mongoClient } from '@/lib/mongoDb/mongoclient';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { img_url, img_id } = req.body;

            const userCookie = req.cookies['user-token'];
            const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
            const user = decodedUser.data
            const userId = user._id;
            const imageId = user?.imageId

            imageId && await cloudinary.uploader.destroy(imageId.toString(), { resource_type: 'image' });

            const collection = (await mongoClient()).collection('myprofiles');
            const postCollection = (await mongoClient()).collection('posts');

            await collection.findOneAndUpdate({ _id: new ObjectId(userId) }, {
                $set: {
                    image: img_url,
                    imageId: img_id,
                }
            });

            await postCollection.updateMany({ userId }, {
                $set: {
                    userAvatar: img_url,
                }
            });

            const data = await collection.findOne({ _id: new ObjectId(userId) });
            const decodedId = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.setHeader('Set-Cookie',
                `user-token=${decodedId}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/; `
            );

            res.status(202).json({ message: 'success', success: true });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: '', success: 'false' });
        }
    }
}