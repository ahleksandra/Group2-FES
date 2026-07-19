require('dotenv').config({ path: './.env' });
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// ── Database config ──────────────────────────────────────────────────────────
const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// ── Admin account details ────────────────────────────────────────────────────
const admin = {
  username: 'admin@bc.com',
  email: 'admin@example.com',
  password: 'Admin123',
};

async function seedAdmin() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL.');

    // Create admins table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        username     VARCHAR(100)  NOT NULL UNIQUE,
        email        VARCHAR(255)  NOT NULL UNIQUE,
        password     VARCHAR(255)  NOT NULL,
        full_name    VARCHAR(150)  DEFAULT NULL,
        phone        VARCHAR(20)   DEFAULT NULL,
        is_active    TINYINT(1)    NOT NULL DEFAULT 1,
        last_login   DATETIME      DEFAULT NULL,
        created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Admins table ready.');

    // Check if admin already exists
    const [rows] = await connection.execute(
      'SELECT id FROM admins WHERE email = ? OR username = ?',
      [admin.email, admin.username]
    );

    if (rows.length > 0) {
      // Admin exists — update the password to match
      const hashedPassword = bcrypt.hashSync(admin.password, 12);
      await connection.execute(
        'UPDATE admins SET password = ? WHERE username = ?',
        [hashedPassword, admin.username]
      );
      console.log('Admin password updated successfully.');
      return;
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(admin.password, 12);

    // Insert admin
    await connection.execute(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      [admin.username, admin.email, hashedPassword]
    );

    console.log('Admin account created successfully.');
    console.log(`  Username : ${admin.username}`);
    console.log(`  Email    : ${admin.email}`);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seedAdmin();
