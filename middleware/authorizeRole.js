// middleware/authorizeRole.js
const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.roles) {
      return res.status(401).json({ message: "User roles not found" });
    }

    // Check if the user has at least one allowed role
    const hasRole = req.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }

    next();
  };
};

module.exports = authorizeRole;
