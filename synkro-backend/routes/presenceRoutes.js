const express = require("express");
const router = express.Router();
const { markPresence, getPresenceByEvent } = require("../controllers/presenceController");

router.post("/", markPresence);
router.get("/event/:eventId", getPresenceByEvent);

module.exports = router;
