const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Non autorisé, aucun token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-mot_de_passe");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = { protect };
