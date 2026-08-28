const mongoose = require('mongoose');
const { ATTEMPT_STATUS } = require('../config/constants');

const TestAnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  sectionName: {
    type: String,
    default: 'General'
  },
  selectedOption: [
    {
      type: Number
    }
  ],
  textAnswer: {
    type: String,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  marksObtained: {
    type: Number,
    default: 0
  },
  negativeMarksApplied: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  markedForReview: {
    type: Boolean,
    default: false
  },
  visited: {
    type: Boolean,
    default: false
  }
});

const SectionResultSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  correctCount: {
    type: Number,
    default: 0
  },
  incorrectCount: {
    type: Number,
    default: 0
  },
  skippedCount: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number,
    default: 0
  }
});

const TestAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for test attempt']
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: [true, 'Test is required for attempt']
    },
    answers: [TestAnswerSchema],
    score: {
      type: Number,
      default: 0
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    correctCount: {
      type: Number,
      default: 0
    },
    incorrectCount: {
      type: Number,
      default: 0
    },
    skippedCount: {
      type: Number,
      default: 0
    },
    timeTaken: {
      type: Number, // total duration taken in seconds
      default: 0
    },
    sectionWiseResults: [SectionResultSchema],
    rank: {
      type: Number
    },
    percentile: {
      type: Number,
      min: 0,
      max: 100
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ATTEMPT_STATUS),
        message: '{VALUE} is not a valid attempt status'
      },
      default: ATTEMPT_STATUS.IN_PROGRESS
    }
  },
  {
    timestamps: true
  }
);

// Indexes
TestAttemptSchema.index({ user: 1, test: 1 });
TestAttemptSchema.index({ test: 1, score: -1 });
TestAttemptSchema.index({ user: 1, status: 1 });
TestAttemptSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TestAttempt', TestAttemptSchema);
