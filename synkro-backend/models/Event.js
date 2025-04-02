const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    date_heure: { type: Date, required: true },
    lieu: { type: String, required: true },
    statut: { type: String, enum: ["prévu", "en cours", "terminé"], default: "prévu" },
    id_organisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
