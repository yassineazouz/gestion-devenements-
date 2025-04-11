const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const connectDB = require("./config/db"); 
const userRoutes = require("./routes/userRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const presenceRoutes = require("./routes/presenceRoutes");
const eventRoutes = require("./routes/eventRoutes");
require("./scheduler/notificationScheduler");


dotenv.config();
connectDB(); // Connexion à la base de données

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
  
app.use("/api/users", userRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/invitations", invitationRoutes);
app.use("/api/presences", presenceRoutes);
app.use("/api/events", eventRoutes);



// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Route non trouvée" });
});

// Lancer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}!`);
});
