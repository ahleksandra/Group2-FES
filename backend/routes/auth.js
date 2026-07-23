const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// ===========================
// REGISTER ADMIN
// ===========================
router.post("/register-admin", (req, res) => {
  const { username, email, password, fullname, phone } = req.body;

  if (!email || !password || (!username && !fullname)) {
    return res.status(400).json({
      success: false,
      message: "Fullname (or username), email, and password are required.",
    });
  }

  const adminUsername = username || fullname;
  const adminFullName = fullname || username;

  // Check if email or username already exists
  const checkSql =
    "SELECT id FROM admins WHERE email = ? OR username = ?";

  db.query(checkSql, [email, adminUsername], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error.",
        error: err.message,
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists.",
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 12);

    // Insert Admin
    const insertSql = `
      INSERT INTO admins
      (username,email,password,full_name,phone)
      VALUES (?,?,?,?,?)
    `;

    db.query(
      insertSql,
      [
        adminUsername,
        email,
        hashedPassword,
        adminFullName,
        phone || null,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Failed to create admin.",
            error: err.message,
          });
        }

        return res.status(201).json({
          success: true,
          message: "Admin registered successfully.",
          adminId: result.insertId,
        });
      }
    );
  });
});

// ===========================
// LOGIN ADMIN
// ===========================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admins WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error.",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const admin = results[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
      },
    });
  });
});

module.exports = router;