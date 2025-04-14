const Event = require("../models/Event");
const User = require("../models/User");
const Invitation = require("../models/Invitation");
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
      organisateur, coOrganisateurs, nom, prenom, link, type
    });
    

    await event.save();

    for (const invitee of invitees) {
      const user = await User.findOne({ email: invitee.email });
      console.log(`Inviting ${invitee.email} | User exists: ${!!user}`);
      
      if (user && user._id.toString() === organisateur.toString()) {
        console.log(`⚠️ Skipping self-invitation for ${user.email}`);
        continue;
      }
    
      const invitation = new Invitation({
        evenement: event._id,
        id_utilisateur: user?._id || null,
        destinataire: invitee.email,
        statut: "envoyée"
      });
    
      await invitation.save();
      console.log("📨 Invitation object saved for:", invitee.email);
    
      if (user) {
        user.invitations.push(invitation._id);
        await user.save();
      }
    
      try {
        await transporter.sendMail({
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
        });
        console.log("✅ Email sent to:", invitee.email);
      } catch (mailErr) {
        console.error("❌ Failed to send email to:", invitee.email, mailErr);
      }
    }
    
    
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l’événement", error });
  }
};
const getAllEvents = async (req, res) => {
  try {
    console.log("getAllEvents called by:", req.user?._id);
    const userId = req.user._id;

    const acceptedInvitations = await Invitation.find({
      id_utilisateur: userId,
      statut: 'acceptée'
    });

    const acceptedEventIds = acceptedInvitations.map(inv => inv.evenement);


    const events = await Event.find({
      $or: [
        { organisateur: userId },
        { _id: { $in: acceptedEventIds } }
      ]
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements" });
  }
};




const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organisateur", "nom email");

    if (!event) return res.status(404).json({ message: "Événement non trouvé" });

    res.json(event); // ✅ This should include nom & prenom
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l’événement" });
  }
};


const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    // 👇 Only organizer can update
    if (event.organisateur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cet événement." });
    }

    Object.assign(event, req.body);
    await event.save();


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
