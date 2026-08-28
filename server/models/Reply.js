const mongoose = require('mongoose');
const { DISCUSSION_STATUS } = require('../config/constants');

const ReplySchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Reply body cannot be empty']
    },
    bodyHtml: {
      type: String
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reply author is required']
    },
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discussion',
      required: [true, 'Associated discussion thread is required']
    },
    parentReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
      default: null
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isInstructorReply: {
      type: Boolean,
      default: false
    },
    isMarkedHelpful: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DISCUSSION_STATUS),
        message: '{VALUE} is not a valid reply status'
      },
      default: DISCUSSION_STATUS.ACTIVE
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ReplySchema.index({ discussion: 1, createdAt: 1 });
ReplySchema.index({ author: 1 });
ReplySchema.index({ parentReply: 1 });

module.exports = mongoose.model('Reply', ReplySchema);
