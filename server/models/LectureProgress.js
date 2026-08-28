const mongoose = require('mongoose');

const LectureProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      required: [true, 'Lecture ID is required']
    },
    watchedDuration: {
      type: Number, // in seconds
      default: 0
    },
    totalDuration: {
      type: Number, // in seconds
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastPosition: {
      type: Number, // playback timestamp in seconds
      default: 0
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound Unique Index: One progress record per user per lecture
LectureProgressSchema.index({ user: 1, lecture: 1 }, { unique: true });

// Pre-save hook to calculate completion percentage
LectureProgressSchema.pre('save', function (next) {
  if (this.totalDuration > 0) {
    this.completionPercentage = Math.min(
      100,
      Math.round((this.watchedDuration / this.totalDuration) * 100)
    );
    if (this.completionPercentage >= 90) {
      this.isCompleted = true;
    }
  }
  next();
});

module.exports = mongoose.model('LectureProgress', LectureProgressSchema);
