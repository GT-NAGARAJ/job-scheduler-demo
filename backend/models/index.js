const { Sequelize } = require('sequelize');
const JobModel = require('./job');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'example';
const DB_NAME = process.env.DB_NAME || 'jobsdb';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});

const Job = JobModel(sequelize);

module.exports = { sequelize, Job };
