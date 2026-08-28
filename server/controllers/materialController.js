const mongoose = require('mongoose');
const path = require('path');
const StudyMaterial = require('../models/StudyMaterial');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Bookmark = require('../models/Bookmark');
const { ErrorResponse } = require('../middleware/errorHandler');
const {
  CONTENT_STATUS,
  STUDY_MATERIAL_TYPES,
  USER_ROLES,
  BOOKMARK_TYPES
} = require('../config/constants');
const { getPagination, formatPagination } = require('../utils/pagination');

/**
 * Helper to determine material type from file extension
 * @param {string} filename
 * @returns {string}
 */
const inferMaterialType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return STUDY_MATERIAL_TYPES.PDF;
  if (['.ppt', '.pptx'].includes(ext)) return STUDY_MATERIAL_TYPES.PPT;
  if (['.doc', '.docx'].includes(ext)) return STUDY_MATERIAL_TYPES.DOC;
  return STUDY_MATERIAL_TYPES.NOTES;
};

/**
 * @desc    Get study materials with filtering, search, and pagination
 * @route   GET /api/study-materials or /api/materials
 * @access  Public
 */
const getMaterials = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 12, 50);
    const {
      course,
      subject,
      chapter,
      topic,
      type,
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

    // Filter by type
    if (type && Object.values(STUDY_MATERIAL_TYPES).includes(type)) {
      filter.type = type;
    }

    // Status filter (default to published)
    if (status) {
      filter.status = status;
    } else {
      filter.status = CONTENT_STATUS.PUBLISHED;
    }

    // Search query
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort) {
      if (sort === 'views') sortOption = { viewCount: -1 };
      else if (sort === 'downloads') sortOption = { downloadCount: -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'oldest') sortOption = { createdAt: 1 };
      else if (sort === 'title') sortOption = { title: 1 };
    }

    const total = await StudyMaterial.countDocuments(filter);
    const materials = await StudyMaterial.find(filter)
      .populate('uploadedBy', 'name avatar role')
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('chapter', 'name slug')
      .populate('topic', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: materials.length,
      pagination: formatPagination(total, page, limit),
      data: materials
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single study material by ID, increment viewCount, and check bookmark
 * @route   GET /api/study-materials/:id or /api/materials/:id
 * @access  Public (Optional Auth)
 */
const getMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('uploadedBy', 'name avatar role profile')
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('chapter', 'name slug')
      .populate('topic', 'name slug');

    if (!material) {
      return next(new ErrorResponse('Study material not found', 404));
    }

    // Check if current authenticated user has bookmarked this material
    let isBookmarked = false;
    let userBookmark = null;

    if (req.user) {
      userBookmark = await Bookmark.findOne({
        user: req.user.id,
        contentType: BOOKMARK_TYPES.STUDY_MATERIAL,
        contentId: material._id
      });
      if (userBookmark) {
        isBookmarked = true;
      }
    }

    res.status(200).json({
      success: true,
      data: material,
      isBookmarked,
      bookmark: userBookmark
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new study material (with file upload support)
 * @route   POST /api/study-materials or /api/materials
 * @access  Private (Admin, Content Manager, Instructor)
 */
const createMaterial = async (req, res, next) => {
  try {
    const materialData = { ...req.body };

    // Handle file upload
    if (req.file) {
      materialData.fileUrl = `/uploads/${req.file.filename}`;
      materialData.fileName = req.file.originalname;
      materialData.fileSize = req.file.size;

      // Infer type if not specified
      if (!materialData.type) {
        materialData.type = inferMaterialType(req.file.originalname);
      }
    }

    if (!materialData.title || !materialData.fileUrl) {
      return next(
        new ErrorResponse(
          'Please provide a title and upload a file or provide a file URL',
          400
        )
      );
    }

    // Set default material type if still missing
    if (!materialData.type) {
      materialData.type = STUDY_MATERIAL_TYPES.PDF;
    }

    // Set uploadedBy to current user
    materialData.uploadedBy = req.user.id;

    // Parse tags if sent as JSON string or comma-separated string
    if (typeof materialData.tags === 'string') {
      materialData.tags = materialData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // Parse key points if sent as string
    if (typeof materialData.keyPoints === 'string') {
      try {
        materialData.keyPoints = JSON.parse(materialData.keyPoints);
      } catch (e) {
        materialData.keyPoints = materialData.keyPoints
          .split('\n')
          .map((k) => k.trim())
          .filter(Boolean);
      }
    }

    const material = await StudyMaterial.create(materialData);

    const populatedMaterial = await StudyMaterial.findById(material._id)
      .populate('uploadedBy', 'name avatar role')
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('chapter', 'name slug')
      .populate('topic', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Study material created successfully',
      data: populatedMaterial
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update study material details
 * @route   PUT /api/study-materials/:id or /api/materials/:id
 * @access  Private (Admin, Content Manager, Owner Instructor)
 */
const updateMaterial = async (req, res, next) => {
  try {
    let material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return next(new ErrorResponse('Study material not found', 404));
    }

    // Check ownership / admin permissions
    const isOwner = material.uploadedBy.toString() === req.user.id;
    const isStaff = [
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER
    ].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return next(
        new ErrorResponse('Not authorized to update this study material', 403)
      );
    }

    const updateData = { ...req.body };

    // Handle new file upload
    if (req.file) {
      updateData.fileUrl = `/uploads/${req.file.filename}`;
      updateData.fileName = req.file.originalname;
      updateData.fileSize = req.file.size;
    }

    // Parse tags if sent as string
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // Parse key points if sent as string
    if (typeof updateData.keyPoints === 'string') {
      try {
        updateData.keyPoints = JSON.parse(updateData.keyPoints);
      } catch (e) {
        updateData.keyPoints = updateData.keyPoints
          .split('\n')
          .map((k) => k.trim())
          .filter(Boolean);
      }
    }

    material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('uploadedBy', 'name avatar')
      .populate('course', 'title slug')
      .populate('subject', 'name slug')
      .populate('chapter', 'name slug')
      .populate('topic', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Study material updated successfully',
      data: material
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete study material
 * @route   DELETE /api/study-materials/:id or /api/materials/:id
 * @access  Private (Admin, Content Manager, Owner Instructor)
 */
const deleteMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return next(new ErrorResponse('Study material not found', 404));
    }

    const isOwner = material.uploadedBy.toString() === req.user.id;
    const isStaff = [
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER
    ].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return next(
        new ErrorResponse('Not authorized to delete this study material', 403)
      );
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);

    // Delete all bookmarks related to this material
    await Bookmark.deleteMany({
      contentType: BOOKMARK_TYPES.STUDY_MATERIAL,
      contentId: req.params.id
    });

    res.status(200).json({
      success: true,
      message: 'Study material deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle bookmark for a study material
 * @route   POST /api/study-materials/:id/bookmark or /api/materials/:id/bookmark
 * @access  Private (Authenticated User)
 */
const bookmarkMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return next(new ErrorResponse('Study material not found', 404));
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user.id,
      contentType: BOOKMARK_TYPES.STUDY_MATERIAL,
      contentId: material._id
    });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      return res.status(200).json({
        success: true,
        isBookmarked: false,
        message: 'Bookmark removed',
        data: null
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user.id,
      contentType: BOOKMARK_TYPES.STUDY_MATERIAL,
      contentId: material._id,
      contentModel: 'StudyMaterial',
      note: req.body.note || '',
      tags: req.body.tags || []
    });

    res.status(201).json({
      success: true,
      isBookmarked: true,
      message: 'Study material bookmarked successfully',
      data: bookmark
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add highlight annotation to study material bookmark
 * @route   POST /api/study-materials/:id/highlight or /api/materials/:id/highlight
 * @access  Private (Authenticated User)
 */
const addHighlight = async (req, res, next) => {
  try {
    const { highlightText, pageNumber, color, note } = req.body;

    if (!highlightText) {
      return next(new ErrorResponse('Highlight text is required', 400));
    }

    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return next(new ErrorResponse('Study material not found', 404));
    }

    let bookmark = await Bookmark.findOne({
      user: req.user.id,
      contentType: BOOKMARK_TYPES.STUDY_MATERIAL,
      contentId: material._id
    });

    const highlightEntry = `[Page ${pageNumber || 1}${color ? ` - ${color}` : ''}]: "${highlightText}"${
      note ? `\nNote: ${note}` : ''
    }`;

    if (!bookmark) {
      bookmark = await Bookmark.create({
        user: req.user.id,
        contentType: BOOKMARK_TYPES.STUDY_MATERIAL,
        contentId: material._id,
        contentModel: 'StudyMaterial',
        note: highlightEntry,
        tags: ['highlight']
      });
    } else {
      bookmark.note = bookmark.note
        ? `${bookmark.note}\n\n${highlightEntry}`
        : highlightEntry;
      if (!bookmark.tags.includes('highlight')) {
        bookmark.tags.push('highlight');
      }
      await bookmark.save();
    }

    res.status(200).json({
      success: true,
      message: 'Highlight saved successfully',
      data: bookmark
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add personal note to study material bookmark
 * @route   POST /api/study-materials/:id/note or /api/materials/:id/note
 * @access  Private (Authenticated User)
 */
const addNote = async (req, res, next) => {
  try {
    const { note, tags } = req.body;

    if (!note) {
      return next(new ErrorResponse('Note content cannot be empty', 400));
    }

    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return next(new ErrorResponse('Study material not found', 404));
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      {
        user: req.user.id,
        contentType: BOOKMARK_TYPES.STUDY_MATERIAL,
        contentId: material._id
      },
      {
        $set: {
          note,
          tags: tags || [],
          contentModel: 'StudyMaterial'
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Personal note saved successfully',
      data: bookmark
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  bookmarkMaterial,
  addHighlight,
  addNote
};
