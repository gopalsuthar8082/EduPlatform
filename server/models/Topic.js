const mongoose = require('mongoose');
const slugify = require('slugify');

const TopicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a topic name'],
      trim: true,
      maxlength: [150, 'Topic name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      lowercase: true
    },
    description: {
      type: String,
      default: ''
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: [true, 'Topic must belong to a chapter']
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Topic must belong to a subject']
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Topic must belong to a course']
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
TopicSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Virtual populate for study materials
TopicSchema.virtual('materials', {
  ref: 'StudyMaterial',
  localField: '_id',
  foreignField: 'topic',
  justOne: false
});

// Virtual populate for lectures
TopicSchema.virtual('lectures', {
  ref: 'Lecture',
  localField: '_id',
  foreignField: 'topic',
  justOne: false
});

module.exports = mongoose.model('Topic', TopicSchema);
