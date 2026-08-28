const { Discussion, Reply, User } = require('../models');
const { ErrorResponse } = require('../middleware/errorHandler');
const { DISCUSSION_STATUS, USER_ROLES } = require('../config/constants');

/**
 * @desc    Get all discussions with filters, search, sorting & pagination
 * @route   GET /api/discussions
 * @access  Public / Authenticated
 */
const getDiscussions = async (req, res, next) => {
  try {
    const {
      course,
      subject,
      chapter,
      topic,
      search,
      sort = 'recent', // 'recent', 'popular', 'unanswered'
      tag,
      status = DISCUSSION_STATUS.ACTIVE,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (course) query.course = course;
    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;
    if (topic) query.topic = topic;
    if (status) query.status = status;

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { isPinned: -1, createdAt: -1 };

    if (sort === 'popular') {
      sortOption = { isPinned: -1, replyCount: -1, createdAt: -1 };
    } else if (sort === 'unanswered') {
      query.isAnswered = false;
      query.replyCount = 0;
      sortOption = { isPinned: -1, createdAt: -1 };
    } else if (sort === 'views') {
      sortOption = { isPinned: -1, views: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Discussion.countDocuments(query);

    const discussions = await Discussion.find(query)
      .populate('author', 'name avatar role')
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const formatted = discussions.map((d) => {
      const dObj = d.toObject();
      dObj.upvotesCount = d.upvotes ? d.upvotes.length : 0;
      dObj.downvotesCount = d.downvotes ? d.downvotes.length : 0;
      return dObj;
    });

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      data: formatted
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single discussion with full replies tree & increment views
 * @route   GET /api/discussions/:id
 * @access  Public / Authenticated
 */
const getDiscussion = async (req, res, next) => {
  try {
    const { sortBy = 'recent' } = req.query;

    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar role')
      .populate('course', 'title')
      .populate('subject', 'name')
      .populate('chapter', 'title')
      .populate('topic', 'title');

    if (!discussion) {
      return next(new ErrorResponse(`Discussion not found with id ${req.params.id}`, 404));
    }

    let replySort = { createdAt: 1 };
    if (sortBy === 'upvotes') {
      replySort = { upvotes: -1, createdAt: 1 };
    }

    const replies = await Reply.find({
      discussion: discussion._id,
      status: DISCUSSION_STATUS.ACTIVE
    })
      .populate('author', 'name avatar role')
      .sort(replySort);

    const dObj = discussion.toObject();
    dObj.upvotesCount = discussion.upvotes ? discussion.upvotes.length : 0;
    dObj.downvotesCount = discussion.downvotes ? discussion.downvotes.length : 0;
    dObj.replies = replies;

    res.status(200).json({
      success: true,
      data: dObj
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new discussion post
 * @route   POST /api/discussions
 * @access  Private (Authenticated users)
 */
const createDiscussion = async (req, res, next) => {
  try {
    req.body.author = req.user._id;

    const discussion = await Discussion.create(req.body);

    const populatedDiscussion = await Discussion.findById(discussion._id).populate(
      'author',
      'name avatar role'
    );

    res.status(201).json({
      success: true,
      message: 'Discussion posted successfully',
      data: populatedDiscussion
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a discussion post
 * @route   PUT /api/discussions/:id
 * @access  Private (Author or Admin)
 */
const updateDiscussion = async (req, res, next) => {
  try {
    let discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return next(new ErrorResponse(`Discussion not found with id ${req.params.id}`, 404));
    }

    const isAuthor = discussion.author.toString() === req.user._id.toString();
    const isAdmin = [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return next(
        new ErrorResponse('Not authorized to edit this discussion post', 403)
      );
    }

    // Restrict fields non-admins can edit
    const allowedUpdates = {
      title: req.body.title || discussion.title,
      body: req.body.body || discussion.body,
      bodyHtml: req.body.bodyHtml || discussion.bodyHtml,
      tags: req.body.tags || discussion.tags
    };

    if (isAdmin) {
      if (req.body.isPinned !== undefined) allowedUpdates.isPinned = req.body.isPinned;
      if (req.body.isClosed !== undefined) allowedUpdates.isClosed = req.body.isClosed;
      if (req.body.status) allowedUpdates.status = req.body.status;
    }

    discussion = await Discussion.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true,
      runValidators: true
    }).populate('author', 'name avatar role');

    res.status(200).json({
      success: true,
      message: 'Discussion updated successfully',
      data: discussion
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a discussion post
 * @route   DELETE /api/discussions/:id
 * @access  Private (Author or Admin)
 */
const deleteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return next(new ErrorResponse(`Discussion not found with id ${req.params.id}`, 404));
    }

    const isAuthor = discussion.author.toString() === req.user._id.toString();
    const isAdmin = [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return next(
        new ErrorResponse('Not authorized to delete this discussion post', 403)
      );
    }

    await Discussion.findByIdAndDelete(req.params.id);
    await Reply.deleteMany({ discussion: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Discussion and related replies deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add a reply to a discussion
 * @route   POST /api/discussions/:id/reply
 * @access  Private (Authenticated users)
 */
const addReply = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return next(new ErrorResponse(`Discussion not found with id ${req.params.id}`, 404));
    }

    if (discussion.isClosed) {
      return next(new ErrorResponse('This discussion thread is closed for new replies', 400));
    }

    const isInstructor = [
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.INSTRUCTOR
    ].includes(req.user.role);

    const reply = await Reply.create({
      body: req.body.body,
      bodyHtml: req.body.bodyHtml,
      author: req.user._id,
      discussion: discussion._id,
      parentReply: req.body.parentReply || null,
      isInstructorReply: isInstructor
    });

    // Increment reply count on discussion
    await Discussion.findByIdAndUpdate(discussion._id, {
      $inc: { replyCount: 1 }
    });

    const populatedReply = await Reply.findById(reply._id).populate(
      'author',
      'name avatar role'
    );

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: populatedReply
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Upvote / Toggle upvote for a discussion
 * @route   PUT /api/discussions/:id/upvote
 * @access  Private (Authenticated users)
 */
const upvoteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return next(new ErrorResponse(`Discussion not found with id ${req.params.id}`, 404));
    }

    const userIdStr = req.user._id.toString();
    const upvotedIndex = discussion.upvotes.findIndex((id) => id.toString() === userIdStr);
    const downvotedIndex = discussion.downvotes.findIndex((id) => id.toString() === userIdStr);

    // Remove from downvotes if present
    if (downvotedIndex !== -1) {
      discussion.downvotes.splice(downvotedIndex, 1);
    }

    // Toggle upvote
    let isUpvoted = false;
    if (upvotedIndex !== -1) {
      discussion.upvotes.splice(upvotedIndex, 1);
    } else {
      discussion.upvotes.push(req.user._id);
      isUpvoted = true;
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      isUpvoted,
      upvotesCount: discussion.upvotes.length,
      downvotesCount: discussion.downvotes.length
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Downvote / Toggle downvote for a discussion
 * @route   PUT /api/discussions/:id/downvote
 * @access  Private (Authenticated users)
 */
const downvoteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return next(new ErrorResponse(`Discussion not found with id ${req.params.id}`, 404));
    }

    const userIdStr = req.user._id.toString();
    const upvotedIndex = discussion.upvotes.findIndex((id) => id.toString() === userIdStr);
    const downvotedIndex = discussion.downvotes.findIndex((id) => id.toString() === userIdStr);

    // Remove from upvotes if present
    if (upvotedIndex !== -1) {
      discussion.upvotes.splice(upvotedIndex, 1);
    }

    // Toggle downvote
    let isDownvoted = false;
    if (downvotedIndex !== -1) {
      discussion.downvotes.splice(downvotedIndex, 1);
    } else {
      discussion.downvotes.push(req.user._id);
      isDownvoted = true;
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      isDownvoted,
      upvotesCount: discussion.upvotes.length,
      downvotesCount: discussion.downvotes.length
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Mark reply as helpful / accepted answer
 * @route   PUT /api/discussions/:id/replies/:replyId/helpful
 * @access  Private (Discussion author or Admin)
 */
const markReplyHelpful = async (req, res, next) => {
  try {
    const { id, replyId } = req.params;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return next(new ErrorResponse(`Discussion not found with id ${id}`, 404));
    }

    const isAuthor = discussion.author.toString() === req.user._id.toString();
    const isAdmin = [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return next(
        new ErrorResponse('Only the discussion author or an admin can mark answers as helpful', 403)
      );
    }

    const reply = await Reply.findOne({ _id: replyId, discussion: id });
    if (!reply) {
      return next(new ErrorResponse(`Reply not found with id ${replyId}`, 404));
    }

    // Toggle helpful state
    reply.isMarkedHelpful = !reply.isMarkedHelpful;
    await reply.save();

    // Check if any replies are marked helpful to update discussion isAnswered
    const anyHelpful = await Reply.exists({
      discussion: id,
      isMarkedHelpful: true
    });

    discussion.isAnswered = !!anyHelpful;
    await discussion.save();

    res.status(200).json({
      success: true,
      isMarkedHelpful: reply.isMarkedHelpful,
      isAnswered: discussion.isAnswered,
      message: reply.isMarkedHelpful ? 'Reply marked as helpful' : 'Helpful mark removed'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  upvoteDiscussion,
  downvoteDiscussion,
  markReplyHelpful
};
