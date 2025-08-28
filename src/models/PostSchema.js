const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({

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

    content: {
        type: String,
    },

    imageUrl: {
        type: String,
    },

    imageId: {
        type: String,
    },

    imageType: {
        type: String,
    },

    likes: [String],

    comments: [String],

}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
