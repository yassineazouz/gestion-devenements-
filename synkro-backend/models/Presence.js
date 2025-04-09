const mongoose = require("mongoose");

const presenceSchema = new mongoose.Schema({
    evenement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    statut: {
        type: String,
        enum: ["present", "absent"],
        default: "absent",
    }
}, { timestamps: true });

module.exports = mongoose.model("Presence", presenceSchema);
