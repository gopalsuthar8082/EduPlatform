const { Announcement, Enrollment } = require('../models');
const { ErrorResponse } = require('../middleware/errorHandler');
const { ANNOUNCEMENT_AUDIENCE, ANNOUNCEMENT_PRIORITY, USER_ROLES } = require('../config/constants');

/**
 * @desc    Get announcements with audience filter, active status & expiration check
 * @route   GET /api/announcements
 * @access  Public / Authenticated
 */
const getAnnouncements = async (req, res, next) => {
  try {
    const {
      targetAudience,
      course,
      priority,
      isActive = 'true',
      search,
      page = 1,
      limit = 20
    } = req.query;

    const now = new Date();
    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Check expiration
    if (query.isActive) {
      query.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ];
    }

    if (priority) query.priority = priority;
    if (course) query.course = course;

    // Filter by audience for regular users / students
    const isStaff =
      req.user &&
      [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN, USER_ROLES.INSTRUCTOR].includes(req.user.role);

    if (!isStaff) {
      const audienceConditions = [{ targetAudience: ANNOUNCEMENT_AUDIENCE.ALL }];

      if (req.user) {
        // User role specific announcements
        audienceConditions.push({
          targetAudience: ANNOUNCEMENT_AUDIENCE.ROLE,
          targetRole: req.user.role
        });

        // Fetch user's enrolled courses to include course announcements
        const enrollments = await Enrollment.find({
          user: req.user._id,
          status: 'active'
        }).select('course');

        const enrolledCourseIds = enrollments.map((e) => e.course);
        if (enrolledCourseIds.length > 0) {
          audienceConditions.push({
            targetAudience: ANNOUNCEMENT_AUDIENCE.COURSE,
            course: { $in: enrolledCourseIds }
          });
        }
      }

      query.$and = [{ $or: audienceConditions }];
    } else if (targetAudience) {
      query.targetAudience = targetAudience;
    }

    if (search) {
      const searchCondition = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { body: { $regex: search, $options: 'i' } }
        ]
      };
      if (query.$and) {
        query.$and.push(searchCondition);
      } else {
        query.$and = [searchCondition];
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Announcement.countDocuments(query);

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name email avatar role')
      .populate('course', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: announcements.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      data: announcements
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new announcement
 * @route   POST /api/announcements
 * @access  Private (Superadmin, Admin, Instructor)
 */
const createAnnouncement = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    if (!req.body.title || !req.body.body) {
      return next(new ErrorResponse('Please provide title and body for announcement', 400));
    }

    const announcement = await Announcement.create(req.body);

    const populated = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email avatar role')
      .populate('course', 'title');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: populated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an announcement
 * @route   PUT /api/announcements/:id
 * @access  Private (Superadmin, Admin, Instructor)
 */
const updateAnnouncement = async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return next(new ErrorResponse(`Announcement not found with id ${req.params.id}`, 404));
    }

    const isCreator = announcement.createdBy.toString() === req.user._id.toString();
    const isAdmin = [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN].includes(req.user.role);

    if (!isCreator && !isAdmin) {
      return next(new ErrorResponse('Not authorized to edit this announcement', 403));
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('createdBy', 'name email avatar role')
      .populate('course', 'title');

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete an announcement
 * @route   DELETE /api/announcements/:id
 * @access  Private (Superadmin, Admin, Instructor)
 */
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return next(new ErrorResponse(`Announcement not found with id ${req.params.id}`, 404));
    }

    const isCreator = announcement.createdBy.toString() === req.user._id.toString();
    const isAdmin = [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN].includes(req.user.role);

    if (!isCreator && !isAdmin) {
      return next(new ErrorResponse('Not authorized to delete this announcement', 403));
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
