const mongoose = require('mongoose');
const { CONTENT_STATUS, STUDY_MATERIAL_TYPES } = require('../config/constants');

const StudyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the study material'],
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
        values: Object.values(STUDY_MATERIAL_TYPES),
        message: '{VALUE} is not a valid material type'
      },
      required: [true, 'Please specify the material type (pdf, ppt, notes, doc)']
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide the file URL or upload a file']
    },
    fileName: {
      type: String,
      default: ''
    },
    fileSize: {
      type: Number, // in bytes
      default: 0
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
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Material must record the uploader']
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CONTENT_STATUS),
        message: '{VALUE} is not a valid content status'
      },
      default: CONTENT_STATUS.DRAFT
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    aiSummary: {
      type: String,
      default: ''
    },
    keyPoints: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

// Indexes
StudyMaterialSchema.index({ course: 1, subject: 1, chapter: 1, topic: 1 });
StudyMaterialSchema.index({ type: 1 });
StudyMaterialSchema.index({ status: 1 });
StudyMaterialSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('StudyMaterial', StudyMaterialSchema);
