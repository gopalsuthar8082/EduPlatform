const mongoose = require('mongoose');
const { BOOKMARK_TYPES } = require('../config/constants');

const BookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for bookmarking']
    },
    contentType: {
      type: String,
      enum: {
        values: Object.values(BOOKMARK_TYPES),
        message: '{VALUE} is not a valid bookmark content type'
      },
      required: [true, 'Content type is required']
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Content ID is required'],
      refPath: 'contentModel'
    },
    contentModel: {
      type: String,
      enum: ['Question', 'StudyMaterial', 'Lecture', 'Discussion']
    },
    note: {
      type: String,
      default: '',
      maxlength: [1000, 'Note cannot exceed 1000 characters']
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// Map contentType to Model Name before saving
BookmarkSchema.pre('save', function (next) {
  const modelMap = {
    question: 'Question',
    study_material: 'StudyMaterial',
    lecture: 'Lecture',
    discussion: 'Discussion'
  };
  if (this.contentType && modelMap[this.contentType]) {
    this.contentModel = modelMap[this.contentType];
  }
  next();
});

// Compound Unique Index: Prevent duplicate bookmarks for the same content
BookmarkSchema.index({ user: 1, contentType: 1, contentId: 1 }, { unique: true });
BookmarkSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
