const express = require("express");
const {
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    getInvitationsByEvent,
    getInvitationsByEmail
} = require("../controllers/invitationController");
const router = express.Router();

router.post("/", sendInvitation); // /api/invitations
router.get("/accept/:id", acceptInvitation);
router.get("/decline/:id", declineInvitation);
router.get("/event/:eventId", getInvitationsByEvent);
router.get("/user/:email", getInvitationsByEmail);

module.exports = router;

