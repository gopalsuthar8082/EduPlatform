const mongoose = require('mongoose');
const { CONTENT_STATUS } = require('../config/constants');

const QuestionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide question paper title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    exam: {
      type: String,
      trim: true
    },
    year: {
      type: String,
      trim: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    category: {
      type: String,
      trim: true
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }
    ],
    totalMarks: {
      type: Number,
      default: 100
    },
    duration: {
      type: Number, // in minutes
      default: 180
    },
    solutionUrl: {
      type: String,
      default: ''
    },
    paperUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CONTENT_STATUS),
        message: '{VALUE} is not a valid status'
      },
      default: CONTENT_STATUS.DRAFT
    },
    type: {
      type: String,
      enum: ['previous_year', 'mock', 'practice'],
      default: 'practice'
    },
    instructions: {
      type: String,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Question paper creator is required']
    }
  },
  {
    timestamps: true
  }
);

// Indexes
QuestionPaperSchema.index({ exam: 1, year: 1 });
QuestionPaperSchema.index({ type: 1 });
QuestionPaperSchema.index({ status: 1 });
QuestionPaperSchema.index({ subject: 1, course: 1 });

module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema);
