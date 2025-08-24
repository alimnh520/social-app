const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_id: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    image: { type: String },
    imageId: { type: String },
    notification: [String],
}, { timestamps: true });


export default mongoose.models.MyProfile || mongoose.model('MyProfile', UserSchema);