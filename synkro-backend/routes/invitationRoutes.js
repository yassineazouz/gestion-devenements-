const express = require('express');
const router = express.Router();
const {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  getInvitationsByEvent,
  getInvitationsByEmail,
  removeInvitationById,
  getUserInvitations
} = require('../controllers/invitationController');

router.post('/', sendInvitation);
router.post('/:id/accept', acceptInvitation);   // ✅ This must exist
router.post('/:id/decline', declineInvitation); // ✅ This must exist
router.get('/event/:eventId', getInvitationsByEvent);
router.get('/email/:email', getInvitationsByEmail);
router.delete('/:id/',removeInvitationById); // ✅ Add this

router.get('/users/:id/invitations', getUserInvitations);

module.exports = router;
