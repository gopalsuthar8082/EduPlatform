const {
  User,
  TestAttempt,
  QuizAttempt,
  Question,
  Quiz,
  Test,
  StudyMaterial,
  Lecture,
  Subject,
  Topic
} = require('../models');
const { ATTEMPT_STATUS, CONTENT_STATUS } = require('../config/constants');

/**
 * @desc    Get student's overall performance metrics & trend
 * @route   GET /api/analytics/performance
 * @access  Private (Authenticated users)
 */
const getPerformance = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all completed quiz and test attempts
    const quizAttempts = await QuizAttempt.find({
      user: userId,
      status: 'completed'
    })
      .populate('quiz', 'title')
      .sort({ completedAt: 1 });

    const testAttempts = await TestAttempt.find({
      user: userId,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    })
      .populate('test', 'title')
      .sort({ completedAt: 1 });

    const totalQuizzes = quizAttempts.length;
    const totalTests = testAttempts.length;

    // Quiz Metrics
    const totalQuizScore = quizAttempts.reduce((acc, q) => acc + (q.score || 0), 0);
    const totalQuizAccuracy = quizAttempts.reduce((acc, q) => acc + (q.accuracy || 0), 0);
    const avgQuizScore = totalQuizzes > 0 ? Math.round((totalQuizScore / totalQuizzes) * 10) / 10 : 0;
    const avgQuizAccuracy = totalQuizzes > 0 ? Math.round(totalQuizAccuracy / totalQuizzes) : 0;

    // Test Metrics
    const totalTestScore = testAttempts.reduce((acc, t) => acc + (t.score || 0), 0);
    const totalTestAccuracy = testAttempts.reduce((acc, t) => acc + (t.accuracy || 0), 0);
    const avgTestScore = totalTests > 0 ? Math.round((totalTestScore / totalTests) * 10) / 10 : 0;
    const avgTestAccuracy = totalTests > 0 ? Math.round(totalTestAccuracy / totalTests) : 0;

    // Time spent
    const totalTimeSpent =
      quizAttempts.reduce((acc, q) => acc + (q.timeTaken || 0), 0) +
      testAttempts.reduce((acc, t) => acc + (t.timeTaken || 0), 0);

    // Performance Timeline / Improvement Trend
    const timeline = [];

    quizAttempts.forEach((q) => {
      timeline.push({
        type: 'quiz',
        title: q.quiz ? q.quiz.title : 'Quiz',
        score: q.score,
        totalMarks: q.totalMarks,
        accuracy: q.accuracy,
        date: q.completedAt || q.createdAt
      });
    });

    testAttempts.forEach((t) => {
      timeline.push({
        type: 'test',
        title: t.test ? t.test.title : 'Test',
        score: t.score,
        totalMarks: t.totalMarks,
        accuracy: t.accuracy,
        rank: t.rank,
        percentile: t.percentile,
        date: t.completedAt || t.createdAt
      });
    });

    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalQuizzes,
          totalTests,
          totalAssessments: totalQuizzes + totalTests,
          avgQuizScore,
          avgQuizAccuracy,
          avgTestScore,
          avgTestAccuracy,
          overallAccuracy:
            totalQuizzes + totalTests > 0
              ? Math.round((totalQuizAccuracy + totalTestAccuracy) / (totalQuizzes + totalTests))
              : 0,
          totalTimeSpentSeconds: totalTimeSpent
        },
        timeline
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Subject-wise and Topic-wise Performance breakdown
 * @route   GET /api/analytics/subjects
 * @access  Private (Authenticated users)
 */
