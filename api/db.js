'use strict';
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Thinh@123",
  database: process.env.DB_NAME || "ncnmedia"

  // host: process.env.DB_HOST || "localhost",
  // user: process.env.DB_USER || "root",
  // password: process.env.DB_PASS || "Thinh@123",
  // database: process.env.DB_NAME || "ncnmediacontent"
});

module.exports = db;