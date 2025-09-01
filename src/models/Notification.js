const { default: mongoose } = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    userAvatar: {
        type: String,
    },

    type: {
        type: String,
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export default mongoose.models.notification || mongoose.model("notification", NotificationSchema);