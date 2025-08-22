const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MyProfile",
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    userAvatar: {
        type: String,
    },

    commentText: {
        type: String,
        required: true,
    },

}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
