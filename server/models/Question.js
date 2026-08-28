const mongoose = require('mongoose');
const { QUESTION_TYPES, DIFFICULTY_LEVELS, CONTENT_STATUS } = require('../config/constants');

const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Option text is required']
  },
  optionHtml: {
    type: String
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

const QuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Please provide question text']
    },
    questionHtml: {
      type: String
    },
    type: {
      type: String,
      enum: {
        values: Object.values(QUESTION_TYPES),
        message: '{VALUE} is not a valid question type'
      },
      required: [true, 'Please specify question type']
    },
    options: [OptionSchema],
    correctAnswer: {
      type: String,
      default: ''
    },
    explanation: {
      type: String,
      default: ''
    },
    solutionHtml: {
      type: String
    },
    difficulty: {
      type: String,
      enum: {
        values: Object.values(DIFFICULTY_LEVELS),
        message: '{VALUE} is not a valid difficulty level'
      },
      default: DIFFICULTY_LEVELS.MEDIUM
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
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    exam: {
      type: String,
      trim: true
    },
    year: {
      type: String,
      trim: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    marks: {
      type: Number,
      default: 1,
      min: [0, 'Marks cannot be negative']
    },
    negativeMarks: {
      type: Number,
      default: 0,
      min: [0, 'Negative marks cannot be less than 0']
    },
    timeSuggested: {
      type: Number, // in seconds
      default: 60
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Question creator is required']
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CONTENT_STATUS),
        message: '{VALUE} is not a valid status'
      },
      default: CONTENT_STATUS.DRAFT
    },
    stats: {
      totalAttempts: {
        type: Number,
        default: 0
      },
      correctAttempts: {
        type: Number,
        default: 0
      },
      avgTime: {
        type: Number, // in seconds
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
QuestionSchema.index({ type: 1 });
QuestionSchema.index({ difficulty: 1 });
QuestionSchema.index({ subject: 1, chapter: 1, topic: 1 });
QuestionSchema.index({ exam: 1, year: 1 });
QuestionSchema.index({ status: 1 });
QuestionSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
