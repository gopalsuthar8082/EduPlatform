const mongoose = require('mongoose');
const slugify = require('slugify');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Enrollment = require('../models/Enrollment');
const Lecture = require('../models/Lecture');
const Quiz = require('../models/Quiz');
const { ErrorResponse } = require('../middleware/errorHandler');
const { CONTENT_STATUS, USER_ROLES } = require('../config/constants');
const { getPagination, formatPagination } = require('../utils/pagination');

/**
 * @desc    Get all courses with filtering, search, and pagination
 * @route   GET /api/courses
 * @access  Public
 */
const getCourses = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 12, 50);
    const { search, category, difficulty, status, instructor, sort } = req.query;

    const filter = {};

    // Filter by status (default to published for public queries)
    if (status) {
      filter.status = status;
    } else {
      filter.status = CONTENT_STATUS.PUBLISHED;
    }

    // Category filter
    if (category) {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Difficulty filter
    if (difficulty) {
      filter.difficulty = difficulty.toLowerCase();
    }

    // Instructor filter
    if (instructor && mongoose.Types.ObjectId.isValid(instructor)) {
      filter.instructor = instructor;
    }

    // Search query across title, description, category, and tags
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort) {
      if (sort === 'popular') sortOption = { enrollmentCount: -1 };
      else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'oldest') sortOption = { createdAt: 1 };
      else if (sort === 'title_asc') sortOption = { title: 1 };
      else if (sort === 'title_desc') sortOption = { title: -1 };
    }

    // Execute queries
    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar email role')
      .populate({
        path: 'subjects',
        select: 'name slug order isActive'
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: courses.length,
      pagination: formatPagination(total, page, limit),
      data: courses
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single course by ID or Slug
 * @route   GET /api/courses/:id
 * @access  Public (Optional auth for enrollment status)
 */
const getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const query = isObjectId ? { _id: id } : { slug: id };

    const course = await Course.findOne(query)
      .populate('instructor', 'name avatar email profile role')
      .populate({
        path: 'subjects',
        match: { isActive: true },
        options: { sort: { order: 1 } },
        populate: {
          path: 'chapters',
          match: { isActive: true },
          options: { sort: { order: 1 } },
          populate: {
            path: 'topics',
            match: { isActive: true },
            options: { sort: { order: 1 } }
          }
        }
      });

    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    // Check enrollment status if user is authenticated
    let isEnrolled = false;
    let enrollment = null;

    if (req.user) {
      enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: course._id
      });
      if (enrollment) {
        isEnrolled = true;
      }
    }

    res.status(200).json({
      success: true,
      data: course,
      isEnrolled,
      enrollment
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private (Admin, Content Manager, Instructor)
 */
const createCourse = async (req, res, next) => {
  try {
    const courseData = { ...req.body };

    // Set instructor
    if (
      !courseData.instructor ||
      req.user.role === USER_ROLES.INSTRUCTOR
    ) {
      courseData.instructor = req.user.id;
    }

    // Generate slug
    if (courseData.title) {
      courseData.slug = slugify(courseData.title, { lower: true, strict: true });
    }

    // Set published status
    if (courseData.status === CONTENT_STATUS.PUBLISHED) {
      courseData.isPublished = true;
    }

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update course details
 * @route   PUT /api/courses/:id
 * @access  Private (Admin, Content Manager, Owner Instructor)
 */
const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    // Check ownership / admin permissions
    const isOwner = course.instructor.toString() === req.user.id;
    const isStaff = [
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER
    ].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return next(
        new ErrorResponse('Not authorized to update this course', 403)
      );
    }

    // Re-slugify if title changed
    if (req.body.title && req.body.title !== course.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    // Synchronize isPublished if status changes
    if (req.body.status) {
      req.body.isPublished = req.body.status === CONTENT_STATUS.PUBLISHED;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('instructor', 'name avatar email');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/courses/:id
 * @access  Private (Admin only)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    await Course.findByIdAndDelete(req.params.id);

    // Also remove related enrollments
    await Enrollment.deleteMany({ course: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Course and related data deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update course status (draft/review/published/archived)
 * @route   PUT /api/courses/:id/status
 * @access  Private (Admin, Content Manager)
 */
const updateCourseStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !Object.values(CONTENT_STATUS).includes(status)) {
      return next(
        new ErrorResponse(
          `Invalid status value. Allowed: ${Object.values(CONTENT_STATUS).join(', ')}`,
          400
        )
      );
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    course.status = status;
    course.isPublished = status === CONTENT_STATUS.PUBLISHED;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course status updated to '${status}'`,
      data: course
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Enroll current user in a course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (Authenticated User)
 */
const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: course._id
    });

    if (existingEnrollment) {
      return next(
        new ErrorResponse('You are already enrolled in this course', 400)
      );
    }

    // Create enrollment record
    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: course._id,
      completedTopics: [],
      completedLectures: [],
      completedQuizzes: [],
      overallProgress: 0,
      status: 'active',
      lastAccessedAt: new Date()
    });

    // Increment course enrollmentCount
    await Course.findByIdAndUpdate(course._id, {
      $inc: { enrollmentCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get user's progress in a course
 * @route   GET /api/courses/:id/progress
 * @access  Private (Authenticated User)
 */
const getCourseProgress = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    })
      .populate('completedLectures', 'title duration order')
      .populate('completedTopics', 'name order')
      .populate('completedQuizzes', 'title totalMarks');

    if (!enrollment) {
      return next(
        new ErrorResponse('You are not enrolled in this course', 404)
      );
    }

    // Calculate total course contents for accurate percentage
    const totalLectures = await Lecture.countDocuments({
      course: courseId,
      status: CONTENT_STATUS.PUBLISHED
    });

    const totalQuizzes = await Quiz.countDocuments({
      course: courseId,
      isPublished: true
    });

    const totalItems = totalLectures + totalQuizzes;
    let calculatedProgress = enrollment.overallProgress;

    if (totalItems > 0) {
      const completedItems =
        enrollment.completedLectures.length + enrollment.completedQuizzes.length;
      calculatedProgress = Math.min(
        100,
        Math.round((completedItems / totalItems) * 100)
      );

      // Update enrollment progress if changed
      if (enrollment.overallProgress !== calculatedProgress) {
        enrollment.overallProgress = calculatedProgress;
        if (calculatedProgress === 100) {
          enrollment.status = 'completed';
        }
        await enrollment.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        enrollment,
        stats: {
          totalLectures,
          completedLectures: enrollment.completedLectures.length,
          totalQuizzes,
          completedQuizzes: enrollment.completedQuizzes.length,
          overallProgress: calculatedProgress,
          isCompleted: calculatedProgress >= 100
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
  enrollCourse,
  getCourseProgress
};
