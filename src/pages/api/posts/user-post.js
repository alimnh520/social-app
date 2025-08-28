import { mongoClient } from '@/lib/mongoDb/mongoclient';
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const collection = (await mongoClient()).collection('posts');
            const userPost = await collection.find({}).toArray();
            res.status(202).json({ message: userPost, success: true });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: '', success: false });
        }
    }
}