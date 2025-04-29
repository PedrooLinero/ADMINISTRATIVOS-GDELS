require("dotenv").config();
const path = require("path");

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "test",
    name: process.env.DB_NAME || "ADMIN_GDELS",
    port: process.env.DB_PORT || 3306,
  },
  secretKey: process.env.SECRET_KEY || "default_secret",
  excelFilePath: path.join(__dirname, "../uploads/PartesTrabajo.xlsx"),
};