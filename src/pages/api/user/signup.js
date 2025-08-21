import { mongoClient } from '@/lib/mongoDb/mongoclient';
import { emailVerify } from '@/lib/sendMail';
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) return res.status(400).json({ message: 'required all', success: false });
            if (password.length < 6) return res.status(400).json({ message: 'password required minimum 6 character', success: false });

            const collection = (await mongoClient()).collection('myprofiles');
            const data = await collection.findOne({email});
            if (data.email === email) return res.status(404).json({message: 'user already exits', success: false});

            const userData = jwt.sign({ username, email, password }, process.env.JWT_SECRET);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(otp);
            const otpCode = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: '2m' });
            await emailVerify({email, otp});

            res.setHeader('Set-Cookie', [
                `otp=${otpCode}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=120; Path=/;`,
                `user=${userData}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/`
            ]);

            res.status(202).json({ message: 'please verify your email', success: true });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'failed', success: false });
        }
    }
}
