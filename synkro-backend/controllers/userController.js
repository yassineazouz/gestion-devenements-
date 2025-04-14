const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email introuvable" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetUrl = `http://localhost:3001/reset-password/${token}`; // frontend URL

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Réinitialisation de mot de passe',
    html: `<p>Pour réinitialiser votre mot de passe, cliquez ici : <a href="${resetUrl}">${resetUrl}</a></p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).json({ message: "Échec de l'envoi du mail" });
    res.json({ message: "Email envoyé avec succès" });
  });
};

// POST /api/users/reset-password/:token
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { mot_de_passe } = req.body;

  console.log("🔐 Incoming token:", token);
  console.log("📦 Password received:", mot_de_passe);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.mot_de_passe = mot_de_passe;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    res.status(400).json({ message: "Token invalide ou expiré" });
  }
};

const registerUser = async (req, res) => {
    try {
      const { nom,prenom, email, mot_de_passe } = req.body;
      console.log("📩 Incoming register data:", req.body);

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
  
      const user = await User.create({ nom,prenom, email, mot_de_passe });
  
      if (user) {
        res.status(201).json({
          _id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          token: generateToken(user._id),

        });
      } else {
        res.status(400).json({ message: "Échec de l'inscription" });
      }
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  };
  


const loginUser = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        const isMatch = await user.matchPassword(mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        res.json({
          user: {
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
          },
          token: generateToken(user._id),
        });
        
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


const getUserProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    res.json({
        _id: req.user._id,
        nom: req.user.nom,
        prenom: req.user.prenom,
        email: req.user.email,
    });
};


module.exports = { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword };
