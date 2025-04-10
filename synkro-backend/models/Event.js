const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  heure: { type: String },
  lieu: { type: String },
  link: { type: String },
  nom: { type: String },
  prenom: { type: String },
  categorie: {
    type: String,
    enum: ["réunion", "conférence", "fête", "autre"],
    default: "autre"
  },
  organisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  coOrganisateurs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  invitees: [
    {
      email: { type: String },
      nom: { type: String },
      prenom: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
