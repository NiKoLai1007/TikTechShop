const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const {getCategory, newCategory} = require('../controllers/categoryController')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

router.get('/admin/category', isAuthenticatedUser, authorizeRoles("admin"), getCategory)
router.post('/admin/category/new',isAuthenticatedUser, authorizeRoles("admin"),upload.array('images', 10), newCategory)

module.exports = router;