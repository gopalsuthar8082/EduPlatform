const mongoose = require('mongoose');
const { ENROLLMENT_STATUS } = require('../config/constants');

const EnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for enrollment']
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required for enrollment']
    },
    completedTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
      }
    ],
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
      }
    ],
    completedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      }
    ],
    overallProgress: {
      type: Number, // Percentage 0 - 100
      default: 0,
      min: 0,
      max: 100
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ENROLLMENT_STATUS),
        message: '{VALUE} is not a valid enrollment status'
      },
      default: ENROLLMENT_STATUS.ACTIVE
    }
  },
  {
    timestamps: true
  }
);

// Compound Unique Index: One enrollment record per user per course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
EnrollmentSchema.index({ user: 1, status: 1 });
EnrollmentSchema.index({ course: 1, status: 1 });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
