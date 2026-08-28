const mongoose = require('mongoose');
const { ANNOUNCEMENT_AUDIENCE, ANNOUNCEMENT_PRIORITY } = require('../config/constants');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an announcement title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    body: {
      type: String,
      required: [true, 'Please provide announcement body']
    },
    bodyHtml: {
      type: String
    },
    targetAudience: {
      type: String,
      enum: {
        values: Object.values(ANNOUNCEMENT_AUDIENCE),
        message: '{VALUE} is not a valid target audience'
      },
      default: ANNOUNCEMENT_AUDIENCE.ALL
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    targetRole: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Announcement creator is required']
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(ANNOUNCEMENT_PRIORITY),
        message: '{VALUE} is not a valid priority'
      },
      default: ANNOUNCEMENT_PRIORITY.NORMAL
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
AnnouncementSchema.index({ targetAudience: 1, isActive: 1, createdAt: -1 });
AnnouncementSchema.index({ course: 1 });
AnnouncementSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
