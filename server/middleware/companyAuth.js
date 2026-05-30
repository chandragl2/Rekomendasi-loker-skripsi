const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const getJwtSecret = () => process.env.JWT_SECRET || process.env.COMPANY_JWT_SECRET || 'jobmatch-company-dev-secret';

const companyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, company token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, getJwtSecret());
    const company = await Company.findById(decoded.id).select('-password');

    if (!company) {
      return res.status(401).json({ message: 'Not authorized, company not found' });
    }

    req.company = company;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid company token' });
  }
};

module.exports = companyAuth;
