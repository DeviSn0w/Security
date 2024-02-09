const Complaint = require('../models/complaintModel');
const { encryptData, decryptData  } = require('../middlewares/asymmetric');
const User = require('../models/userModel'); // Adjust as per your user model
const userController = require('./userController');

// Controller to add a new complaint with asymmetrically encrypted data
const addComplaint = async (req, res) => {
    try {
        const { subject, description, category, priority_level, user_email } = req.body;

        // Retrieve the user's public key for complaints
        const user = await User.findOne({ where: { email: user_email } });
        if (!user || !user.complaints_public_key) {
            return res.status(400).send({ message: "User's public key for complaints not found" });
        }

        // Encrypt the complaint data
        const encryptedSubject = encryptData(subject, user.complaints_public_key);
        const encryptedDescription = encryptData(description, user.complaints_public_key);

        // Create and store the new complaint with encrypted data
        const newComplaint = await Complaint.create({
            subject: encryptedSubject,
            description: encryptedDescription,
            category,
            priority_level,
            user_email,
            complaint_date: new Date() // Or use Sequelize.NOW
        });

        res.status(201).send({ message: "Complaint added successfully", complaintId: newComplaint.complaint_id });
    } catch (error) {
        console.error("Error adding complaint:", error);
        res.status(500).send({ message: "Error adding complaint", error: error.message });
    }
};

// Controller function to get all complaints by email
const getComplaintsByEmail = async (req, res) => {
    try {
        const { userEmail } = req.params;

        // Retrieve all complaints associated with the specified email
        const complaints = await Complaint.findAll({ where: { user_email: userEmail } });

        // Retrieve the user's private key from the database
        const user = await User.findOne({ where: { email: userEmail } });

        if (!user || !user.complaints_private_key) {
            return res.status(400).send({ message: "User's private key not found" });
        }

        // Decrypt all complaints
        const decryptedComplaints = complaints.map(complaint => {
            const decryptedSubject = decryptData(complaint.subject, user.complaints_private_key);
            const decryptedDescription = decryptData(complaint.description, user.complaints_private_key);

            return {
                complaintId: complaint.complaint_id,
                subject: decryptedSubject,
                description: decryptedDescription,
                category: complaint.category,
                priority_level: complaint.priority_level,
                complaint_date: complaint.complaint_date,
                user_email: complaint.user_email
            };
        });

        // Send the decrypted complaints as a response
        res.send(decryptedComplaints);
    } catch (error) {
        console.error("Error retrieving complaints by email:", error);
        res.status(500).send({ message: "Error retrieving complaints by email", error: error.message });
    }
};


// Controller function to decrypt complaint by ID
const decryptComplaintById = async (req, res) => {
    try {
        const { complaintId } = req.params;

        // Retrieve the complaint from the database
        const complaint = await Complaint.findByPk(complaintId);
        if (!complaint) {
            return res.status(404).send({ message: "Complaint not found" });
        }

        // Retrieve the user's email associated with the complaint
        const userEmail = complaint.user_email;

        // Retrieve the user from the database using the email
        const user = await User.findOne({ where: { email: userEmail } });
        if (!user || !user.complaints_private_key) {
            return res.status(400).send({ message: "User's private key not found" });
        }

        // Decrypt the subject and description using the user's private key
        const decryptedSubject = decryptData(complaint.subject, user.complaints_private_key);
        const decryptedDescription = decryptData(complaint.description, user.complaints_private_key);

        // Send the decrypted complaint data as a response
        res.send({
            complaintId: complaint.complaint_id,
            subject: decryptedSubject,
            description: decryptedDescription,
            category: complaint.category,
            priority_level: complaint.priority_level,
            complaint_date: complaint.complaint_date,
            user_email: complaint.user_email
        });
    } catch (error) {
        console.error("Error decrypting complaint:", error);
        res.status(500).send({ message: "Error decrypting complaint", error: error.message });
    }
};


// Controller function to get all complaints
const getComplaints = async (req, res) => {
    try {
        // Retrieve all complaints from the database
        const complaints = await Complaint.findAll();

        // If no complaints found, return an empty array
        if (!complaints || complaints.length === 0) {
            return res.status(404).send({ message: "No complaints found" });
        }

        // Send the complaints as a response
        res.send(complaints);
    } catch (error) {
        console.error("Error retrieving complaints:", error);
        res.status(500).send({ message: "Error retrieving complaints", error: error.message });
    }
};



module.exports = {
    addComplaint,
    getComplaintsByEmail,
    getComplaints,
    decryptComplaintById
};

