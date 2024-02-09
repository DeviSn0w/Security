const { Sequelize, DataTypes, Model } = require('sequelize');

// Assuming sequelize instance is already configured
const sequelize = require('../config/db');

class User extends Model {}

User.init({
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    role: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    department: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active'
    },
    date_created: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    phone_number: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    public_key: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    encrypted_private_key: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    complaints_public_key: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    complaints_private_key: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
});

module.exports = User;
