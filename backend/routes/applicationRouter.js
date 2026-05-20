const { Router } = require('express');
const { createApplication, getApplications, editApplication, deleteApplication  = require("../controllers/applicationController")}
const router = Router();

router.post('/', createApplication);
router.get('/', getApplications);
router.put('/:id', editApplication);
router.delete('/:id', deleteApplication);

module.exports = router;