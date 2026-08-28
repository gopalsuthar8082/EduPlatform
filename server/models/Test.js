const mongoose = require('mongoose');
const { CONTENT_STATUS, TEST_TYPES } = require('../config/constants');

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Section name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }
  ],
  duration: {
    type: Number, // Section duration in minutes (if section-timed)
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  instructions: {
    type: String,
    default: ''
  }
});

const TestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide test title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: {
        values: Object.values(TEST_TYPES),
        message: '{VALUE} is not a valid test type'
      },
      default: TEST_TYPES.FULL_MOCK
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    sections: [SectionSchema],
    totalQuestions: {
      type: Number,
      default: 0
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number, // Overall duration in minutes
      default: 180
    },
    negativeMarkingRule: {
      enabled: {
        type: Boolean,
        default: false
      },
      percentage: {
        type: Number,
        default: 25 // 25% negative marking
      },
      fixed: {
        type: Number,
        default: 0
      }
    },
    instructions: {
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
    scheduledAt: {
      type: Date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Test creator is required']
    },
    maxAttempts: {
      type: Number,
      default: 0 // 0 means unlimited
    }
  },
  {
    timestamps: true
  }
);

// Indexes
TestSchema.index({ type: 1 });
TestSchema.index({ course: 1, subject: 1 });
TestSchema.index({ status: 1 });
TestSchema.index({ scheduledAt: 1 });
TestSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Test', TestSchema);
