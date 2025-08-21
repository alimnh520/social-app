const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    imageId: { type: String, required: false },

}, {timestamps: true});

export default mongoose.models.MyProfile || mongoose.model('MyProfile', UserSchema);