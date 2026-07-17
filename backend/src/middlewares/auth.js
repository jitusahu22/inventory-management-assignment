/**
 * Middleware: Protects routes by checking for an active session.
 * If the user is not logged in, returns 401.
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized. Please login first." });
};

module.exports = { isAuthenticated };
