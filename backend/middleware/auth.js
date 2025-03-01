const jwt = require('jsonwebtoken');

const auth = (roles = []) => (req, res, next) => {
	  const token = req.header('x-auth-token');
	  
	  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

	  try {
		      const decoded = jwt.verify(token, process.env.JWT_SECRET);
		      req.user = decoded.user;
		      
		      if (roles.length && !roles.includes(req.user.role)) {
			            return res.status(403).json({ message: 'Unauthorized role' });
			          }
		      
		      next();
		    } catch (err) {
			        res.status(401).json({ message: 'Token is not valid' });
			      }
};

module.exports = auth;
