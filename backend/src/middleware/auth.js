import jwt from 'jsonwebtoken';

// Middleware to check for token and verify it
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  // console.log(token, 'header token');

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, 'Secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Export the middleware as the default export
export default auth;
