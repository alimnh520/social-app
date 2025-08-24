import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectDb } from "@/lib/mongoDb/connectDb";
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import myProfile from "@/models/myProfile";
import jwt from 'jsonwebtoken'

export default async function auth(req, res) {
    return await NextAuth(req, res, {
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }),
            FacebookProvider({
                clientId: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            }),
        ],

        session: {
            strategy: "jwt",
        },

        callbacks: {
            async signIn({ account, profile }) {
                try {
                    const collection = (await mongoClient()).collection("myprofiles");
                    let user;

                    if (account?.provider === "facebook") {
                        user = await collection.findOne({ user_id: profile.id });
                        if (!user) {
                            await connectDb();

                            user = await myProfile.create({
                                user_id: profile.id,
                                username: profile.name || "Unknown",
                                image: profile.picture?.data?.url || "",
                            });

                            const decodedId = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

                            res.setHeader('Set-Cookie', `user-token=${decodedId}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/;`
                            );

                            return true;
                        }

                        const decodedId = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

                        res.setHeader('Set-Cookie', `user-token=${decodedId}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/;`
                        );

                        return true;
                    }

                    if (account?.provider === "google") {
                        user = await collection.findOne({ email: profile.email });
                        if (!user) {
                            user = await myProfile.create({
                                username: profile.name || "Unknown",
                                email: profile.email,
                                image: profile.picture || "",
                            });

                            const decodedId = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

                            res.setHeader('Set-Cookie', `user-token=${decodedId}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/;`
                            );

                            return true;
                        }

                        const decodedId = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

                        res.setHeader('Set-Cookie', `user-token=${decodedId}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=86400; Path=/;`
                        );

                        return true;
                    }


                } catch (err) {
                    console.error("🔥 signIn error:", err);
                    return false;
                }
            },
        },

        secret: process.env.NEXTAUTH_SECRET,

        pages: {
            signIn: "/login"
        },
    });
}
