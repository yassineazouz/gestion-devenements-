const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Inscription
router.post("/register", registerUser);

// Connexion
router.post("/login", loginUser);

// Récupérer les infos de l'utilisateur connecté (protégé par authMiddleware)
router.get("/me", protect, getUserProfile);

module.exports = router;
