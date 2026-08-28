const mongoose = require('mongoose');
const { DISCUSSION_STATUS } = require('../config/constants');

const DiscussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a discussion title'],
      trim: true,
      maxlength: [250, 'Title cannot exceed 250 characters']
    },
    body: {
      type: String,
      required: [true, 'Please provide discussion content']
    },
    bodyHtml: {
      type: String
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Discussion author is required']
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    },
    relatedContent: {
      contentType: {
        type: String,
        enum: ['lecture', 'study_material', 'question', 'quiz', 'test', 'general']
      },
      contentId: {
        type: mongoose.Schema.Types.ObjectId
      }
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
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
    replyCount: {
      type: Number,
      default: 0
    },
    isAnswered: {
      type: Boolean,
      default: false
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isClosed: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DISCUSSION_STATUS),
        message: '{VALUE} is not a valid discussion status'
      },
      default: DISCUSSION_STATUS.ACTIVE
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
DiscussionSchema.index({ author: 1 });
DiscussionSchema.index({ course: 1, subject: 1, chapter: 1 });
DiscussionSchema.index({ status: 1, isPinned: -1, createdAt: -1 });
DiscussionSchema.index({ tags: 1 });

// Virtual for replies
DiscussionSchema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'discussion',
  justOne: false
});

module.exports = mongoose.model('Discussion', DiscussionSchema);
