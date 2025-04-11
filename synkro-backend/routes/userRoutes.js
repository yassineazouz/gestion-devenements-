const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const Invitation = require("../models/Invitation");
const User = require("../models/User");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.get("/:id/invitations", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate("invitations");
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      res.json(user.invitations);
    } catch (err) {
      console.error("❌ Erreur invitation:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
module.exports = router;
