const { QuestionPaper, Question } = require('../models');
const { ErrorResponse } = require('../middleware/errorHandler');
const { CONTENT_STATUS } = require('../config/constants');

/**
 * @desc    Get all question papers with filters & pagination
 * @route   GET /api/question-papers
 * @access  Public / Authenticated
 */
const getQuestionPapers = async (req, res, next) => {
  try {
    const {
      exam,
      subject,
      year,
      course,
      type,
      category,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (exam) query.exam = new RegExp(`^${exam}$`, 'i');
    if (subject) query.subject = subject;
    if (year) query.year = year;
    if (course) query.course = course;
    if (type) query.type = type;
    if (category) query.category = new RegExp(category, 'i');
    if (status) query.status = status;

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Default: students/unauthenticated only see published
    if (!req.user || req.user.role === 'student') {
      query.status = CONTENT_STATUS.PUBLISHED;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await QuestionPaper.countDocuments(query);

    const papers = await QuestionPaper.find(query)
      .populate('subject', 'name slug')
      .populate('course', 'title slug')
      .populate('createdBy', 'name email avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: papers.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      data: papers
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single question paper by ID
 * @route   GET /api/question-papers/:id
 * @access  Public / Authenticated
 */
const getQuestionPaper = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id)
      .populate({
        path: 'questions',
        populate: [
          { path: 'subject', select: 'name' },
          { path: 'chapter', select: 'title' },
          { path: 'topic', select: 'title' }
        ]
      })
      .populate('subject', 'name')
      .populate('course', 'title')
      .populate('createdBy', 'name email avatar');

    if (!paper) {
      return next(new ErrorResponse(`Question paper not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new question paper
 * @route   POST /api/question-papers
 * @access  Private (Admin, Instructor, Question Manager)
 */
const createQuestionPaper = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    // If questions array is provided but totalMarks not set, calculate from questions
    if (req.body.questions && Array.isArray(req.body.questions) && !req.body.totalMarks) {
      const questionsData = await Question.find({ _id: { $in: req.body.questions } }).select('marks');
      const calculatedMarks = questionsData.reduce((acc, q) => acc + (q.marks || 1), 0);
      req.body.totalMarks = calculatedMarks || 100;
    }

    const paper = await QuestionPaper.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Question paper created successfully',
      data: paper
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update question paper
 * @route   PUT /api/question-papers/:id
 * @access  Private (Admin, Instructor, Question Manager)
 */
const updateQuestionPaper = async (req, res, next) => {
  try {
    let paper = await QuestionPaper.findById(req.params.id);

    if (!paper) {
      return next(new ErrorResponse(`Question paper not found with id ${req.params.id}`, 404));
    }

    paper = await QuestionPaper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Question paper updated successfully',
      data: paper
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete question paper
 * @route   DELETE /api/question-papers/:id
 * @access  Private (Admin, Instructor, Question Manager)
 */
const deleteQuestionPaper = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);

    if (!paper) {
      return next(new ErrorResponse(`Question paper not found with id ${req.params.id}`, 404));
    }

    await QuestionPaper.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Question paper deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuestionPapers,
  getQuestionPaper,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper
};
