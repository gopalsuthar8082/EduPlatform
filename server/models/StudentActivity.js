const mongoose = require('mongoose');
const { ACTIVITY_TYPES } = require('../config/constants');

const StudentActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for activity logging']
    },
    activityType: {
      type: String,
      enum: {
        values: Object.values(ACTIVITY_TYPES),
        message: '{VALUE} is not a valid activity type'
      },
      required: [true, 'Activity type is required']
    },
    contentType: {
      type: String,
      default: ''
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    duration: {
      type: Number, // Duration in seconds spent on activity
      default: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

// Indexes for high-throughput activity timeline querying and streak computation
StudentActivitySchema.index({ user: 1, timestamp: -1 });
StudentActivitySchema.index({ activityType: 1, timestamp: -1 });
StudentActivitySchema.index({ user: 1, activityType: 1 });

module.exports = mongoose.model('StudentActivity', StudentActivitySchema);
