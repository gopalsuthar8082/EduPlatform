const mongoose = require('mongoose');

const PollOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Poll option text is required'],
    trim: true
  },
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const PollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Poll question is required'],
      trim: true,
      maxlength: [300, 'Poll question cannot exceed 300 characters']
    },
    options: [PollOptionSchema],
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture'
    },
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discussion'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Poll creator is required']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date
    },
    totalVotes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
PollSchema.index({ course: 1, lecture: 1 });
PollSchema.index({ createdBy: 1 });
PollSchema.index({ isActive: 1, expiresAt: 1 });

module.exports = mongoose.model('Poll', PollSchema);
