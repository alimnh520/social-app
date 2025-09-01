import { connectDb } from "@/lib/mongoDb/connectDb";
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import PostSchema from "@/models/PostSchema";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
    try {

        const userCookie = req.cookies['user-token'];
        const decodedUser = jwt.verify(userCookie, process.env.JWT_SECRET);
        const user = decodedUser.data

        const { postText, imageType, post_url, post_id } = req.body;

        await connectDb();

        if (post_url && post_id) {
            const userPost = new PostSchema({
                userId: user._id,
                username: user.username,
                userAvatar: user.image,
                content: postText,
                imageUrl: post_url,
                imageId: post_id,
                imageType
            });
            await userPost.save();

            const io = req.socket?.server?.io;

            if (io) {
                io.emit("newPost", {
                    userId: user._id,
                    username: user.username,
                    userAvatar: user.image,
                    content: postText,
                    imageUrl: post_url,
                    imageId: post_id,
                    imageType,
                    createdAt: new Date().toLocaleTimeString(),
                });
            }   

        } else {
            const userPost = new PostSchema({
                userId: user._id,
                username: user.username,
                userAvatar: user.image,
                content: postText,
            });
            await userPost.save();

            const io = req.socket?.server?.io;

            if (io) {
                io.emit("newPost", {
                    userId: user._id,
                    username: user.username,
                    userAvatar: user.image,
                    content: postText,
                    createdAt: new Date().toLocaleTimeString(),
                });
            }
        }

        res.status(202).json({ message: 'success', success: true });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: '', success: false });
    }
}