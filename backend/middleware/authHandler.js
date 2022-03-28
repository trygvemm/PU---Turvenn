const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

/**
 * Checks if token is icluded in request header,
 * and that it is valid
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      // eslint-disable-next-line prefer-destructuring
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const jwtSecret = process.env.JWT_SECRET || 'abc123';
      const decoded = jwt.verify(token, jwtSecret);
      // Get user from token and put in request
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized'));
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized'));
  }
};

module.exports = { protect };
