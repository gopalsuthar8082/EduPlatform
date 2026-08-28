const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

const staffRoles = [
  USER_ROLES.SUPERADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.INSTRUCTOR
];

// Allow both public/authenticated browsing (optional auth middleware pattern or protect)
// We can use a loose protect or protect for all
router
  .route('/')
  .get(protect, getAnnouncements)
  .post(protect, authorize(...staffRoles), createAnnouncement);

router
  .route('/:id')
  .put(protect, authorize(...staffRoles), updateAnnouncement)
  .delete(protect, authorize(...staffRoles), deleteAnnouncement);

module.exports = router;
