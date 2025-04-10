const Event = require("../models/Event");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


const createEvent = async (req, res) => {
    const {
        titre, description, date, heure, lieu, categorie,
        organisateur, coOrganisateurs, nom, prenom, link, type, invitees = []
    } = req.body;

    try {
        const event = new Event({
            titre, description, date, heure, lieu, categorie,
            organisateur, coOrganisateurs, nom, prenom, link, type, invitees
        });

        await event.save();

        // ✉️ Send email to invitees
        for (const invitee of invitees) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: invitee.email,
                subject: `Invitation à l'événement : ${titre}`,
                html: `
                    <p>Bonjour,</p>
                    <p>Vous êtes invité à <strong>${titre}</strong></p>
                    <p><strong>Lieu:</strong> ${lieu}<br />
                    <strong>Date:</strong> ${new Date(date).toLocaleDateString()}<br />
                    <strong>Heure:</strong> ${heure}</p>
                    <p><a href="http://localhost:3000">Voir l'événement</a></p>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
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
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body, // this includes nom, prenom, link if passed from frontend
            },
            {
                new: true,
                runValidators: true
            }
        );

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
