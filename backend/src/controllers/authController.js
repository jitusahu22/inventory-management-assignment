const { validateCredentials } = require("../services/authService");

/**
 * POST /api/auth/login
 * Authenticates the user and creates a session.
 */
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  const user = validateCredentials(username, password);

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  // Store user in session
  req.session.user = user;

  // Explicitly save session before sending response
  req.session.save((err) => {
    if (err) {
      console.error("Session Save Error:", err);
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  });
};

/**
 * POST /api/auth/logout
 * Destroys the current session.
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Logout failed",
      });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      message: "Logout successful",
    });
  });
};

/**
 * GET /api/auth/me
 * Returns the currently logged-in user.
 */
const me = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }

  return res.status(200).json({
    user: req.session.user,
  });
};

module.exports = {
  login,
  logout,
  me,
};