const mongoose = require('mongoose');

const QuizAnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
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
  timeTaken: {
    type: Number, // in seconds
    default: 0
  }
});

const QuizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for attempt']
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz is required for attempt']
    },
    answers: [QuizAnswerSchema],
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
    timeTaken: {
      type: Number, // total time taken in seconds
      default: 0
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
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
QuizAttemptSchema.index({ user: 1, quiz: 1 });
QuizAttemptSchema.index({ user: 1, status: 1 });
QuizAttemptSchema.index({ createdAt: -1 });

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
