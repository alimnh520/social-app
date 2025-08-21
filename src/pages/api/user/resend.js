import { emailVerify } from '@/lib/sendMail';
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const user = req.cookies?.user;
            const decodedUser = jwt.verify(user, process.env.JWT_SECRET);
            const email = decodedUser.email; 
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpCode = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: '2m' });
            await emailVerify({ email, otp });

            res.setHeader('Set-Cookie', [
                `otp=${otpCode}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=120; Path=/;`
            ]);

            res.status(202).json({ message: 'resend email', success: true });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'failed', success: false });
        }
    }
}
