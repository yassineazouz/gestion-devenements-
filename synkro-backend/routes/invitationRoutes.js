const express = require("express");
const router = express.Router();
const {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  getInvitationsByEvent,
  getInvitationsByEmail
} = require("../controllers/invitationController");

router.post("/", sendInvitation);
router.get("/accept/:id", acceptInvitation);
router.get("/decline/:id", declineInvitation);
router.get("/event/:eventId", getInvitationsByEvent);
router.get("/user/:email", getInvitationsByEmail);

module.exports = router;
