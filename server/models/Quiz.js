const mongoose = require('mongoose');
const { CONTENT_STATUS, QUIZ_TYPES, SHOW_ANSWERS_OPTIONS } = require('../config/constants');

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide quiz title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      default: ''
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
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }
    ],
    duration: {
      type: Number, // in minutes
      default: 30
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    passingMarks: {
      type: Number,
      default: 0
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    showAnswers: {
      type: String,
      enum: {
        values: Object.values(SHOW_ANSWERS_OPTIONS),
        message: '{VALUE} is not a valid showAnswers option'
      },
      default: SHOW_ANSWERS_OPTIONS.AFTER_SUBMIT
    },
    maxAttempts: {
      type: Number,
      default: 0 // 0 means unlimited
    },
    isTimeLimited: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CONTENT_STATUS),
        message: '{VALUE} is not a valid status'
      },
      default: CONTENT_STATUS.DRAFT
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Quiz creator is required']
    },
    quizType: {
      type: String,
      enum: {
        values: Object.values(QUIZ_TYPES),
        message: '{VALUE} is not a valid quiz type'
      },
      default: QUIZ_TYPES.PRACTICE
    }
  },
  {
    timestamps: true
  }
);

// Indexes
QuizSchema.index({ course: 1, subject: 1, chapter: 1, topic: 1 });
QuizSchema.index({ quizType: 1 });
QuizSchema.index({ status: 1 });
QuizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', QuizSchema);
