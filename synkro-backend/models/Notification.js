const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    date_envoi: { type: Date, default: Date.now },
    lu: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
