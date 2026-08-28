const express = require('express');
const router = express.Router();
const {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  upvoteDiscussion,
  downvoteDiscussion,
  markReplyHelpful
} = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

// Voting & interaction routes
router.put('/:id/upvote', protect, upvoteDiscussion);
router.put('/:id/downvote', protect, downvoteDiscussion);
router.post('/:id/reply', protect, addReply);
router.put('/:id/replies/:replyId/helpful', protect, markReplyHelpful);

// CRUD routes
router
  .route('/')
  .get(getDiscussions)
  .post(protect, createDiscussion);

router
  .route('/:id')
  .get(getDiscussion)
  .put(protect, updateDiscussion)
  .delete(protect, deleteDiscussion);

module.exports = router;
