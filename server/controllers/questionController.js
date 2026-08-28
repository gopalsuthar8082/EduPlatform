const { Question, Bookmark, QuizAttempt, TestAttempt } = require('../models');
const { ErrorResponse } = require('../middleware/errorHandler');
const { QUESTION_TYPES, CONTENT_STATUS } = require('../config/constants');

/**
 * @desc    Get all questions with advanced filters, search & pagination
 * @route   GET /api/questions
 * @access  Public / Authenticated
 */
const getQuestions = async (req, res, next) => {
  try {
    const {
      subject,
      chapter,
      topic,
      course,
      difficulty,
      type,
      exam,
      year,
      tags,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Filter conditions
    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;
    if (topic) query.topic = topic;
    if (course) query.course = course;
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (exam) query.exam = new RegExp(`^${exam}$`, 'i');
    if (year) query.year = year;
    if (status) query.status = status;

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
      query.tags = { $in: tagArray };
    }

    // Text search on questionText
    if (search) {
      query.questionText = { $regex: search, $options: 'i' };
    }

    // Non-admin / student users only see published questions if not filtering by own
    if (!req.user || req.user.role === 'student') {
      query.status = CONTENT_STATUS.PUBLISHED;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await Question.countDocuments(query);

    const questions = await Question.find(query)
      .populate('subject', 'name slug')
      .populate('chapter', 'title order')
      .populate('topic', 'title order')
      .populate('course', 'title slug')
      .populate('createdBy', 'name email avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      data: questions
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single question by ID
 * @route   GET /api/questions/:id
 * @access  Public / Authenticated
 */
const getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('subject', 'name')
      .populate('chapter', 'title')
      .populate('topic', 'title')
      .populate('course', 'title')
      .populate('createdBy', 'name email avatar');

    if (!question) {
      return next(new ErrorResponse(`Question not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new question
 * @route   POST /api/questions
 * @access  Private (Admin, Instructor, Question Manager)
 */
const createQuestion = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    // Validate MCQ / MSQ options
    if (
      req.body.type === QUESTION_TYPES.MCQ ||
      req.body.type === QUESTION_TYPES.MSQ
    ) {
      if (!req.body.options || req.body.options.length < 2) {
        return next(
          new ErrorResponse('MCQ/MSQ questions must have at least 2 options', 400)
        );
      }
      const hasCorrect = req.body.options.some((opt) => opt.isCorrect);
      if (!hasCorrect && !req.body.correctAnswer) {
        return next(
          new ErrorResponse(
            'At least one option must be marked as correct for MCQ/MSQ questions',
            400
          )
        );
      }
    }

    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing question
 * @route   PUT /api/questions/:id
 * @access  Private (Admin, Instructor, Question Manager)
 */
const updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse(`Question not found with id ${req.params.id}`, 404));
    }

    // Validate MCQ / MSQ options if provided
    if (
      req.body.options &&
      (req.body.type === QUESTION_TYPES.MCQ ||
        req.body.type === QUESTION_TYPES.MSQ ||
        question.type === QUESTION_TYPES.MCQ ||
        question.type === QUESTION_TYPES.MSQ)
    ) {
      if (req.body.options.length < 2) {
        return next(
          new ErrorResponse('MCQ/MSQ questions must have at least 2 options', 400)
        );
      }
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a question
 * @route   DELETE /api/questions/:id
 * @access  Private (Admin, Instructor, Question Manager)
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse(`Question not found with id ${req.params.id}`, 404));
    }

    await Question.findByIdAndDelete(req.params.id);

    // Also clean up any bookmarks referencing this question
    await Bookmark.deleteMany({ contentType: 'question', contentId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Bulk create questions
 * @route   POST /api/questions/bulk
 * @access  Private (Admin, Instructor, Question Manager)
 */
const bulkCreateQuestions = async (req, res, next) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return next(
        new ErrorResponse('Please provide an array of questions under the `questions` key', 400)
      );
    }

    // Inject createdBy into all questions
    const formattedQuestions = questions.map((q) => ({
      ...q,
      createdBy: req.user._id,
      status: q.status || CONTENT_STATUS.PUBLISHED
    }));

    const createdQuestions = await Question.insertMany(formattedQuestions, {
      ordered: false
    });

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdQuestions.length} questions`,
      count: createdQuestions.length,
      data: createdQuestions
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle bookmark for a question
 * @route   POST /api/questions/:id/bookmark
 * @access  Private (Authenticated users)
 */
const bookmarkQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return next(new ErrorResponse(`Question not found with id ${req.params.id}`, 404));
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      contentType: 'question',
      contentId: req.params.id
    });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      return res.status(200).json({
        success: true,
        isBookmarked: false,
        message: 'Question bookmark removed'
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      contentType: 'question',
      contentId: req.params.id,
      contentModel: 'Question',
      note: req.body.note || '',
      tags: req.body.tags || []
    });

    res.status(201).json({
      success: true,
      isBookmarked: true,
      message: 'Question bookmarked successfully',
      data: bookmark
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all bookmarked questions for current user
 * @route   GET /api/questions/bookmarks
 * @access  Private (Authenticated users)
 */
const getBookmarkedQuestions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Bookmark.countDocuments({
      user: req.user._id,
      contentType: 'question'
    });

    const bookmarks = await Bookmark.find({
      user: req.user._id,
      contentType: 'question'
    })
      .populate({
        path: 'contentId',
        model: 'Question',
        populate: [
          { path: 'subject', select: 'name' },
          { path: 'chapter', select: 'title' },
          { path: 'topic', select: 'title' }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Filter out any bookmarks whose referenced questions were deleted
    const validBookmarkedQuestions = bookmarks
      .filter((b) => b.contentId !== null)
      .map((b) => ({
        bookmarkId: b._id,
        note: b.note,
        tags: b.tags,
        bookmarkedAt: b.createdAt,
        question: b.contentId
      }));

    res.status(200).json({
      success: true,
      count: validBookmarkedQuestions.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      data: validBookmarkedQuestions
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get questions that user got wrong in quiz or test attempts
 * @route   GET /api/questions/incorrect
 * @access  Private (Authenticated users)
 */
const getIncorrectQuestions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all QuizAttempts for user
    const quizAttempts = await QuizAttempt.find({
      user: userId,
      status: 'completed'
    }).select('answers');

    // Find all TestAttempts for user
    const testAttempts = await TestAttempt.find({
      user: userId,
      status: { $in: ['completed', 'submitted'] }
    }).select('answers');

    const incorrectQuestionIds = new Set();

    // Extract incorrect question IDs from quizzes
    quizAttempts.forEach((attempt) => {
      if (attempt.answers && Array.isArray(attempt.answers)) {
        attempt.answers.forEach((ans) => {
          if (ans.isCorrect === false && ans.question) {
            incorrectQuestionIds.add(ans.question.toString());
          }
        });
      }
    });

    // Extract incorrect question IDs from tests
    testAttempts.forEach((attempt) => {
      if (attempt.answers && Array.isArray(attempt.answers)) {
        attempt.answers.forEach((ans) => {
          if (ans.isCorrect === false && ans.question) {
            incorrectQuestionIds.add(ans.question.toString());
          }
        });
      }
    });

    const questionIdArray = Array.from(incorrectQuestionIds);

    if (questionIdArray.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    const { subject, difficulty, limit = 50 } = req.query;
    const filter = { _id: { $in: questionIdArray } };
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter)
      .populate('subject', 'name')
      .populate('chapter', 'title')
      .populate('topic', 'title')
      .populate('course', 'title')
      .limit(parseInt(limit, 10) || 50);

    res.status(200).json({
      success: true,
      count: questions.length,
      totalIncorrect: questionIdArray.length,
      data: questions
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  bookmarkQuestion,
  getBookmarkedQuestions,
  getIncorrectQuestions
};
