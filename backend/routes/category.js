const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const {getCategory, newCategory, updateCategory} = require('../controllers/categoryController')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

router.get('/admin/category', isAuthenticatedUser, authorizeRoles("admin"), getCategory)
router.post('/admin/category/new',isAuthenticatedUser, authorizeRoles("admin"),upload.array('images', 10), newCategory)
router.route('/admin/category/:id', isAuthenticatedUser, authorizeRoles("admin",)).put(upload.array('images', 10), updateCategory)

module.exports = router;