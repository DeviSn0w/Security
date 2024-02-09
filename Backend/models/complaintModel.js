const { Sequelize, DataTypes, Model } = require('sequelize');

// Assuming sequelize instance is already configured
const sequelize = require('../config/db');

const Complaint = sequelize.define('Complaint', {
    complaint_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    subject: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority_level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complaint_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Complaint',
    tableName: 'complaints',
    timestamps: false
});

module.exports = Complaint;
