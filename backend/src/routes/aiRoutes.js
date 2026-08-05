const express = require('express');
const router = express.Router();
const { runAudit, handleChat, auditSchema, chatSchema } = require('../controllers/aiController');
const { authMiddleware, validateBody } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/audit', validateBody(auditSchema), runAudit);
router.post('/chat', validateBody(chatSchema), handleChat);

module.exports = router;
