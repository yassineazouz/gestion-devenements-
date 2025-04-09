const Invitation = require("../models/Invitation");
const Event = require("../models/Event");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendInvitation = async (req, res) => {
    const { email, eventId } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Événement non trouvé" });

        const invitation = new Invitation({
            destinataire: email,
            evenement: eventId,
            statut: "en_attente"
        });

        await invitation.save();

        const linkAccept = `http://localhost:3000/invitation/accept/${invitation._id}`;
        const linkDecline = `http://localhost:3000/invitation/decline/${invitation._id}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Invitation à l'événement : ${event.nom}`,
            html: `
                <p>Vous êtes invité à l'événement : <strong>${event.nom}</strong></p>
                <p>Date : ${event.date} | Lieu : ${event.lieu}</p>
                <p><a href="${linkAccept}">Accepter</a> | <a href="${linkDecline}">Refuser</a></p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Invitation envoyée par email avec succès !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'invitation." });
    }
};

// Accepter une invitation
const acceptInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id);
        if (!invitation) return res.status(404).send("Invitation non trouvée");

        invitation.statut = "accepte";
        await invitation.save();

        res.send("Invitation acceptée avec succès !");
        // Ou rediriger : res.redirect("http://localhost:3000/confirmation-accept");
    } catch (err) {
        res.status(500).send("Erreur lors du traitement de l'invitation.");
    }
};

// Refuser une invitation
const declineInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id);
        if (!invitation) return res.status(404).send("Invitation non trouvée");

        invitation.statut = "refuse";
        await invitation.save();

        res.send("Invitation refusée.");
        // Ou rediriger : res.redirect("http://localhost:3000/confirmation-refuse");
    } catch (err) {
        res.status(500).send("Erreur lors du traitement de l'invitation.");
    }
};

// Récupérer les invitations d'un événement
const getInvitationsByEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const invitations = await Invitation.find({ evenement: eventId });
        res.json(invitations);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des invitations." });
    }
};

// Récupérer les invitations envoyées à un email spécifique
const getInvitationsByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const invitations = await Invitation.find({ destinataire: email });
        res.json(invitations);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des invitations." });
    }
};

module.exports = {
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    getInvitationsByEvent,
    getInvitationsByEmail
};

