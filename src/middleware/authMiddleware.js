import jwt from 'jsonwebtoken';
import Token from '../model/Token.js';
import { successResponse, errorResponse, errorResponse401, errorResponse403 } from '../util/responseUtil.js';

// const secretKey = process.env.JWT_SECRET;
const secretKey = 'cenzios';
const TOKEN_RENEWAL_THRESHOLD = 5 * 60; // 5 minutes

// Utility function to check JWT format
const isJWT = (token) => {
  const parts = token.split('.');
  return parts.length === 3;
};

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return errorResponse401(res, 'Authorization header is missing.', 401);
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return errorResponse(res, 'Token is missing.', 401);
    }

    if (!isJWT(token)) {
      return errorResponse403(res, 'Invalid token format.', 403);
    }

    let verified;
    try {
      verified = jwt.verify(token, secretKey);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse401(res, 'Token has expired.', 401);
      }
      return errorResponse403(res, 'Invalid token.', 403);
    }

    const storedToken = await Token.findOne({ userId: verified.userId, token });
    if (!storedToken) {
      return errorResponse401(res, 'Invalid session. Token has been invalidated.', 401);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (verified.exp < currentTime) {
      await Token.deleteOne({ userId: verified.userId, token });
      return errorResponse401(res, 'Token has expired.', 401);
    }

    const timeRemaining = verified.exp - currentTime;
    if (timeRemaining < TOKEN_RENEWAL_THRESHOLD) {
      const newToken = jwt.sign({ userId: verified.userId, role: verified.role }, secretKey, { expiresIn: '45m' });
      await Token.updateOne({ userId: verified.userId }, { token: newToken });
      res.setHeader('Authorization', `Bearer ${newToken}`);
    }

    req.user = verified;
    next();
  } catch (err) {
    return errorResponse403(res, 'Invalid token.', 403);
  }
};

export default authMiddleware;
