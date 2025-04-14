const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  invitations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invitation"
    }
  ]
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });


// 🔐 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("mot_de_passe")) return next();
  const salt = await bcrypt.genSalt(10);
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
  next();
});

// ✅ Check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.mot_de_passe);
};

module.exports = mongoose.model("User", userSchema);
