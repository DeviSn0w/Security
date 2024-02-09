const express = require('express');
const cors = require('cors');
const userController = require('./Controllers/userController');
const complaintController = require('./Controllers/complaintsController');
const verifyToken = require('./middlewares/verifyToken ');
const privateKeyMiddleware = require('./middlewares/privateKeyMiddleware');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(privateKeyMiddleware);
app.use(cors({
    origin: 'http://localhost:4200'
  }));
// Register endpoint
app.post('/register', userController.createUser);

// Apply verifyToken middleware to routes that require authentication
app.use('/protectedRoute', verifyToken);

// Protected route where token is required
app.get('/protectedRoute', (req, res) => {
    // Access user information from req.user if token is verified
    res.send({ message: "Protected route accessed successfully", user: req.user });
});

app.post('/login', userController.login);

app.get('/users', userController.listAllUsers);

app.get('/users/:email', userController.getUserByEmail);

app.post('/complaints', complaintController.addComplaint);

app.get('/complaints/getComplaints', complaintController.getComplaints);

app.get('/complaints/by-email/:userEmail', complaintController.getComplaintsByEmail);

app.get('/complaints/:complaintId', complaintController.decryptComplaintById);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
