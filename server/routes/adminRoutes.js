const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roleAuth');
const { getDashboardStats, getAllUsers, updateUserRole, getAllOrders, confirmOrder } = require('../controllers/adminController');

// All routes here require valid JWT AND admin/super_admin role
router.use(auth);
router.use(requireRole(['admin', 'super_admin']));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/orders', getAllOrders);
router.put('/orders/:id/confirm', confirmOrder);

module.exports = router;
