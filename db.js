const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:9746@localhost:5432/workout-log');

module.exports = sequelize;