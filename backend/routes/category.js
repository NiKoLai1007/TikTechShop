const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const categoryController = require('../controllers/categoryController');

const {getCategory, newCategory, updateCategory, deleteCategory} = require('../controllers/categoryController');
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth');

router.get('/admin/category', isAuthenticatedUser, authorizeRoles("admin"), getCategory);
router.post('/admin/category/new',isAuthenticatedUser, authorizeRoles("admin"),upload.array('images', 10), newCategory);
// router.route('/admin/category/:id', isAuthenticatedUser, authorizeRoles("admin",)).put(upload.array('images', 10), updateCategory);
router.route('/admin/category/:id', isAuthenticatedUser, authorizeRoles("admin",)).put(upload.array('images', 10), updateCategory).delete(deleteCategory);
router.delete('/admin/category/:id', deleteCategory);

module.exports = router;