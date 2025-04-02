const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Connexion MongoDB
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB(); // Connexion à la base de données

const app = express();
app.use(cors());
app.use(express.json());

// Définition des routes
app.use("/api/users", userRoutes);  // Routes utilisateurs

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Route non trouvée" });
});

// Lancer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}!`);
});
