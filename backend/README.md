# Faculty Evaluation System — Backend

REST API backend for the Teacher/Faculty Evaluation Form built with **Node.js**, **Express**, and **MySQL**.

---

## Tech Stack

| Package | Purpose |
|---|---|
| Express | Web framework |
| mysql2 | MySQL database driver |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin resource sharing |
| nodemon | Auto-restart in development |

---

## Project Structure

```
backend/
├── config/
│   └── db.js              # MySQL connection
├── routes/
│   └── auth.js            # Auth routes (register, login)
├── seed/
│   └── adminSeed.js       # Creates admins table & seeds admin account
├── .env                   # Environment variables
├── server.js              # App entry point
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Edit `.env` in the `backend/` folder:

```env
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=faculty_evaluation
```

### 3. Seed the database

Creates the `admins` table and inserts the default admin account:

```bash
npm run seed
```

Default admin credentials:

| Field | Value |
|---|---|
| Username | `admin@bc.com` |
| Email | `admin@example.com` |
| Password | `Admin123` |

### 4. Start the server

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## API Endpoints

Base URL: `http://localhost:5000/api/auth`

---

### Register Admin

**POST** `/api/auth/register-admin`

Request body:
```json
{
  "username": "admin2",
  "email": "admin2@example.com",
  "password": "yourpassword",
  "phone": "09123456789"
}
```

| Status | Description |
|---|---|
| `201` | Admin registered successfully |
| `400` | Missing required fields |
| `409` | Username or email already exists |
| `500` | Database error |

---

### Login Admin

**POST** `/api/auth/login`

Request body:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

| Status | Description |
|---|---|
| `200` | Login successful |
| `401` | Invalid email or password |
| `500` | Database error |

Success response:
```json
{
  "success": true,
  "message": "Login successful.",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "full_name": "admin"
  }
}
```

---



