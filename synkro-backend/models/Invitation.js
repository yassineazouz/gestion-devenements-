const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
    id_evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    statut: { type: String, enum: ["envoyée", "acceptée", "refusée"], default: "envoyée" },
    date_envoi: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Invitation", invitationSchema);
