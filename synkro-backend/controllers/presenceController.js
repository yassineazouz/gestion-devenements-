const Presence = require("../models/Presence");

// Marquer une présence
const markPresence = async (req, res) => {
    const { evenement, utilisateur, statut } = req.body;

    try {
        const presence = await Presence.findOneAndUpdate(
            { evenement, utilisateur },
            { statut },
            { new: true, upsert: true } // crée si pas trouvé
        );

        res.status(200).json(presence);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l’enregistrement de la présence." });
    }
};

// Récupérer la présence par événement
const getPresenceByEvent = async (req, res) => {
    try {
        const presences = await Presence.find({ evenement: req.params.eventId }).populate("utilisateur", "nom email");
        res.json(presences);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération." });
    }
};

module.exports = {
    markPresence,
    getPresenceByEvent
};
