const { default: mongoose } = require("mongoose");

const members = new mongoose.Schema({
    members: [String],
    lastMessage: { type: String },
}, { timestamps: true });

export default mongoose.models.members || mongoose.model("members", members);
