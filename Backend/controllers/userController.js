const bcrypt = require('bcrypt');
const { generateKeyPair } = require('crypto');
const User = require('../models/userModel');
const { encrypt,decrypt } = require('../middlewares/symmetric');

const jwt = require('jsonwebtoken');

const saltRounds = 10;
const createUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, first_name, last_name, role = 'Employee', department, phone_number, address } = req.body;

         // Check if password and confirm password match
         if (password !== confirmPassword) {
            return res.status(400).send({ message: "Password and confirm password do not match" });
        }

        
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate Key Pair for User Data
        const { publicKey: userPublicKey, privateKey: userPrivateKey } = await new Promise((resolve, reject) => {
            generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
            }, (err, publicKey, privateKey) => {
                if (err) reject(err);
                else resolve({ publicKey, privateKey });
            });
        });

        // Generate Key Pair for Complaints
        const { publicKey: complaintsPublicKey, privateKey: complaintsPrivateKey } = await new Promise((resolve, reject) => {
            generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
            }, (err, publicKey, privateKey) => {
                if (err) reject(err);
                else resolve({ publicKey, privateKey });
            });
        });

        // Encrypt the private keys
        const encryptedUserPrivateKey = encrypt(userPrivateKey);

        // Create new user with both sets of keys
        const user = await User.create({
            username,
            password_hash: hashedPassword,
            email,
            first_name,
            last_name,
            role: role ? encrypt(role) : null,
            department: department ? encrypt(department) : null,
            phone_number: phone_number ? encrypt(phone_number) : null,
            address: address ? encrypt(address) : null,
            public_key: userPublicKey,
            encrypted_private_key: encryptedUserPrivateKey,
            complaints_public_key: complaintsPublicKey,
            complaints_private_key: complaintsPrivateKey
        });

        res.status(201).send({ message: "User created successfully", userId: user.user_id });
    } catch (error) {
        res.status(500).send({ message: "Error creating user", error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).send({ message: "Invalid username or password" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid username or password" });
        }

        // Prepare user data for response, excluding sensitive information
        const userData = {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role ? decrypt(user.role) : null,
            department: user.department ? decrypt(user.department) : null,
            status: user.status,
            dateCreated: user.date_created,
            phoneNumber: user.phone_number ? decrypt(user.phone_number) : null,
            address: user.address ? decrypt(user.address) : null,
            public_key: user.userPublicKey,
            encrypted_private_key: user.encryptedUserPrivateKey,
            complaints_public_key: user.complaintsPublicKey,
            complaints_private_key: user.complaintsPrivateKey
        };

        // Generate a JWT token
        const userForToken = {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role ? decrypt(user.role) : null,
        };

        const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
            expiresIn: '1h' // Set the token to expire in 1 hour
        });

        res.send({ message: "Login successful", user: userData, token });

    } catch (error) {
        console.error("Error during login:", error); // Error logging for debugging
        res.status(500).send({ message: "Error logging in", error: error.message });
    }
};


const listAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.findAll();

        // Prepare the response data
        const usersData = users.map(user => ({
            userId: user.user_id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role ? decrypt(user.role) : null,
            department: user.department ? decrypt(user.department) : null,
            status: user.status,
            dateCreated: user.date_created,
            phoneNumber: user.phone_number ? decrypt(user.phone_number) : null,
            address: user.address ? decrypt(user.address) : null
        }));

        // Send the list of users as a response
        res.send({ users: usersData });
    } catch (error) {
        res.status(500).send({ message: "Error listing users", error: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Prepare user data for response, excluding sensitive information
        const userData = {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role ? decrypt(user.role) : null,
            department: user.department ? decrypt(user.department) : null,
            status: user.status,
            dateCreated: user.date_created,
            phoneNumber: user.phone_number ? decrypt(user.phone_number) : null,
            address: user.address ? decrypt(user.address) : null
        };

        res.send({ message: "User found", user: userData });

    } catch (error) {
        res.status(500).send({ message: "Error retrieving user", error: error.message });
    }
};


module.exports = {
    createUser,
    login,
    listAllUsers,
    getUserByEmail
};
