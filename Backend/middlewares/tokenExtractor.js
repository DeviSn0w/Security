const jwt = require('jsonwebtoken');

const tokenExtractor = (req, res, next) => {
    // Extract token from the Authorization header
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        // Extract the token from the header
        req.token = authorizationHeader.substring(7); // Remove 'Bearer ' prefix
    }
    next(); // Pass control to the next middleware
};

module.exports = tokenExtractor;
