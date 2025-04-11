const User = require("../models/User");
const jwt = require("jsonwebtoken");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
    try {
      const { nom, email, mot_de_passe } = req.body;
      console.log("📩 Incoming register data:", req.body);

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
  
      const user = await User.create({ nom, email, mot_de_passe });
  
      if (user) {
        res.status(201).json({
          _id: user._id,
          nom: user.nom,
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
            _id: user._id,
            nom: user.nom,
            email: user.email,
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
        email: req.user.email,
    });
};


module.exports = { registerUser, loginUser, getUserProfile };
