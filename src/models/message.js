const { default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: String,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        trim: true,
    },
    attachments: [
        {
            url: String,  
            type: String,
            url_id: String 
        },
    ],
    
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.models.message || mongoose.model("message", messageSchema);
