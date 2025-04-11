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

        const existingUser = await User.findOne({ email });

        const invitation = new Invitation({
            destinataire: email,
            evenement: eventId,
            statut: "en_attente",
            id_utilisateur: existingUser?._id || null
        });

        await invitation.save();

        if (existingUser) {
            existingUser.invitations.push(invitation._id);
            await existingUser.save();
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Invitation à l'événement : ${event.titre}`,
            html: `
        <p>Vous êtes invité à l'événement : <strong>${event.titre}</strong></p>
        <p>Date : ${event.date} | Lieu : ${event.lieu}</p>
        <p><a href="http://localhost:3000/invitation/accept/${invitation._id}">Accepter</a> | 
           <a href="http://localhost:3000/invitation/decline/${invitation._id}">Refuser</a></p>
      `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Invitation envoyée avec succès !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'invitation." });
    }
};

const acceptInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id).populate("id_utilisateur");
        if (!invitation) return res.status(404).send("Invitation non trouvée");

        invitation.statut = "acceptée";
        await invitation.save();

        const event = await Event.findById(invitation.evenement);
        if (!event) return res.status(404).send("Événement introuvable");

        // Add user to invitees if not already included
        if (invitation.id_utilisateur) {
            const user = invitation.id_utilisateur;
            const alreadyInvited = event.invitees.some(i => i.email === user.email);

            if (!alreadyInvited) {
                event.invitees.push({
                    email: user.email,
                    nom: user.nom,
                    prenom: user.prenom
                });
                await event.save();
            }

            const organizer = await User.findById(event.organisateur);
            if (organizer) {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: organizer.email,
                    subject: "Invitation acceptée",
                    html: `
                      <p>${user.nom} ${user.prenom} (${user.email}) 
                      a accepté votre invitation à l'événement <strong>${event.titre}</strong>.</p>
                    `
                });
            }
        }

        res.send("Invitation acceptée avec succès !");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors du traitement de l'invitation.");
    }
};


const declineInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id).populate("id_utilisateur");

        if (!invitation) return res.status(404).send("Invitation non trouvée");

        invitation.statut = "refusée";
        await invitation.save();

        const event = await Event.findById(invitation.evenement);
        if (!event) return res.status(404).send("Événement introuvable");

        // Retirer l'utilisateur de l'event
        if (invitation.id_utilisateur) {
            event.invitees = event.invitees.filter(inv =>
                inv.email !== invitation.id_utilisateur.email
            );
            await event.save();

            // Envoie une notification à l’organisateur
            const organizer = await User.findById(event.organisateur);
            if (organizer) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: organizer.email,
                    subject: "Invitation refusée",
                    html: `
            <p>${invitation.id_utilisateur.nom} ${invitation.id_utilisateur.prenom} (${invitation.id_utilisateur.email}) a refusé l'invitation à l'événement <strong>${event.titre}</strong>.</p>
          `
                };
                await transporter.sendMail(mailOptions);
            }
        }

        res.send("Invitation refusée.");
    } catch (err) {
        res.status(500).send("Erreur lors du traitement de l'invitation.");
    }
};

const getInvitationsByEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const invitations = await Invitation.find({ evenement: eventId });
        res.json(invitations);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des invitations." });
    }
};

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
