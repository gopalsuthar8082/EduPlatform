const mongoose = require('mongoose');
const slugify = require('slugify');
const { CONTENT_STATUS, COURSE_DIFFICULTY } = require('../config/constants');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      unique: true,
      trim: true,
      maxlength: [150, 'Course title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      default: '',
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
    },
    category: {
      type: String,
      required: [true, 'Please provide a category for this course'],
      trim: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Course must have an assigned instructor']
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CONTENT_STATUS),
        message: '{VALUE} is not a valid content status'
      },
      default: CONTENT_STATUS.DRAFT
    },
    difficulty: {
      type: String,
      enum: {
        values: Object.values(COURSE_DIFFICULTY),
        message: '{VALUE} is not a valid difficulty'
      },
      default: COURSE_DIFFICULTY.BEGINNER
    },
    duration: {
      type: String,
      default: '0 hours'
    },
    prerequisites: [
      {
        type: String,
        trim: true
      }
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5'],
        set: (val) => Math.round(val * 10) / 10
      },
      count: {
        type: Number,
        default: 0
      }
    },
    enrollmentCount: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Slugify title before saving
CourseSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Synchronize isPublished with status
  if (this.isModified('status')) {
    this.isPublished = this.status === CONTENT_STATUS.PUBLISHED;
  }

  next();
});

// Virtual populate for subjects
CourseSchema.virtual('subjects', {
  ref: 'Subject',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});

module.exports = mongoose.model('Course', CourseSchema);
