const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    // Vérifie l'en-tête Authorization: Bearer <token>
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-mot_de_passe"); // Attache l'utilisateur sans son mdp
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Token invalide ou expiré" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Non autorisé, token manquant" });
    }
};

module.exports = { protect };
