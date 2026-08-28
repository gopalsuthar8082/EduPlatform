const mongoose = require('mongoose');
const slugify = require('slugify');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const StudyMaterial = require('../models/StudyMaterial');
const Lecture = require('../models/Lecture');
const Quiz = require('../models/Quiz');
const { ErrorResponse } = require('../middleware/errorHandler');
const { CONTENT_STATUS } = require('../config/constants');
const { getPagination, formatPagination } = require('../utils/pagination');

/**
 * @desc    Get topics with filtering by chapter/subject/course, search, and sorting
 * @route   GET /api/topics
 * @access  Public
 */
const getTopics = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 20, 100);
    const { chapter, subject, course, search, isActive, sort } = req.query;

    const filter = {};

    // Filter by Chapter
    if (chapter && mongoose.Types.ObjectId.isValid(chapter)) {
      filter.chapter = chapter;
    }

    // Filter by Subject
    if (subject && mongoose.Types.ObjectId.isValid(subject)) {
      filter.subject = subject;
    }

    // Filter by Course
    if (course && mongoose.Types.ObjectId.isValid(course)) {
      filter.course = course;
    }

    // Filter by isActive
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Search by name
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Sorting
    let sortOption = { order: 1, createdAt: 1 };
    if (sort) {
      if (sort === 'name_asc') sortOption = { name: 1 };
      else if (sort === 'name_desc') sortOption = { name: -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'order') sortOption = { order: 1 };
    }

    const total = await Topic.countDocuments(filter);
    const topics = await Topic.find(filter)
      .populate('chapter', 'name slug')
      .populate('subject', 'name slug')
      .populate('course', 'title slug')
      .populate({
        path: 'materials',
        match: { status: CONTENT_STATUS.PUBLISHED },
        select: 'title type fileUrl fileSize viewCount'
      })
      .populate({
        path: 'lectures',
        match: { status: CONTENT_STATUS.PUBLISHED },
        select: 'title duration videoUrl thumbnail order'
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: topics.length,
      pagination: formatPagination(total, page, limit),
      data: topics
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single topic by ID or Slug with study materials, lectures, and quizzes
 * @route   GET /api/topics/:id
 * @access  Public
 */
const getTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const query = isObjectId ? { _id: id } : { slug: id };

    const topic = await Topic.findOne(query)
      .populate('chapter', 'name slug subject course')
      .populate('subject', 'name slug course')
      .populate('course', 'title slug instructor');

    if (!topic) {
      return next(new ErrorResponse('Topic not found', 404));
    }

    // Fetch related materials
    const materials = await StudyMaterial.find({
      topic: topic._id,
      status: CONTENT_STATUS.PUBLISHED
    })
      .populate('uploadedBy', 'name avatar')
      .sort({ createdAt: -1 });

    // Fetch related lectures
    const lectures = await Lecture.find({
      topic: topic._id,
      status: CONTENT_STATUS.PUBLISHED
    })
      .populate('instructor', 'name avatar')
      .sort({ order: 1 });

    // Fetch related quizzes
    const quizzes = await Quiz.find({
      topic: topic._id,
      isPublished: true
    }).select('title description duration totalQuestions totalMarks passingMarks');

    res.status(200).json({
      success: true,
      data: {
        ...topic.toObject(),
        materials,
        lectures,
        quizzes
      },
      materials,
      lectures,
      quizzes
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new topic
 * @route   POST /api/topics
 * @access  Private (Admin, Content Manager, Instructor)
 */
const createTopic = async (req, res, next) => {
  try {
    const { name, description, chapter, subject, course, order, isActive } =
      req.body;

    if (!name || !chapter) {
      return next(
        new ErrorResponse('Please provide topic name and chapter ID', 400)
      );
    }

    // Verify chapter exists
    const chapterDoc = await Chapter.findById(chapter);
    if (!chapterDoc) {
      return next(new ErrorResponse('Associated chapter does not exist', 404));
    }

    // Inherit subject & course from chapter if not provided
    const subjectId = subject || chapterDoc.subject;
    const courseId = course || chapterDoc.course;

    const slug = slugify(name, { lower: true, strict: true });

    const topic = await Topic.create({
      name: name.trim(),
      slug,
      description: description || '',
      chapter,
      subject: subjectId,
      course: courseId,
      order: order !== undefined ? order : 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const populatedTopic = await Topic.findById(topic._id)
      .populate('chapter', 'name slug')
      .populate('subject', 'name slug')
      .populate('course', 'title slug');

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: populatedTopic
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update topic details
 * @route   PUT /api/topics/:id
 * @access  Private (Admin, Content Manager, Instructor)
 */
const updateTopic = async (req, res, next) => {
  try {
    let topic = await Topic.findById(req.params.id);

    if (!topic) {
      return next(new ErrorResponse('Topic not found', 404));
    }

    // If name is updated, re-slugify
    if (req.body.name && req.body.name !== topic.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('chapter', 'name slug')
      .populate('subject', 'name slug')
      .populate('course', 'title slug');

    res.status(200).json({
      success: true,
      message: 'Topic updated successfully',
      data: topic
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete topic
 * @route   DELETE /api/topics/:id
 * @access  Private (Admin, Content Manager)
 */
const deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return next(new ErrorResponse('Topic not found', 404));
    }

    await Topic.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Topic deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTopics,
  getTopic,
  createTopic,
  updateTopic,
  deleteTopic
};
