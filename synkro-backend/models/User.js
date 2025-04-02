const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// Middleware pour hasher le mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
    if (!this.isModified("mot_de_passe")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.mot_de_passe);
};

module.exports = mongoose.model("User", userSchema);
