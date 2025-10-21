const {verifyToken} = require('../auth');
const jwt = require('jsonwebtoken'); // Add this import
/**
 * Middleware para verificar y validar un token JWT.
 * @param {string} userType - El tipo de usuario requerido ('admin' o 'user').
 * @returns {Function} Middleware de Express.
 */
function checkAuth(userType) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
      }
      // Expected format: "Bearer <token>"
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token, userType);
      req.user = decoded;
      // Check if the token's userType matches the required type
      if (req.user.userType !== userType) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };
}

/**
 * Middleware para verificar y validar un token JWT para un tipo de usuario específico (admin O user).
 * Acepta cualquier token válido y no impone un tipo de usuario específico.
 * @returns {Function} Middleware de Express.
 */
function checkAuthAny() {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
      }
      const token = authHeader.split(' ')[1];

      // Decode the token without verifying to extract the userType from the payload
      const payload = jwt.decode(token);
      if (!payload || !payload.userType) {
        return res.status(401).json({ error: 'Invalid token payload' });
      }

      // Now verify the token with the userType from the payload using Auth.verifyToken
      const decoded = verifyToken(token, payload.userType);
      req.user = decoded;
      // No specific role check, we accept any valid token
      next();
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };
}
module.exports = {checkAuthAny, checkAuth};