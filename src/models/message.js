const { default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        ref: "User", // কে পাঠালো
        required: true,
    },
    receiverId: {
        type: String,
        ref: "User", // কাকে পাঠানো হলো
        required: true,
    },
    text: {
        type: String, // মেসেজ টেক্সট
        trim: true,
    },
    attachments: [
        {
            url: String,   // ফাইল / ইমেজ এর লিংক
            type: String,
            url_id: String  // image, video, file ইত্যাদি
        },
    ],
    isRead: {
        type: Boolean,
        default: false, // unread = false
    },
}, { timestamps: true });

export default mongoose.models.message || mongoose.model("message", messageSchema);
