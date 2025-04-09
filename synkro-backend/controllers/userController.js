const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Générer un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Inscription utilisateur
const registerUser = async (req, res) => {
    try {
        const { nom, email, mot_de_passe, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        // Créer un nouvel utilisateur
        const user = await User.create({ nom, email, mot_de_passe, role });

        if (user) {
            res.status(201).json({
                _id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Échec de l'inscription" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Connexion utilisateur
const loginUser = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier le mot de passe
        const isMatch = await user.matchPassword(mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Retourner les informations + token JWT
        res.json({
            _id: user._id,
            nom: user.nom,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }

    // Récupérer le profil de l'utilisateur connecté
    const getUserProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

        res.json({
            _id: req.user._id,
            nom: req.user.nom,
            email: req.user.email,
            role: req.user.role,
        });
    };
};

module.exports = { registerUser, loginUser, getUserProfile };
