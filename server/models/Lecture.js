const mongoose = require('mongoose');
const { CONTENT_STATUS } = require('../config/constants');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'pdf'
  }
});

const LectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a lecture title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      default: ''
    },
    videoUrl: {
      type: String,
      required: [true, 'Please provide a video URL or stream path']
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
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
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    order: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CONTENT_STATUS),
        message: '{VALUE} is not a valid content status'
      },
      default: CONTENT_STATUS.DRAFT
    },
    resources: [ResourceSchema],
    notes: {
      type: String,
      default: ''
    },
    aiSummary: {
      type: String,
      default: ''
    },
    keyPoints: [
      {
        type: String
      }
    ],
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
LectureSchema.index({ course: 1, subject: 1, chapter: 1, topic: 1 });
LectureSchema.index({ instructor: 1 });
LectureSchema.index({ status: 1 });
LectureSchema.index({ order: 1 });

module.exports = mongoose.model('Lecture', LectureSchema);
