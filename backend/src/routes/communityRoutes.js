const express = require('express');
const router = express.Router();
const { getCommunityFeed, logAction, actionSchema } = require('../controllers/communityController');
const { authMiddleware, validateBody } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/', getCommunityFeed);
router.post('/', validateBody(actionSchema), logAction);

module.exports = router;
