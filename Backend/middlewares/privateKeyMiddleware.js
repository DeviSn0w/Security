require('dotenv').config(); // Load environment variables from .env file

const privateKeyMiddleware = (req, res, next) => {
  const privateKey = process.env.PRIVATE_KEY;
  res.locals.privateKey = privateKey;
  next();
};

module.exports = privateKeyMiddleware;
