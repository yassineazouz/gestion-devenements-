const Event = require("../models/Event");

const createEvent = async (req, res) => {
    const { titre, description, date, heure, lieu, categorie, organisateur, coOrganisateurs } = req.body;

    try {
        const event = new Event({
            titre,
            description,
            date,
            heure,
            lieu,
            categorie,
            organisateur,
            coOrganisateurs
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l’événement", error });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("organisateur", "nom email");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des événements" });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("organisateur", "nom email");
        if (!event) return res.status(404).json({ message: "Événement non trouvé" });

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l’événement" });
    }
};


const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!event) {
            return res.status(404).json({ message: "Événement non trouvé" });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Événement non trouvé" });
        }

        res.json({ message: "Événement supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
};


module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
