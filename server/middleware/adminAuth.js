const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const getAdminJwtSecret = () => (
  process.env.JWT_SECRET ||
  process.env.ADMIN_JWT_SECRET ||
  'jobmatch-admin-dev-secret'
);

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, admin token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getAdminJwtSecret());

    if (decoded.type !== 'admin') {
      return res.status(401).json({ message: 'Not authorized, admin token invalid' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid admin token' });
  }
};

module.exports = {
  adminAuth,
  getAdminJwtSecret,
};
