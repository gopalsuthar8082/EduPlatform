const { Quiz, Question, QuizAttempt, StudentActivity } = require('../models');
const { ErrorResponse } = require('../middleware/errorHandler');
const { CONTENT_STATUS, ACTIVITY_TYPES, USER_ROLES } = require('../config/constants');

/**
 * @desc    Get all quizzes with filters & pagination
 * @route   GET /api/quizzes
 * @access  Public / Authenticated
 */
const getQuizzes = async (req, res, next) => {
  try {
    const {
      course,
      subject,
      chapter,
      topic,
      quizType,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (course) query.course = course;
    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;
    if (topic) query.topic = topic;
    if (quizType) query.quizType = quizType;
    if (status) query.status = status;

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Students only see published quizzes
    if (!req.user || req.user.role === 'student') {
      query.status = CONTENT_STATUS.PUBLISHED;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await Quiz.countDocuments(query);

    const quizzes = await Quiz.find(query)
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('chapter', 'title order')
      .populate('topic', 'title order')
      .populate('createdBy', 'name email avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    // Append questionCount to each quiz
    const formattedQuizzes = quizzes.map((quiz) => {
      const qObj = quiz.toObject();
      qObj.questionCount = quiz.questions ? quiz.questions.length : 0;
      return qObj;
    });

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: formattedQuizzes.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      data: formattedQuizzes
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single quiz by ID
 * @route   GET /api/quizzes/:id
 * @access  Public / Authenticated
 */
const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title')
      .populate('subject', 'name')
      .populate('chapter', 'title')
      .populate('topic', 'title')
      .populate('createdBy', 'name email avatar')
      .populate({
        path: 'questions',
        select: req.user && [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR].includes(req.user.role)
          ? '+correctAnswer +explanation +options.isCorrect'
          : '-correctAnswer -explanation -options.isCorrect -solutionHtml'
      });

    if (!quiz) {
      return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
    }

    const quizObj = quiz.toObject();
    quizObj.questionCount = quiz.questions ? quiz.questions.length : 0;

    res.status(200).json({
      success: true,
      data: quizObj
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new quiz
 * @route   POST /api/quizzes
 * @access  Private (Admin, Instructor)
 */
const createQuiz = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    // Calculate total marks from question marks if not explicitly passed
    if (req.body.questions && Array.isArray(req.body.questions) && req.body.questions.length > 0) {
      const questionsData = await Question.find({ _id: { $in: req.body.questions } }).select('marks');
      const calculatedTotal = questionsData.reduce((sum, q) => sum + (q.marks || 1), 0);
      if (!req.body.totalMarks || req.body.totalMarks === 0) {
        req.body.totalMarks = calculatedTotal;
      }
    }

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing quiz
 * @route   PUT /api/quizzes/:id
 * @access  Private (Admin, Instructor)
 */
const updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
    }

    // Recalculate total marks if questions are updated
    if (req.body.questions && Array.isArray(req.body.questions)) {
      const questionsData = await Question.find({ _id: { $in: req.body.questions } }).select('marks');
      const calculatedTotal = questionsData.reduce((sum, q) => sum + (q.marks || 1), 0);
      if (!req.body.totalMarks) {
        req.body.totalMarks = calculatedTotal;
      }
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (Admin, Instructor)
 */
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
    }

    await Quiz.findByIdAndDelete(req.params.id);
    await QuizAttempt.deleteMany({ quiz: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Quiz and associated attempts deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Start a quiz attempt
 * @route   POST /api/quizzes/:id/start
 * @access  Private (Authenticated users)
 */
const startQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate({
      path: 'questions',
      select: '-correctAnswer -explanation -solutionHtml -options.isCorrect'
    });

    if (!quiz) {
      return next(new ErrorResponse(`Quiz not found with id ${req.params.id}`, 404));
    }

    if (quiz.status !== CONTENT_STATUS.PUBLISHED && req.user.role === 'student') {
      return next(new ErrorResponse('This quiz is not currently available', 400));
    }

    // Check max attempts
    if (quiz.maxAttempts > 0) {
      const completedCount = await QuizAttempt.countDocuments({
        user: req.user._id,
        quiz: quiz._id,
        status: 'completed'
      });

      if (completedCount >= quiz.maxAttempts) {
        return next(
          new ErrorResponse(
            `Maximum attempts (${quiz.maxAttempts}) reached for this quiz.`,
            400
          )
        );
      }
    }

    // Create new QuizAttempt
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      totalMarks: quiz.totalMarks,
      startedAt: new Date(),
      status: 'in_progress',
      answers: []
    });

    // Shuffle questions if required
    let questions = [...quiz.questions];
    if (quiz.shuffleQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    res.status(201).json({
      success: true,
      message: 'Quiz started successfully',
      data: {
        attemptId: attempt._id,
        quizId: quiz._id,
        title: quiz.title,
        duration: quiz.duration,
        totalMarks: quiz.totalMarks,
        passingMarks: quiz.passingMarks,
        showAnswers: quiz.showAnswers,
        startedAt: attempt.startedAt,
        questions
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Submit quiz attempt and grade answers
 * @route   PUT /api/quizzes/:id/submit
 * @access  Private (Authenticated users)
 */
const submitQuiz = async (req, res, next) => {
  try {
    const { attemptId, answers = [], timeTaken = 0 } = req.body;

    let attempt;
    if (attemptId) {
      attempt = await QuizAttempt.findOne({
        _id: attemptId,
        user: req.user._id,
        quiz: req.params.id
      });
    } else {
      // Find latest in-progress attempt
      attempt = await QuizAttempt.findOne({
        user: req.user._id,
        quiz: req.params.id,
        status: 'in_progress'
      }).sort({ createdAt: -1 });
    }

    if (!attempt) {
      return next(new ErrorResponse('Active quiz attempt not found', 404));
    }

    if (attempt.status === 'completed') {
      return next(new ErrorResponse('This quiz attempt has already been submitted', 400));
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return next(new ErrorResponse('Quiz not found', 404));
    }

    // Fetch questions with correct answers to grade
    const questionIds = answers.map((a) => a.question);
    const questionsFromDb = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questionsFromDb.map((q) => [q._id.toString(), q]));

    let totalScore = 0;
    let correctCount = 0;
    let attemptedCount = 0;
    const gradedAnswers = [];

    for (const ans of answers) {
      const qDoc = questionMap.get(ans.question.toString());
      if (!qDoc) continue;

      let isCorrect = false;
      let marksObtained = 0;
      const qMarks = qDoc.marks || 1;
      const qNegMarks = qDoc.negativeMarks || 0;

      const hasSelectedOption = Array.isArray(ans.selectedOption) && ans.selectedOption.length > 0;
      const hasTextAnswer = ans.textAnswer && ans.textAnswer.trim().length > 0;

      if (hasSelectedOption || hasTextAnswer) {
        attemptedCount++;

        if (qDoc.type === 'mcq' || qDoc.type === 'true_false') {
          // Find correct option index
          const correctIndices = qDoc.options
            .map((opt, idx) => (opt.isCorrect ? idx : -1))
            .filter((idx) => idx !== -1);

          const userChoice = ans.selectedOption[0];
          if (correctIndices.includes(userChoice)) {
            isCorrect = true;
            marksObtained = qMarks;
            correctCount++;
          } else {
            marksObtained = -qNegMarks;
          }
        } else if (qDoc.type === 'msq') {
          const correctIndices = qDoc.options
            .map((opt, idx) => (opt.isCorrect ? idx : -1))
            .filter((idx) => idx !== -1)
            .sort();
          const userChoices = [...ans.selectedOption].sort();

          if (
            correctIndices.length === userChoices.length &&
            correctIndices.every((val, idx) => val === userChoices[idx])
          ) {
            isCorrect = true;
            marksObtained = qMarks;
            correctCount++;
          } else {
            marksObtained = -qNegMarks;
          }
        } else if (qDoc.type === 'fill_blank' || qDoc.type === 'numerical') {
          if (
            qDoc.correctAnswer &&
            ans.textAnswer &&
            qDoc.correctAnswer.trim().toLowerCase() === ans.textAnswer.trim().toLowerCase()
          ) {
            isCorrect = true;
            marksObtained = qMarks;
            correctCount++;
          } else {
            marksObtained = -qNegMarks;
          }
        } else {
          // Subjective / other types default
          if (hasTextAnswer || hasSelectedOption) {
            marksObtained = qMarks;
            isCorrect = true;
            correctCount++;
          }
        }

        // Update question stats in DB asynchronously
        Question.findByIdAndUpdate(qDoc._id, {
          $inc: {
            'stats.totalAttempts': 1,
            'stats.correctAttempts': isCorrect ? 1 : 0
          }
        }).catch((e) => console.error('Error updating question stats:', e));
      }

      totalScore += marksObtained;

      gradedAnswers.push({
        question: qDoc._id,
        selectedOption: ans.selectedOption || [],
        textAnswer: ans.textAnswer || '',
        isCorrect,
        marksObtained,
        timeTaken: ans.timeTaken || 0
      });
    }

    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const finalScore = Math.max(0, totalScore);

    // Update attempt
    attempt.answers = gradedAnswers;
    attempt.score = finalScore;
    attempt.totalMarks = quiz.totalMarks || gradedAnswers.length;
    attempt.accuracy = accuracy;
    attempt.timeTaken = timeTaken || 0;
    attempt.completedAt = new Date();
    attempt.status = 'completed';
    await attempt.save();

    // Log StudentActivity
    await StudentActivity.create({
      user: req.user._id,
      activityType: ACTIVITY_TYPES.QUIZ_ATTEMPT,
      contentType: 'Quiz',
      contentId: quiz._id,
      duration: timeTaken || 0,
      metadata: {
        score: finalScore,
        totalMarks: attempt.totalMarks,
        accuracy,
        correctCount,
        totalQuestions: gradedAnswers.length
      }
    });

    res.status(200).json({
      success: true,
      message: 'Quiz submitted and graded successfully',
      data: {
        attemptId: attempt._id,
        score: finalScore,
        totalMarks: attempt.totalMarks,
        passingMarks: quiz.passingMarks,
        isPassed: finalScore >= (quiz.passingMarks || 0),
        accuracy,
        correctCount,
        incorrectCount: attemptedCount - correctCount,
        unattemptedCount: (quiz.questions ? quiz.questions.length : gradedAnswers.length) - attemptedCount,
        timeTaken: attempt.timeTaken,
        completedAt: attempt.completedAt
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get detailed quiz result with explanations
 * @route   GET /api/quizzes/:id/result/:attemptId
 * @access  Private (Authenticated users)
 */
const getQuizResult = async (req, res, next) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      user: req.user._id
    })
      .populate('quiz', 'title description duration totalMarks passingMarks showAnswers')
      .populate({
        path: 'answers.question',
        populate: [
          { path: 'subject', select: 'name' },
          { path: 'chapter', select: 'title' },
          { path: 'topic', select: 'title' }
        ]
      });

    if (!attempt) {
      return next(new ErrorResponse('Quiz attempt result not found', 404));
    }

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all quiz attempt history for a user and quiz
 * @route   GET /api/quizzes/:id/history
 * @access  Private (Authenticated users)
 */
const getQuizHistory = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({
      user: req.user._id,
      quiz: req.params.id
    })
      .sort({ createdAt: -1 })
      .select('score totalMarks accuracy timeTaken startedAt completedAt status');

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  startQuiz,
  submitQuiz,
  getQuizResult,
  getQuizHistory
};
