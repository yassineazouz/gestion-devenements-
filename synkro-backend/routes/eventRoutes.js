const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware"); // 🛡️

router.post("/", protect, createEvent);
router.get("/", protect, getAllEvents);
router.get("/:id", protect, getEventById);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
