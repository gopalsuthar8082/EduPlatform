const mongoose = require('mongoose');
const slugify = require('slugify');
const Subject = require('../models/Subject');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const { ErrorResponse } = require('../middleware/errorHandler');
const { getPagination, formatPagination } = require('../utils/pagination');

/**
 * @desc    Get subjects with filtering by course, search, and sorting
 * @route   GET /api/subjects
 * @access  Public
 */
const getSubjects = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 20, 100);
    const { course, search, isActive, sort } = req.query;

    const filter = {};

    // Filter by Course
    if (course && mongoose.Types.ObjectId.isValid(course)) {
      filter.course = course;
    }

    // Filter by isActive
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Search by name or description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Sorting: default by order ascending
    let sortOption = { order: 1, createdAt: 1 };
    if (sort) {
      if (sort === 'name_asc') sortOption = { name: 1 };
      else if (sort === 'name_desc') sortOption = { name: -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'order') sortOption = { order: 1 };
    }

    const total = await Subject.countDocuments(filter);
    const subjects = await Subject.find(filter)
      .populate('course', 'title slug category thumbnail')
      .populate({
        path: 'chapters',
        match: { isActive: true },
        options: { sort: { order: 1 } },
        select: 'name slug order isActive'
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: subjects.length,
      pagination: formatPagination(total, page, limit),
      data: subjects
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single subject by ID or Slug with populated chapters and topics
 * @route   GET /api/subjects/:id
 * @access  Public
 */
const getSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const query = isObjectId ? { _id: id } : { slug: id };

    const subject = await Subject.findOne(query)
      .populate('course', 'title slug category instructor thumbnail')
      .populate({
        path: 'chapters',
        match: { isActive: true },
        options: { sort: { order: 1 } },
        populate: {
          path: 'topics',
          match: { isActive: true },
          options: { sort: { order: 1 } }
        }
      });

    if (!subject) {
      return next(new ErrorResponse('Subject not found', 404));
    }

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new subject
 * @route   POST /api/subjects
 * @access  Private (Admin, Content Manager, Instructor)
 */
const createSubject = async (req, res, next) => {
  try {
    const { name, description, course, order, isActive } = req.body;

    if (!name || !course) {
      return next(
        new ErrorResponse('Please provide subject name and course ID', 400)
      );
    }

    // Verify course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return next(new ErrorResponse('Associated course does not exist', 404));
    }

    const slug = slugify(name, { lower: true, strict: true });

    const subject = await Subject.create({
      name: name.trim(),
      slug,
      description: description || '',
      course,
      order: order !== undefined ? order : 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const populatedSubject = await Subject.findById(subject._id).populate(
      'course',
      'title slug'
    );

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: populatedSubject
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update subject details
 * @route   PUT /api/subjects/:id
 * @access  Private (Admin, Content Manager, Instructor)
 */
const updateSubject = async (req, res, next) => {
  try {
    let subject = await Subject.findById(req.params.id);

    if (!subject) {
      return next(new ErrorResponse('Subject not found', 404));
    }

    // If name is updated, update slug
    if (req.body.name && req.body.name !== subject.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('course', 'title slug');

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a subject and cascade delete chapters/topics
 * @route   DELETE /api/subjects/:id
 * @access  Private (Admin, Content Manager)
 */
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return next(new ErrorResponse('Subject not found', 404));
    }

    // Find all chapters under this subject
    const chapters = await Chapter.find({ subject: subject._id });
    const chapterIds = chapters.map((c) => c._id);

    // Delete topics under these chapters
    await Topic.deleteMany({ chapter: { $in: chapterIds } });

    // Delete chapters
    await Chapter.deleteMany({ subject: subject._id });

    // Delete subject
    await Subject.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Subject and associated chapters/topics deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
};
