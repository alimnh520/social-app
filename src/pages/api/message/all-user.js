import { mongoClient } from "@/lib/mongoDb/mongoclient";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const collection = (await mongoClient()).collection("myprofiles");
            const data = await collection
                .find(
                    {},
                    {
                        projection: {
                            email: 0,
                            password: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            imageId: 0,
                        },
                    }
                )
                .toArray();

            res.status(202).json({ message: data, success: true });
        } catch (error) {
            console.log('error is : ', error);
            res.status(404).json({ message: 'failed', success: false });
        }
    }
}
