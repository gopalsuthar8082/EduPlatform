const { Test, Question, TestAttempt, StudentActivity } = require('../models');
const { ErrorResponse } = require('../middleware/errorHandler');
const { CONTENT_STATUS, ATTEMPT_STATUS, ACTIVITY_TYPES, USER_ROLES } = require('../config/constants');

/**
 * @desc    Get all tests with filters & pagination
 * @route   GET /api/tests
 * @access  Public / Authenticated
 */
const getTests = async (req, res, next) => {
  try {
    const {
      type,
      course,
      subject,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (course) query.course = course;
    if (subject) query.subject = subject;
    if (status) query.status = status;

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter published tests for students/guests
    if (!req.user || req.user.role === 'student') {
      query.status = CONTENT_STATUS.PUBLISHED;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await Test.countDocuments(query);

    const tests = await Test.find(query)
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('createdBy', 'name email avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      data: tests
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single test by ID
 * @route   GET /api/tests/:id
 * @access  Public / Authenticated
 */
const getTest = async (req, res, next) => {
  try {
    const isStaff = req.user && [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR].includes(req.user.role);

    const test = await Test.findById(req.params.id)
      .populate('course', 'title')
      .populate('subject', 'name')
      .populate('createdBy', 'name email avatar')
      .populate({
        path: 'sections.questions',
        select: isStaff
          ? '+correctAnswer +explanation +options.isCorrect'
          : '-correctAnswer -explanation -solutionHtml -options.isCorrect'
      });

    if (!test) {
      return next(new ErrorResponse(`Test not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: test
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new test
 * @route   POST /api/tests
 * @access  Private (Admin, Instructor)
 */
const createTest = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    // Calculate total questions and marks from sections if not provided
    let totalQuestions = 0;
    let totalMarks = 0;

    if (req.body.sections && Array.isArray(req.body.sections)) {
      for (const section of req.body.sections) {
        if (section.questions && Array.isArray(section.questions)) {
          totalQuestions += section.questions.length;
          // If section total marks is specified, add it
          if (section.totalMarks) {
            totalMarks += section.totalMarks;
          } else {
            // Calculate sum of question marks
            const qDocs = await Question.find({ _id: { $in: section.questions } }).select('marks');
            const secMarks = qDocs.reduce((sum, q) => sum + (q.marks || 1), 0);
            section.totalMarks = secMarks;
            totalMarks += secMarks;
          }
        }
      }
    }

    req.body.totalQuestions = req.body.totalQuestions || totalQuestions;
    req.body.totalMarks = req.body.totalMarks || totalMarks;

    const test = await Test.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing test
 * @route   PUT /api/tests/:id
 * @access  Private (Admin, Instructor)
 */
const updateTest = async (req, res, next) => {
  try {
    let test = await Test.findById(req.params.id);

    if (!test) {
      return next(new ErrorResponse(`Test not found with id ${req.params.id}`, 404));
    }

    // Recalculate totals if sections are updated
    if (req.body.sections && Array.isArray(req.body.sections)) {
      let totalQuestions = 0;
      let totalMarks = 0;
      for (const section of req.body.sections) {
        if (section.questions && Array.isArray(section.questions)) {
          totalQuestions += section.questions.length;
          if (section.totalMarks) {
            totalMarks += section.totalMarks;
          } else {
            const qDocs = await Question.find({ _id: { $in: section.questions } }).select('marks');
            const secMarks = qDocs.reduce((sum, q) => sum + (q.marks || 1), 0);
            section.totalMarks = secMarks;
            totalMarks += secMarks;
          }
        }
      }
      req.body.totalQuestions = totalQuestions;
      req.body.totalMarks = totalMarks;
    }

    test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      data: test
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a test
 * @route   DELETE /api/tests/:id
 * @access  Private (Admin, Instructor)
 */
const deleteTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return next(new ErrorResponse(`Test not found with id ${req.params.id}`, 404));
    }

    await Test.findByIdAndDelete(req.params.id);
    await TestAttempt.deleteMany({ test: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Test and associated attempts deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Start a CBT Test Attempt
 * @route   POST /api/tests/:id/start
 * @access  Private (Authenticated users)
 */
const startTest = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id).populate({
      path: 'sections.questions',
      select: '-correctAnswer -explanation -solutionHtml -options.isCorrect'
    });

    if (!test) {
      return next(new ErrorResponse(`Test not found with id ${req.params.id}`, 404));
    }

    if (test.status !== CONTENT_STATUS.PUBLISHED && req.user.role === 'student') {
      return next(new ErrorResponse('This test is not published yet', 400));
    }

    // Check max attempts
    if (test.maxAttempts > 0) {
      const completedCount = await TestAttempt.countDocuments({
        user: req.user._id,
        test: test._id,
        status: { $in: [ATTEMPT_STATUS.COMPLETED, ATTEMPT_STATUS.SUBMITTED] }
      });

      if (completedCount >= test.maxAttempts) {
        return next(
          new ErrorResponse(
            `Maximum attempts (${test.maxAttempts}) reached for this test.`,
            400
          )
        );
      }
    }

    // Initialize initial answers array with all questions across sections
    const initialAnswers = [];
    test.sections.forEach((section) => {
      if (section.questions && Array.isArray(section.questions)) {
        section.questions.forEach((q) => {
          initialAnswers.push({
            question: q._id,
            sectionName: section.name,
            selectedOption: [],
            textAnswer: '',
            isCorrect: false,
            marksObtained: 0,
            negativeMarksApplied: 0,
            timeTaken: 0,
            markedForReview: false,
            visited: false
          });
        });
      }
    });

    const attempt = await TestAttempt.create({
      user: req.user._id,
      test: test._id,
      totalMarks: test.totalMarks,
      startedAt: new Date(),
      status: ATTEMPT_STATUS.IN_PROGRESS,
      answers: initialAnswers
    });

    res.status(201).json({
      success: true,
      message: 'Test started successfully',
      data: {
        attemptId: attempt._id,
        testId: test._id,
        title: test.title,
        duration: test.duration,
        totalMarks: test.totalMarks,
        totalQuestions: test.totalQuestions,
        negativeMarkingRule: test.negativeMarkingRule,
        instructions: test.instructions,
        sections: test.sections,
        startedAt: attempt.startedAt,
        answers: attempt.answers
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Auto-save / update single question answer during test
 * @route   PUT /api/tests/attempts/:attemptId/save-answer
 * @access  Private (Authenticated users)
 */
const saveAnswer = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedOption, textAnswer, timeTaken = 0 } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: attemptId,
      user: req.user._id,
      status: ATTEMPT_STATUS.IN_PROGRESS
    });

    if (!attempt) {
      return next(new ErrorResponse('Active test attempt not found', 404));
    }

    // Locate question in answers array
    const ansIndex = attempt.answers.findIndex(
      (a) => a.question.toString() === questionId
    );

    if (ansIndex !== -1) {
      if (selectedOption !== undefined) attempt.answers[ansIndex].selectedOption = selectedOption;
      if (textAnswer !== undefined) attempt.answers[ansIndex].textAnswer = textAnswer;
      if (timeTaken) attempt.answers[ansIndex].timeTaken += timeTaken;
      attempt.answers[ansIndex].visited = true;
    } else {
      attempt.answers.push({
        question: questionId,
        selectedOption: selectedOption || [],
        textAnswer: textAnswer || '',
        timeTaken,
        visited: true,
        markedForReview: false
      });
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Answer saved successfully',
      data: {
        questionId,
        saved: true
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle mark for review status on a question in attempt
 * @route   PUT /api/tests/attempts/:attemptId/mark-review
 * @access  Private (Authenticated users)
 */
const markForReview = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { questionId, markedForReview } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: attemptId,
      user: req.user._id,
      status: ATTEMPT_STATUS.IN_PROGRESS
    });

    if (!attempt) {
      return next(new ErrorResponse('Active test attempt not found', 404));
    }

    const ansIndex = attempt.answers.findIndex(
      (a) => a.question.toString() === questionId
    );

    if (ansIndex !== -1) {
      attempt.answers[ansIndex].markedForReview =
        markedForReview !== undefined
          ? markedForReview
          : !attempt.answers[ansIndex].markedForReview;
      attempt.answers[ansIndex].visited = true;
      await attempt.save();
    }

    res.status(200).json({
      success: true,
      message: 'Mark for review updated',
      markedForReview: ansIndex !== -1 ? attempt.answers[ansIndex].markedForReview : false
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Submit full test and grade all answers
 * @route   PUT /api/tests/attempts/:attemptId/submit
 * @access  Private (Authenticated users)
 */
const submitTest = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { answers = [], totalTimeTaken = 0 } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: attemptId,
      user: req.user._id
    });

    if (!attempt) {
      return next(new ErrorResponse('Test attempt not found', 404));
    }

    if (attempt.status === ATTEMPT_STATUS.SUBMITTED || attempt.status === ATTEMPT_STATUS.COMPLETED) {
      return next(new ErrorResponse('This test has already been submitted', 400));
    }

    const test = await Test.findById(attempt.test);
    if (!test) {
      return next(new ErrorResponse('Associated test not found', 404));
    }

    // Merge answers from body into attempt answers
    const answersMap = new Map();
    attempt.answers.forEach((ans) => {
      answersMap.set(ans.question.toString(), ans.toObject ? ans.toObject() : ans);
    });

    answers.forEach((ans) => {
      const qId = ans.question ? ans.question.toString() : '';
      if (qId) {
        const existing = answersMap.get(qId) || { question: qId, sectionName: ans.sectionName || 'General' };
        answersMap.set(qId, {
          ...existing,
          selectedOption: ans.selectedOption !== undefined ? ans.selectedOption : existing.selectedOption,
          textAnswer: ans.textAnswer !== undefined ? ans.textAnswer : existing.textAnswer,
          timeTaken: ans.timeTaken !== undefined ? ans.timeTaken : existing.timeTaken,
          markedForReview: ans.markedForReview !== undefined ? ans.markedForReview : existing.markedForReview,
          visited: true
        });
      }
    });

    const mergedAnswersList = Array.from(answersMap.values());
    const questionIds = mergedAnswersList.map((a) => a.question);
    const questionsFromDb = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questionsFromDb.map((q) => [q._id.toString(), q]));

    // Grade each question
    let overallScore = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalSkipped = 0;
    const sectionTracker = {};

    // Initialize sectionTracker from test sections
    test.sections.forEach((sec) => {
      sectionTracker[sec.name] = {
        sectionName: sec.name,
        score: 0,
        totalMarks: sec.totalMarks || 0,
        correctCount: 0,
        incorrectCount: 0,
        skippedCount: 0,
        accuracy: 0,
        timeTaken: 0
      };
    });

    const gradedAnswers = [];

    for (const ans of mergedAnswersList) {
      const qDoc = questionMap.get(ans.question.toString());
      if (!qDoc) continue;

      const secName = ans.sectionName || 'General';
      if (!sectionTracker[secName]) {
        sectionTracker[secName] = {
          sectionName: secName,
          score: 0,
          totalMarks: 0,
          correctCount: 0,
          incorrectCount: 0,
          skippedCount: 0,
          accuracy: 0,
          timeTaken: 0
        };
      }

      const qMarks = qDoc.marks || 1;
      let qNegMarks = 0;

      // Negative marking calculation
      if (test.negativeMarkingRule && test.negativeMarkingRule.enabled) {
        if (test.negativeMarkingRule.fixed > 0) {
          qNegMarks = test.negativeMarkingRule.fixed;
        } else if (test.negativeMarkingRule.percentage > 0) {
          qNegMarks = (qMarks * test.negativeMarkingRule.percentage) / 100;
        }
      } else if (qDoc.negativeMarks) {
        qNegMarks = qDoc.negativeMarks;
      }

      let isCorrect = false;
      let marksObtained = 0;
      let negativeApplied = 0;

      const hasSelectedOption = Array.isArray(ans.selectedOption) && ans.selectedOption.length > 0;
      const hasTextAnswer = ans.textAnswer && ans.textAnswer.trim().length > 0;

      if (!hasSelectedOption && !hasTextAnswer) {
        // Skipped / Unattempted
        totalSkipped++;
        sectionTracker[secName].skippedCount++;
      } else {
        // Attempted - Grade
        if (qDoc.type === 'mcq' || qDoc.type === 'true_false') {
          const correctIndices = qDoc.options
            .map((opt, idx) => (opt.isCorrect ? idx : -1))
            .filter((idx) => idx !== -1);

          const userChoice = ans.selectedOption[0];
          if (correctIndices.includes(userChoice)) {
            isCorrect = true;
            marksObtained = qMarks;
            totalCorrect++;
            sectionTracker[secName].correctCount++;
          } else {
            negativeApplied = qNegMarks;
            marksObtained = -qNegMarks;
            totalIncorrect++;
            sectionTracker[secName].incorrectCount++;
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
            totalCorrect++;
            sectionTracker[secName].correctCount++;
          } else {
            negativeApplied = qNegMarks;
            marksObtained = -qNegMarks;
            totalIncorrect++;
            sectionTracker[secName].incorrectCount++;
          }
        } else if (qDoc.type === 'fill_blank' || qDoc.type === 'numerical') {
          if (
            qDoc.correctAnswer &&
            ans.textAnswer &&
            qDoc.correctAnswer.trim().toLowerCase() === ans.textAnswer.trim().toLowerCase()
          ) {
            isCorrect = true;
            marksObtained = qMarks;
            totalCorrect++;
            sectionTracker[secName].correctCount++;
          } else {
            negativeApplied = qNegMarks;
            marksObtained = -qNegMarks;
            totalIncorrect++;
            sectionTracker[secName].incorrectCount++;
          }
        } else {
          // Default correct for subjective practice
          isCorrect = true;
          marksObtained = qMarks;
          totalCorrect++;
          sectionTracker[secName].correctCount++;
        }

        // Asynchronously update question total stats
        Question.findByIdAndUpdate(qDoc._id, {
          $inc: {
            'stats.totalAttempts': 1,
            'stats.correctAttempts': isCorrect ? 1 : 0
          }
        }).catch((e) => console.error('Error updating question stats:', e));
      }

      overallScore += marksObtained;
      sectionTracker[secName].score += marksObtained;
      sectionTracker[secName].timeTaken += ans.timeTaken || 0;

      gradedAnswers.push({
        question: qDoc._id,
        sectionName: secName,
        selectedOption: ans.selectedOption || [],
        textAnswer: ans.textAnswer || '',
        isCorrect,
        marksObtained,
        negativeMarksApplied: negativeApplied,
        timeTaken: ans.timeTaken || 0,
        markedForReview: ans.markedForReview || false,
        visited: true
      });
    }

    // Section calculations
    const sectionWiseResults = Object.values(sectionTracker).map((sec) => {
      const attempted = sec.correctCount + sec.incorrectCount;
      sec.accuracy = attempted > 0 ? Math.round((sec.correctCount / attempted) * 100) : 0;
      sec.score = Math.max(0, sec.score);
      return sec;
    });

    const totalAttempted = totalCorrect + totalIncorrect;
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const finalScore = Math.max(0, overallScore);

    attempt.answers = gradedAnswers;
    attempt.score = finalScore;
    attempt.totalMarks = test.totalMarks || overallScore;
    attempt.accuracy = overallAccuracy;
    attempt.correctCount = totalCorrect;
    attempt.incorrectCount = totalIncorrect;
    attempt.skippedCount = totalSkipped;
    attempt.timeTaken = totalTimeTaken || attempt.answers.reduce((sum, a) => sum + (a.timeTaken || 0), 0);
    attempt.sectionWiseResults = sectionWiseResults;
    attempt.completedAt = new Date();
    attempt.status = ATTEMPT_STATUS.SUBMITTED;
    await attempt.save();

    // Calculate Rank and Percentile across all completed attempts for this test
    const allAttempts = await TestAttempt.find({
      test: test._id,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    }).select('score');

    const totalAttemptsCount = allAttempts.length;
    const higherScoresCount = allAttempts.filter((a) => a.score > finalScore).length;
    const sameScoresCount = allAttempts.filter((a) => a.score === finalScore).length;
    const lowerScoresCount = allAttempts.filter((a) => a.score < finalScore).length;

    const rank = higherScoresCount + 1;
    const percentile =
      totalAttemptsCount > 0
        ? Math.round(((lowerScoresCount + 0.5 * sameScoresCount) / totalAttemptsCount) * 100 * 10) / 10
        : 100;

    attempt.rank = rank;
    attempt.percentile = percentile;
    await attempt.save();

    // Log StudentActivity
    await StudentActivity.create({
      user: req.user._id,
      activityType: ACTIVITY_TYPES.TEST_ATTEMPT,
      contentType: 'Test',
      contentId: test._id,
      duration: attempt.timeTaken,
      metadata: {
        score: finalScore,
        totalMarks: attempt.totalMarks,
        accuracy: overallAccuracy,
        rank,
        percentile
      }
    });

    res.status(200).json({
      success: true,
      message: 'Test submitted and graded successfully',
      data: {
        attemptId: attempt._id,
        score: finalScore,
        totalMarks: attempt.totalMarks,
        accuracy: overallAccuracy,
        correctCount: totalCorrect,
        incorrectCount: totalIncorrect,
        skippedCount: totalSkipped,
        timeTaken: attempt.timeTaken,
        rank,
        percentile,
        sectionWiseResults,
        completedAt: attempt.completedAt
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get complete test attempt result with solutions & explanations
 * @route   GET /api/tests/attempts/:attemptId/result
 * @access  Private (Authenticated users)
 */
const getTestResult = async (req, res, next) => {
  try {
    const { attemptId } = req.params;

    const attempt = await TestAttempt.findOne({
      _id: attemptId,
      user: req.user._id
    })
      .populate('test', 'title description type duration totalMarks negativeMarkingRule')
      .populate({
        path: 'answers.question',
        populate: [
          { path: 'subject', select: 'name' },
          { path: 'chapter', select: 'title' },
          { path: 'topic', select: 'title' }
        ]
      });

    if (!attempt) {
      return next(new ErrorResponse('Test attempt not found', 404));
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
 * @desc    Get rich CBT performance analysis for an attempt
 * @route   GET /api/tests/attempts/:attemptId/analysis
 * @access  Private (Authenticated users)
 */
const getTestAnalysis = async (req, res, next) => {
  try {
    const { attemptId } = req.params;

    const attempt = await TestAttempt.findOne({
      _id: attemptId,
      user: req.user._id
    }).populate({
      path: 'answers.question',
      populate: [
        { path: 'subject', select: 'name' },
        { path: 'chapter', select: 'title' },
        { path: 'topic', select: 'title' }
      ]
    });

    if (!attempt) {
      return next(new ErrorResponse('Test attempt not found', 404));
    }

    // Breakdown performance by Topic / Subject
    const topicBreakdown = {};
    const difficultyBreakdown = {
      easy: { total: 0, correct: 0, incorrect: 0, score: 0 },
      medium: { total: 0, correct: 0, incorrect: 0, score: 0 },
      hard: { total: 0, correct: 0, incorrect: 0, score: 0 }
    };

    attempt.answers.forEach((ans) => {
      const q = ans.question;
      if (!q) return;

      const topicName = q.topic ? q.topic.title : 'General';
      const subjectName = q.subject ? q.subject.name : 'General';
      const diff = q.difficulty || 'medium';

      // Topic Map
      if (!topicBreakdown[topicName]) {
        topicBreakdown[topicName] = {
          topic: topicName,
          subject: subjectName,
          total: 0,
          correct: 0,
          incorrect: 0,
          accuracy: 0,
          timeSpent: 0
        };
      }

      topicBreakdown[topicName].total++;
      topicBreakdown[topicName].timeSpent += ans.timeTaken || 0;
      if (ans.isCorrect) topicBreakdown[topicName].correct++;
      else if (ans.marksObtained < 0 || ans.selectedOption.length > 0 || ans.textAnswer) {
        topicBreakdown[topicName].incorrect++;
      }

      // Difficulty Map
      if (difficultyBreakdown[diff]) {
        difficultyBreakdown[diff].total++;
        if (ans.isCorrect) difficultyBreakdown[diff].correct++;
        else if (ans.marksObtained < 0 || ans.selectedOption.length > 0 || ans.textAnswer) {
          difficultyBreakdown[diff].incorrect++;
        }
        difficultyBreakdown[diff].score += ans.marksObtained || 0;
      }
    });

    const topicWiseResults = Object.values(topicBreakdown).map((t) => {
      const attempted = t.correct + t.incorrect;
      t.accuracy = attempted > 0 ? Math.round((t.correct / attempted) * 100) : 0;
      return t;
    });

    // Time analysis: average time on correct vs incorrect vs unattempted
    let correctTime = 0;
    let incorrectTime = 0;
    let skippedTime = 0;

    attempt.answers.forEach((ans) => {
      if (ans.isCorrect) correctTime += ans.timeTaken || 0;
      else if (ans.marksObtained < 0 || ans.selectedOption.length > 0 || ans.textAnswer) {
        incorrectTime += ans.timeTaken || 0;
      } else {
        skippedTime += ans.timeTaken || 0;
      }
    });

    // Comparison with past attempts on the same test
    const previousAttempts = await TestAttempt.find({
      user: req.user._id,
      test: attempt.test,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    })
      .sort({ completedAt: 1 })
      .select('score totalMarks accuracy timeTaken rank percentile completedAt');

    res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id,
        overallScore: attempt.score,
        totalMarks: attempt.totalMarks,
        accuracy: attempt.accuracy,
        rank: attempt.rank,
        percentile: attempt.percentile,
        timeTaken: attempt.timeTaken,
        correctCount: attempt.correctCount,
        incorrectCount: attempt.incorrectCount,
        skippedCount: attempt.skippedCount,
        sectionWiseResults: attempt.sectionWiseResults,
        topicWiseResults,
        difficultyBreakdown,
        timeAnalysis: {
          totalTime: attempt.timeTaken,
          avgTimePerQuestion:
            attempt.answers.length > 0 ? Math.round(attempt.timeTaken / attempt.answers.length) : 0,
          timeOnCorrect: correctTime,
          timeOnIncorrect: incorrectTime,
          timeOnSkipped: skippedTime
        },
        attemptHistory: previousAttempts
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  startTest,
  saveAnswer,
  markForReview,
  submitTest,
  getTestResult,
  getTestAnalysis
};
