const { Router } = require('express');
const { createApplication, getApplications, editApplication, deleteApplication } = require("../controllers/applicationController");
const { protect } = require('../middleware/authMiddleware');
const router = Router();

router.post('/', protect, createApplication);
router.get('/', protect, getApplications);
router.put('/:id', protect, editApplication);
router.delete('/:id', protect, deleteApplication);

module.exports = router;