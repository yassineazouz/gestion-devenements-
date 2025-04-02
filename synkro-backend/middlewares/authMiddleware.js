const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé, token manquant" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
};

module.exports = { protect };
