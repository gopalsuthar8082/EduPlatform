const { Poll } = require('../models');
const { ErrorResponse } = require('../middleware/errorHandler');

/**
 * @desc    Get all polls with filters & pagination
 * @route   GET /api/polls
 * @access  Public / Authenticated
 */
const getPolls = async (req, res, next) => {
  try {
    const {
      course,
      lecture,
      discussion,
      isActive,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (course) query.course = course;
    if (lecture) query.lecture = lecture;
    if (discussion) query.discussion = discussion;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Poll.countDocuments(query);

    const polls = await Poll.find(query)
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const userIdStr = req.user ? req.user._id.toString() : null;

    const formattedPolls = polls.map((poll) => {
      const pObj = poll.toObject();
      let userVotedIndex = -1;

      pObj.options = poll.options.map((opt, idx) => {
        const hasVoted = userIdStr && opt.votes.some((v) => v.toString() === userIdStr);
        if (hasVoted) userVotedIndex = idx;
        return {
          _id: opt._id,
          text: opt.text,
          voteCount: opt.votes ? opt.votes.length : 0,
          percentage:
            poll.totalVotes > 0
              ? Math.round(((opt.votes ? opt.votes.length : 0) / poll.totalVotes) * 100)
              : 0
        };
      });

      pObj.hasVoted = userVotedIndex !== -1;
      pObj.userVotedIndex = userVotedIndex;
      return pObj;
    });

    res.status(200).json({
      success: true,
      count: formattedPolls.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      data: formattedPolls
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single poll by ID
 * @route   GET /api/polls/:id
 * @access  Public / Authenticated
 */
const getPoll = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('createdBy', 'name avatar');

    if (!poll) {
      return next(new ErrorResponse(`Poll not found with id ${req.params.id}`, 404));
    }

    const userIdStr = req.user ? req.user._id.toString() : null;
    let userVotedIndex = -1;

    const pObj = poll.toObject();
    pObj.options = poll.options.map((opt, idx) => {
      const hasVoted = userIdStr && opt.votes.some((v) => v.toString() === userIdStr);
      if (hasVoted) userVotedIndex = idx;
      return {
        _id: opt._id,
        text: opt.text,
        voteCount: opt.votes ? opt.votes.length : 0,
        percentage:
          poll.totalVotes > 0
            ? Math.round(((opt.votes ? opt.votes.length : 0) / poll.totalVotes) * 100)
            : 0
      };
    });

    pObj.hasVoted = userVotedIndex !== -1;
    pObj.userVotedIndex = userVotedIndex;

    res.status(200).json({
      success: true,
      data: pObj
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new poll
 * @route   POST /api/polls
 * @access  Private (Admin, Instructor)
 */
const createPoll = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;

    if (!req.body.options || !Array.isArray(req.body.options) || req.body.options.length < 2) {
      return next(new ErrorResponse('A poll must have at least 2 options', 400));
    }

    const formattedOptions = req.body.options.map((opt) => ({
      text: typeof opt === 'string' ? opt : opt.text,
      votes: []
    }));

    req.body.options = formattedOptions;

    const poll = await Poll.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: poll
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Vote on a poll option
 * @route   POST /api/polls/:id/vote
 * @access  Private (Authenticated users)
 */
const votePoll = async (req, res, next) => {
  try {
    const { optionIndex } = req.body;

    if (optionIndex === undefined || optionIndex === null) {
      return next(new ErrorResponse('Please select an option to vote', 400));
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return next(new ErrorResponse(`Poll not found with id ${req.params.id}`, 404));
    }

    if (!poll.isActive) {
      return next(new ErrorResponse('This poll is no longer active', 400));
    }

    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      poll.isActive = false;
      await poll.save();
      return next(new ErrorResponse('This poll has expired', 400));
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return next(new ErrorResponse('Invalid option index selected', 400));
    }

    const userIdStr = req.user._id.toString();

    // Check if user has already voted for ANY option in this poll
    const alreadyVoted = poll.options.some((opt) =>
      opt.votes.some((v) => v.toString() === userIdStr)
    );

    if (alreadyVoted) {
      return next(new ErrorResponse('You have already voted in this poll', 400));
    }

    // Add user vote to selected option
    poll.options[optionIndex].votes.push(req.user._id);
    poll.totalVotes = (poll.totalVotes || 0) + 1;
    await poll.save();

    const formattedOptions = poll.options.map((opt, idx) => ({
      _id: opt._id,
      text: opt.text,
      voteCount: opt.votes.length,
      percentage: Math.round((opt.votes.length / poll.totalVotes) * 100)
    }));

    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        pollId: poll._id,
        totalVotes: poll.totalVotes,
        hasVoted: true,
        userVotedIndex: optionIndex,
        options: formattedOptions
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPolls,
  getPoll,
  createPoll,
  votePoll
};
