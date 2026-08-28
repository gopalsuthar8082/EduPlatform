const mongoose = require('mongoose');
const slugify = require('slugify');

const ChapterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a chapter name'],
      trim: true,
      maxlength: [120, 'Chapter name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      lowercase: true
    },
    description: {
      type: String,
      default: ''
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Chapter must belong to a subject']
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Chapter must belong to a course']
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Slugify name before saving
ChapterSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Virtual populate for topics
ChapterSchema.virtual('topics', {
  ref: 'Topic',
  localField: '_id',
  foreignField: 'chapter',
  justOne: false
});

module.exports = mongoose.model('Chapter', ChapterSchema);
