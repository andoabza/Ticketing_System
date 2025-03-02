const role = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
  
  module.exports = role;