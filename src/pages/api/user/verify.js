import { connectDb } from '@/lib/mongoDb/connectDb';
import myProfile from '@/models/myProfile';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const otpCookie = req.cookies?.otp;
            const userCookie = req.cookies?.user;
            const { otp } = req.body;

            // decoded otp
            const decodedOtp = jwt.verify(otpCookie, process.env.JWT_SECRET);

            if (!otp || otp.length < 6) return res.status(404).json({ message: 'invalid credentials', success: false });
            if (otp !== decodedOtp.otp) return res.status(404).json({ message: 'invalid otp', success: false });

            if (otp === decodedOtp.otp) {
                await connectDb();

                // decoded user data
                const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
                const email = decodedUser.email;
                const username = decodedUser.username;
                const password = decodedUser.password;

                const saltPass = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(password, saltPass);

                const user = new myProfile({
                    username,
                    email,
                    password: hashedPass
                });
                await user.save();

                const decodedId = jwt.sign({ user }, process.env.JWT_SECRET, {expiresIn: '1d'});

                res.setHeader('Set-Cookie', [
                    'otp=; HttpOnly; Path=/; Max-Age=0;',
                    'user=; HttpOnly; Path=/; Max-Age=0;',
                    `user-token=${decodedId}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/;`
                ]);
                res.status(200).json({ message: 'success', success: true });
            }
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: 'please resend otp!', success: false });
        }
    }
}