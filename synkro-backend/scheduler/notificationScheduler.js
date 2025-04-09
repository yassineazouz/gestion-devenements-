const cron = require("node-cron");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const User = require("../models/User");

// Tous les jours à 8h du matin
cron.schedule("0 8 * * *", async () => {
    console.log("[Cron Job] Vérification des événements à venir...");

    const maintenant = new Date();
    const dans24h = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
        const evenements = await Event.find({
            date: { $gte: maintenant, $lte: dans24h }
        }).populate("organisateur participants");

        for (const event of evenements) {
            const utilisateurs = [event.organisateur, ...(event.participants || [])];

            for (const user of utilisateurs) {
                const notifExistante = await Notification.findOne({
                    user: user._id,
                    evenement: event._id,
                    type: "rappel"
                });

                if (!notifExistante) {
                    const notif = new Notification({
                        user: user._id,
                        evenement: event._id,
                        message: `Rappel : L’événement "${event.nom}" aura lieu bientôt !`,
                        type: "rappel"
                    });
                    await notif.save();
                }
            }
        }

        console.log(`🔔 Notifications générées pour ${evenements.length} événements.`);
    } catch (error) {
        console.error("Erreur lors de la génération des notifications automatiques :", error);
    }
});
