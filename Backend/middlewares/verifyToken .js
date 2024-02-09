const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Check if token exists
    if (!req.token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    jwt.verify(req.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        // If token is valid, attach the decoded payload to the request object
        req.user = decoded;
        next(); // Pass control to the next middleware
    });
};


module.exports = verifyToken;
