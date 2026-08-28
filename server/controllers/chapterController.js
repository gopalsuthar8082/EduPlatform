const mongoose = require('mongoose');
const slugify = require('slugify');
const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const Topic = require('../models/Topic');
const { ErrorResponse } = require('../middleware/errorHandler');
const { getPagination, formatPagination } = require('../utils/pagination');

/**
 * @desc    Get chapters with filtering by subject/course, search, and sorting
 * @route   GET /api/chapters
 * @access  Public
 */
const getChapters = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 20, 100);
    const { subject, course, search, isActive, sort } = req.query;

    const filter = {};

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

    const total = await Chapter.countDocuments(filter);
    const chapters = await Chapter.find(filter)
      .populate('subject', 'name slug')
      .populate('course', 'title slug')
      .populate({
        path: 'topics',
        match: { isActive: true },
        options: { sort: { order: 1 } },
        select: 'name slug order isActive'
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: chapters.length,
      pagination: formatPagination(total, page, limit),
      data: chapters
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single chapter by ID or Slug with populated topics
 * @route   GET /api/chapters/:id
 * @access  Public
 */
const getChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const query = isObjectId ? { _id: id } : { slug: id };

    const chapter = await Chapter.findOne(query)
      .populate('subject', 'name slug course')
      .populate('course', 'title slug')
      .populate({
        path: 'topics',
        match: { isActive: true },
        options: { sort: { order: 1 } },
        populate: [
          {
            path: 'materials',
            match: { status: 'published' },
            select: 'title type fileUrl fileSize viewCount'
          },
          {
            path: 'lectures',
            match: { status: 'published' },
            select: 'title duration videoUrl thumbnail order'
          }
        ]
      });

    if (!chapter) {
      return next(new ErrorResponse('Chapter not found', 404));
    }

    res.status(200).json({
      success: true,
      data: chapter
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new chapter
 * @route   POST /api/chapters
 * @access  Private (Admin, Content Manager, Instructor)
 */
const createChapter = async (req, res, next) => {
  try {
    const { name, description, subject, course, order, isActive } = req.body;

    if (!name || !subject) {
      return next(
        new ErrorResponse('Please provide chapter name and subject ID', 400)
      );
    }

    // Verify subject exists
    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return next(new ErrorResponse('Associated subject does not exist', 404));
    }

    // Determine course ID
    const courseId = course || subjectDoc.course;

    // Verify course exists
    const courseDoc = await Course.findById(courseId);
    if (!courseDoc) {
      return next(new ErrorResponse('Associated course does not exist', 404));
    }

    const slug = slugify(name, { lower: true, strict: true });

    const chapter = await Chapter.create({
      name: name.trim(),
      slug,
      description: description || '',
      subject,
      course: courseId,
      order: order !== undefined ? order : 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const populatedChapter = await Chapter.findById(chapter._id)
      .populate('subject', 'name slug')
      .populate('course', 'title slug');

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      data: populatedChapter
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update chapter details
 * @route   PUT /api/chapters/:id
 * @access  Private (Admin, Content Manager, Instructor)
 */
const updateChapter = async (req, res, next) => {
  try {
    let chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return next(new ErrorResponse('Chapter not found', 404));
    }

    // If name is updated, re-slugify
    if (req.body.name && req.body.name !== chapter.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('subject', 'name slug')
      .populate('course', 'title slug');

    res.status(200).json({
      success: true,
      message: 'Chapter updated successfully',
      data: chapter
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete chapter and its topics
 * @route   DELETE /api/chapters/:id
 * @access  Private (Admin, Content Manager)
 */
const deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return next(new ErrorResponse('Chapter not found', 404));
    }

    // Delete topics under this chapter
    await Topic.deleteMany({ chapter: chapter._id });

    // Delete chapter
    await Chapter.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Chapter and associated topics deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter
};
