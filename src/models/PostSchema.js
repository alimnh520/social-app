const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    userAvatar: {
        type: String,
    },

    content: {
        type: String,
    },

    imageUrl: {
        type: String,
    },

    imageId: {
        type: String,
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],

}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
