import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Mongodb connected on');
    } catch (error) {
        console.log('mongodb is connect to failed');
        process.exit(1);
    }
}