const mongoose = require("mongoose");

const presenceSchema = new mongoose.Schema({
    id_evenement: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    statut_presence: { type: String, enum: ["présent", "absent"], default: "présent" }
}, { timestamps: true });

module.exports = mongoose.model("Presence", presenceSchema);
