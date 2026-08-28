const express = require('express');
const router = express.Router();
const {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  bookmarkMaterial,
  addHighlight,
  addNote
} = require('../controllers/materialController');
const { protect, optionalAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { uploadFile } = require('../middleware/upload');
const { USER_ROLES } = require('../config/constants');

// Nested / special routes for bookmarks, highlights, notes
router.post('/:id/bookmark', protect, bookmarkMaterial);
router.post('/:id/highlight', protect, addHighlight);
router.post('/:id/note', protect, addNote);

// Root material routes
router
  .route('/')
  .get(getMaterials)
  .post(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    uploadFile('file'),
    createMaterial
  );

router
  .route('/:id')
  .get(optionalAuth, getMaterial)
  .put(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    uploadFile('file'),
    updateMaterial
  )
  .delete(
    protect,
    authorize(
      USER_ROLES.SUPERADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.CONTENT_MANAGER,
      USER_ROLES.INSTRUCTOR
    ),
    deleteMaterial
  );

module.exports = router;
