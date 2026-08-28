const express = require('express');
const router = express.Router();
const {
  getPolls,
  getPoll,
  createPoll,
  votePoll
} = require('../controllers/pollController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { USER_ROLES } = require('../config/constants');

const staffRoles = [
  USER_ROLES.SUPERADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.INSTRUCTOR
];

router.post('/:id/vote', protect, votePoll);

router
  .route('/')
  .get(getPolls)
  .post(protect, authorize(...staffRoles), createPoll);

router.route('/:id').get(getPoll);

module.exports = router;