const getSubjectWisePerformance = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch test attempts and quiz attempts with full question & subject populate
    const testAttempts = await TestAttempt.find({
      user: userId,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    }).populate({
      path: 'answers.question',
      select: 'subject chapter topic marks negativeMarks difficulty',
      populate: [
        { path: 'subject', select: 'name slug' },
        { path: 'topic', select: 'title' }
      ]
    });

    const quizAttempts = await QuizAttempt.find({
      user: userId,
      status: 'completed'
    }).populate({
      path: 'answers.question',
      select: 'subject chapter topic marks negativeMarks difficulty',
      populate: [
        { path: 'subject', select: 'name slug' },
        { path: 'topic', select: 'title' }
      ]
    });

    const subjectMap = {};

    const processAnswer = (ans) => {
      if (!ans.question || !ans.question.subject) return;

      const subj = ans.question.subject;
      const sId = subj._id.toString();
      const sName = subj.name;

      if (!subjectMap[sId]) {
        subjectMap[sId] = {
          subjectId: sId,
          subjectName: sName,
          totalQuestions: 0,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          skipped: 0,
          totalScore: 0,
          timeSpent: 0,
          topics: {}
        };
      }

      subjectMap[sId].totalQuestions++;
      subjectMap[sId].timeSpent += ans.timeTaken || 0;

      const hasAnswered =
        (Array.isArray(ans.selectedOption) && ans.selectedOption.length > 0) ||
        (ans.textAnswer && ans.textAnswer.trim().length > 0);

      if (!hasAnswered) {
        subjectMap[sId].skipped++;
      } else {
        subjectMap[sId].attempted++;
        if (ans.isCorrect) {
          subjectMap[sId].correct++;
        } else {
          subjectMap[sId].incorrect++;
        }
      }

      subjectMap[sId].totalScore += ans.marksObtained || 0;

      // Track by Topic as well
      if (ans.question.topic) {
        const topId = ans.question.topic._id.toString();
        const topTitle = ans.question.topic.title;
        if (!subjectMap[sId].topics[topId]) {
          subjectMap[sId].topics[topId] = {
            topicId: topId,
            topicName: topTitle,
            attempted: 0,
            correct: 0,
            accuracy: 0
          };
        }
        if (hasAnswered) {
          subjectMap[sId].topics[topId].attempted++;
          if (ans.isCorrect) subjectMap[sId].topics[topId].correct++;
        }
      }
    };

    testAttempts.forEach((t) => t.answers.forEach(processAnswer));
    quizAttempts.forEach((q) => q.answers.forEach(processAnswer));

    const result = Object.values(subjectMap).map((s) => {
      s.accuracy = s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0;
      const topicList = Object.values(s.topics).map((top) => {
        top.accuracy = top.attempted > 0 ? Math.round((top.correct / top.attempted) * 100) : 0;
        return top;
      });
      s.topics = topicList;
      return s;
    });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get detailed test history with rank and percentile
 * @route   GET /api/analytics/test-history
 * @access  Private (Authenticated users)
 */
const getTestHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const attempts = await TestAttempt.find({
      user: userId,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    })
      .populate('test', 'title type duration totalMarks course subject')
      .sort({ completedAt: -1 });

    const formatted = attempts.map((a) => ({
      attemptId: a._id,
      test: a.test,
      score: a.score,
      totalMarks: a.totalMarks,
      accuracy: a.accuracy,
      correctCount: a.correctCount,
      incorrectCount: a.incorrectCount,
      skippedCount: a.skippedCount,
      timeTaken: a.timeTaken,
      rank: a.rank,
      percentile: a.percentile,
      completedAt: a.completedAt || a.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Leaderboard rankings by test attempts
 * @route   GET /api/analytics/leaderboard
 * @access  Public / Authenticated
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { scope = 'overall', testId, courseId, timeframe = 'all' } = req.query;

    const matchQuery = {
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    };

    if (testId) matchQuery.test = testId;

    if (timeframe === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchQuery.createdAt = { $gte: weekAgo };
    } else if (timeframe === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      matchQuery.createdAt = { $gte: monthAgo };
    }

    const leaderboardAgg = await TestAttempt.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          avgAccuracy: { $avg: '$accuracy' },
          highestScore: { $max: '$score' },
          testsCompleted: { $sum: 1 },
          totalTimeSpent: { $sum: '$timeTaken' }
        }
      },
      { $sort: { totalScore: -1, avgAccuracy: -1 } },
      { $limit: 50 }
    ]);

    // Populate user profiles
    const userIds = leaderboardAgg.map((item) => item._id);
    const users = await User.find({ _id: { $in: userIds } }).select('name email avatar studyStreak');
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const rankedLeaderboard = leaderboardAgg.map((item, index) => {
      const user = userMap.get(item._id.toString());
      return {
        rank: index + 1,
        user: {
          id: item._id,
          name: user ? user.name : 'Unknown Student',
          avatar: user ? user.avatar : '',
          streak: user && user.studyStreak ? user.studyStreak.current : 0
        },
        totalScore: Math.round(item.totalScore * 10) / 10,
        avgAccuracy: Math.round(item.avgAccuracy || 0),
        highestScore: item.highestScore,
        testsCompleted: item.testsCompleted,
        totalTimeSpent: item.totalTimeSpent
      };
    });

    res.status(200).json({
      success: true,
      timeframe,
      scope,
      count: rankedLeaderboard.length,
      data: rankedLeaderboard
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get rule-based personalized learning recommendations
 * @route   GET /api/analytics/recommendations
 * @access  Private (Authenticated users)
 */
const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Analyze recent test and quiz attempts to detect weak subjects/topics
    const recentAttempts = await TestAttempt.find({
      user: userId,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.COMPLETED] }
    })
      .sort({ completedAt: -1 })
      .limit(10)
      .populate({
        path: 'answers.question',
        select: 'subject topic difficulty isCorrect',
        populate: [
          { path: 'subject', select: 'name' },
          { path: 'topic', select: 'title' }
        ]
      });

    const topicStats = {};
    const subjectStats = {};

    recentAttempts.forEach((att) => {
      att.answers.forEach((ans) => {
        if (!ans.question) return;

        // Subject stats
        if (ans.question.subject) {
          const sId = ans.question.subject._id.toString();
          const sName = ans.question.subject.name;
          if (!subjectStats[sId]) {
            subjectStats[sId] = { id: sId, name: sName, correct: 0, total: 0 };
          }
          subjectStats[sId].total++;
          if (ans.isCorrect) subjectStats[sId].correct++;
        }

        // Topic stats
        if (ans.question.topic) {
          const tId = ans.question.topic._id.toString();
          const tTitle = ans.question.topic.title;
          if (!topicStats[tId]) {
            topicStats[tId] = {
              id: tId,
              title: tTitle,
              subjectId: ans.question.subject ? ans.question.subject._id : null,
              correct: 0,
              total: 0
            };
          }
          topicStats[tId].total++;
          if (ans.isCorrect) topicStats[tId].correct++;
        }
      });
    });

    // Identify weak topics (accuracy < 60%)
    const weakTopics = Object.values(topicStats)
      .map((t) => {
        t.accuracy = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
        return t;
      })
      .filter((t) => t.accuracy < 60 && t.total >= 1)
      .sort((a, b) => a.accuracy - b.accuracy);

    const weakTopicIds = weakTopics.map((t) => t.id);

    // Identify weak subjects (accuracy < 60%)
    const weakSubjects = Object.values(subjectStats)
      .map((s) => {
        s.accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        return s;
      })
      .filter((s) => s.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy);

    const weakSubjectIds = weakSubjects.map((s) => s.id);

    // 2. Fetch recommended quizzes, lectures, study materials for weak areas
    let recommendedQuizzes = [];
    let recommendedMaterials = [];
    let recommendedLectures = [];

    if (weakTopicIds.length > 0 || weakSubjectIds.length > 0) {
      const topicOrSubjectFilter = {
        status: CONTENT_STATUS.PUBLISHED,
        $or: [
          ...(weakTopicIds.length > 0 ? [{ topic: { $in: weakTopicIds } }] : []),
          ...(weakSubjectIds.length > 0 ? [{ subject: { $in: weakSubjectIds } }] : [])
        ]
      };

      recommendedQuizzes = await Quiz.find(topicOrSubjectFilter)
        .populate('subject', 'name')
        .populate('topic', 'title')
        .select('title duration totalMarks subject topic')
        .limit(5);

      recommendedMaterials = await StudyMaterial.find(topicOrSubjectFilter)
        .populate('subject', 'name')
        .populate('topic', 'title')
        .select('title fileType fileUrl fileSize subject topic')
        .limit(5);

      recommendedLectures = await Lecture.find(topicOrSubjectFilter)
        .populate('subject', 'name')
        .populate('topic', 'title')
        .select('title duration videoUrl subject topic')
        .limit(5);
    } else {
      // If no weak areas detected (or new user), recommend popular/recent items
      recommendedQuizzes = await Quiz.find({ status: CONTENT_STATUS.PUBLISHED })
        .populate('subject', 'name')
        .select('title duration totalMarks subject')
        .limit(5);

      recommendedMaterials = await StudyMaterial.find({ status: CONTENT_STATUS.PUBLISHED })
        .populate('subject', 'name')
        .select('title fileType fileUrl fileSize subject')
        .limit(5);

      recommendedLectures = await Lecture.find({ status: CONTENT_STATUS.PUBLISHED })
        .populate('subject', 'name')
        .select('title duration videoUrl subject')
        .limit(5);
    }

    res.status(200).json({
      success: true,
      data: {
        weakAreas: {
          topics: weakTopics,
          subjects: weakSubjects
        },
        recommendedQuizzes,
        recommendedMaterials,
        recommendedLectures
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPerformance,
  getSubjectWisePerformance,
  getTestHistory,
  getLeaderboard,
  getRecommendations
};
