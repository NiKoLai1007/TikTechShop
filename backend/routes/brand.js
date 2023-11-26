const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const brandController = require('../controllers/brandController');

const {getBrand, newBrand, updateBrand, deleteBrand} = require('../controllers/brandController')
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth');

router.get('/admin/brand', isAuthenticatedUser, authorizeRoles("admin"), getBrand);
router.post('/admin/brand/new',isAuthenticatedUser, authorizeRoles("admin"),upload.array('images', 10), newBrand);
router.put('/admin/brand/:id', isAuthenticatedUser, authorizeRoles("admin",)).put(upload.array('images', 10), updateBrand);
router.put('/admin/brand/:id', updateBrand);
// router.route('/admin/brand/:id', isAuthenticatedUser, authorizeRoles("admin",)).put(upload.array('images', 10), updateBrand).delete(deleteBrand);
router.delete('/admin/brand/:id', deleteBrand);

module.exports = router;