const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, "Email invalide"] 
    },
    mot_de_passe: { type: String, required: true },
    role: { type: String, enum: ["organisateur", "participant"], required: true }
}, { timestamps: true });

// Hashage du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
    if (!this.isModified("mot_de_passe")) return next();
    const salt = await bcrypt.genSalt(10);
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    next();
});

// Méthode pour comparer un mot de passe avec le hash
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.mot_de_passe);
};

module.exports = mongoose.model("User", userSchema);
