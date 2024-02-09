// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('safework', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Disable logging of all queries

});

module.exports = sequelize;
