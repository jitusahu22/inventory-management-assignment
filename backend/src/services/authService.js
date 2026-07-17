// Default credentials for the assignment
const DEFAULT_USER = {
  username: "admin",
  password: "admin123",
};

/**
 * Validates login credentials against the default user.
 * Returns the username on success, or null on failure.
 */
const validateCredentials = (username, password) => {
  if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
    return { username: DEFAULT_USER.username };
  }
  return null;
};

module.exports = { validateCredentials };
