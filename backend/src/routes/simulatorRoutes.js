const express = require('express');
const router = express.Router();
const { runSimulation, simulationSchema } = require('../controllers/simulatorController');
const { authMiddleware, validateBody } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/run', validateBody(simulationSchema), runSimulation);

module.exports = router;
