const express = require('express');
const router = express.Router();
const { getEmissionsSummary, getEmissionsLogs, addEmissionsLog, deleteEmissionsLog, addLogSchema } = require('../controllers/emissionsController');
const { authMiddleware, validateBody } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/summary', getEmissionsSummary);
router.get('/logs', getEmissionsLogs);
router.post('/logs', validateBody(addLogSchema), addEmissionsLog);
router.delete('/logs/:id', deleteEmissionsLog);

module.exports = router;
