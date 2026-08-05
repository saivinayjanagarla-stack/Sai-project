const express = require('express');
const router = express.Router();
const { getReports, createReport, reportSchema } = require('../controllers/reportsController');
const { authMiddleware, validateBody } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', getReports);
router.post('/', validateBody(reportSchema), createReport);

module.exports = router;
