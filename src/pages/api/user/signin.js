import { mongoClient } from "@/lib/mongoDb/mongoclient";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            // email check

            const collection = (await mongoClient()).collection('myprofiles');
            const data = await collection.findOne({ email });

            if (!data) return res.status(404).json({ message: 'invalid credentials', success: false });

            // password check

            const decodedPass = await bcrypt.compare(password, data.password);
            if (!decodedPass) return res.status(404).json({ message: 'invalid credentials', success: false });

            if (decodedPass) {
                const decodedId = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
                res.setHeader('Set-Cookie', `user-token=${decodedId}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/; `);
                res.status(202).json({ message: 'login successful', success: true });
            }

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: 'error', success: false })
        }
    }
}