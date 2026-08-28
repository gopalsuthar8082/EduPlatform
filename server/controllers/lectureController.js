const mongoose = require('mongoose');
const Lecture = require('../models/Lecture');
const LectureProgress = require('../models/LectureProgress');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Quiz = require('../models/Quiz');
const { ErrorResponse } = require('../middleware/errorHandler');
const { CONTENT_STATUS, USER_ROLES } = require('../config/constants');
const { getPagination, formatPagination } = require('../utils/pagination');

/**
 * @desc    Get lectures with filtering, search, sorting, and pagination
 * @route   GET /api/lectures
 * @access  Public
 */
const getLectures = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 15, 50);
    const {
      course,
      subject,
      chapter,
      topic,
      instructor,
      status,
      search,
      sort
    } = req.query;

    const filter = {};

    // Filter by hierarchy
    if (course && mongoose.Types.ObjectId.isValid(course)) filter.course = course;
    if (subject && mongoose.Types.ObjectId.isValid(subject)) filter.subject = subject;
    if (chapter && mongoose.Types.ObjectId.isValid(chapter)) filter.chapter = chapter;
    if (topic && mongoose.Types.ObjectId.isValid(topic)) filter.topic = topic;
    if (instructor && mongoose.Types.ObjectId.isValid(instructor)) filter.instructor = instructor;

    // Status filter
    if (status) {
      filter.status = status;
    } else {
      filter.status = CONTENT_STATUS.PUBLISHED;
    }

    // Search query
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Sorting: default by order ascending
    let sortOption = { order: 1, createdAt: 1 };
    if (sort) {
      if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'oldest') sortOption = { createdAt: 1 };
      else if (sort === 'views') sortOption = { viewCount: -1 };
      else if (sort === 'duration') sortOption = { duration: -1 };
      else if (sort === 'title') sortOption = { title: 1 };
    }

    const total = await Lecture.countDocuments(filter);
    const lectures = await Lecture.find(filter)
      .populate('instructor', 'name avatar role')
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('chapter', 'name slug')
      .populate('topic', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: lectures.length,
      pagination: formatPagination(total, page, limit),
      data: lectures
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single lecture by ID, increment viewCount, and attach user progress
 * @route   GET /api/lectures/:id
 * @access  Public (Optional Auth)
 */
const getLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('instructor', 'name avatar email profile role')
      .populate('course', 'title slug instructor')
      .populate('subject', 'name slug')
      .populate('chapter', 'name slug')
      .populate('topic', 'name slug');

    if (!lecture) {
      return next(new ErrorResponse('Lecture not found', 404));
    }

    // Fetch user progress if user is authenticated
    let userProgress = null;
    if (req.user) {
      userProgress = await LectureProgress.findOne({
        user: req.user.id,
        lecture: lecture._id
      });
    }

    res.status(200).json({
      success: true,
      data: lecture,
      progress: userProgress
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new lecture
 * @route   POST /api/lectures
 * @access  Private (Admin, Content Manager, Instructor)
 */
const createLecture = async (req, res, next) => {
  try {
    const lectureData = { ...req.body };

    if (!lectureData.title || !lectureData.videoUrl) {
      return next(
        new ErrorResponse('Please provide a lecture title and video URL', 400)
      );
    }

    // Assign instructor
    if (!lectureData.instructor || req.user.role === USER_ROLES.INSTRUCTOR) {
      lectureData.instructor = req.user.id;
    }

    const lecture = await Lecture.create(lectureData);

    const populatedLecture = await Lecture.findById(lecture._id)
      .populate('instructor', 'name avatar role')
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('chapter', 'name slug')
      .populate('topic', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: populatedLecture
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update lecture details
 * @route   PUT /api/lectures/:id
 * @access  Private (Admin, Content Manager, Owner Instructor)
 */
const updateLecture = async (req, res, next) => {
  try {
    let lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return next(new ErrorResponse('Lecture not found', 404));
    }

    // Check ownership / admin permissions
    const isOwner =
      lecture.instructor && lecture.instructor.toString() === req.user.id;
    const isStaff = [
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER
    ].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return next(
        new ErrorResponse('Not authorized to update this lecture', 403)
      );
    }

    lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('instructor', 'name avatar role')
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('chapter', 'name slug')
      .populate('topic', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Lecture updated successfully',
      data: lecture
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete lecture
 * @route   DELETE /api/lectures/:id
 * @access  Private (Admin, Content Manager, Owner Instructor)
 */
const deleteLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return next(new ErrorResponse('Lecture not found', 404));
    }

    const isOwner =
      lecture.instructor && lecture.instructor.toString() === req.user.id;
    const isStaff = [
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER
    ].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return next(
        new ErrorResponse('Not authorized to delete this lecture', 403)
      );
    }

    await Lecture.findByIdAndDelete(req.params.id);

    // Clean up lecture progress records
    await LectureProgress.deleteMany({ lecture: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update or create user's progress for a lecture
 * @route   PUT /api/lectures/:id/progress
 * @access  Private (Authenticated User)
 */
const updateProgress = async (req, res, next) => {
  try {
    const { watchedDuration, totalDuration, lastPosition } = req.body;

    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return next(new ErrorResponse('Lecture not found', 404));
    }

    const totalSec = totalDuration || lecture.duration || 1;
    const watchedSec = watchedDuration !== undefined ? watchedDuration : 0;
    const completionPercentage = Math.min(
      100,
      Math.round((watchedSec / totalSec) * 100)
    );
    const isCompleted = completionPercentage >= 90;

    let progress = await LectureProgress.findOne({
      user: req.user.id,
      lecture: lecture._id
    });

    if (!progress) {
      progress = new LectureProgress({
        user: req.user.id,
        lecture: lecture._id,
        watchedDuration: watchedSec,
        totalDuration: totalSec,
        completionPercentage,
        lastPosition: lastPosition || 0,
        isCompleted
      });
    } else {
      // Keep maximum watched progress
      progress.watchedDuration = Math.max(
        progress.watchedDuration,
        watchedSec
      );
      progress.totalDuration = totalSec;
      if (lastPosition !== undefined) {
        progress.lastPosition = lastPosition;
      }
      progress.completionPercentage = Math.max(
        progress.completionPercentage,
        completionPercentage
      );
      if (progress.completionPercentage >= 90) {
        progress.isCompleted = true;
      }
    }

    await progress.save();

    // Synchronize with Course Enrollment if course is associated
    if (lecture.course) {
      const enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: lecture.course
      });

      if (enrollment) {
        // If lecture completed, add to completedLectures set
        if (progress.isCompleted) {
          if (!enrollment.completedLectures.some((id) => id.toString() === lecture._id.toString())) {
            enrollment.completedLectures.push(lecture._id);
          }
        }

        // Recalculate enrollment overall progress
        const totalCourseLectures = await Lecture.countDocuments({
          course: lecture.course,
          status: CONTENT_STATUS.PUBLISHED
        });
        const totalCourseQuizzes = await Quiz.countDocuments({
          course: lecture.course,
          isPublished: true
        });

        const totalItems = totalCourseLectures + totalCourseQuizzes;
        if (totalItems > 0) {
          const completedCount =
            enrollment.completedLectures.length +
            enrollment.completedQuizzes.length;
          enrollment.overallProgress = Math.min(
            100,
            Math.round((completedCount / totalItems) * 100)
          );
          if (enrollment.overallProgress >= 100) {
            enrollment.status = 'completed';
          }
        }

        enrollment.lastAccessedAt = new Date();
        await enrollment.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Lecture progress updated successfully',
      data: progress
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user's progress for a specific lecture
 * @route   GET /api/lectures/:id/progress
 * @access  Private (Authenticated User)
 */
const getProgress = async (req, res, next) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return next(new ErrorResponse('Lecture not found', 404));
    }

    const progress = await LectureProgress.findOne({
      user: req.user.id,
      lecture: lecture._id
    });

    res.status(200).json({
      success: true,
      data: progress || {
        user: req.user.id,
        lecture: lecture._id,
        watchedDuration: 0,
        totalDuration: lecture.duration || 0,
        completionPercentage: 0,
        lastPosition: 0,
        isCompleted: false
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLectures,
  getLecture,
  createLecture,
  updateLecture,
  deleteLecture,
  updateProgress,
  getProgress
};
