const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ecometrics_super_secret_jwt_key_2026_sustainability');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
};

const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({ message: `Validation error: ${formattedErrors}` });
    }
    return res.status(400).json({ message: 'Invalid payload schema.' });
  }
};

module.exports = { authMiddleware, validateBody };
