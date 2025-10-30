// import express from "express";
// import mysql from "mysql2";
// import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // DB Connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
// });

// db.connect((err) => {
//   if (err) {
//     console.log("❌ Database connection failed:", err.message);
//   } else {
//     console.log("✅ Connected to MySQL Database!");
//   }
// });

// // Routes
// app.get("/", (req, res) => res.send("API Running..."));

// // Get all users
// app.get("/api/users", (req, res) => {
//   db.query("SELECT * FROM users", (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(result);
//   });
// });

// // Add new user
// app.post("/api/users", (req, res) => {
//   const { name, email } = req.body;
//   db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "User added successfully!" });
//   });
// });

// // Delete user
// app.delete("/api/users/:id", (req, res) => {
//   const { id } = req.params;
//   db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "User deleted successfully!" });
//   });
// });

// // Start server
// app.listen(process.env.PORT, () => {
//   console.log(`🚀 Server running on port ${process.env.PORT}`);
// });




import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database!");
  }
});

// ✅ Root route
app.get("/", (req, res) => res.send("API Running... 🚀"));

// ✅ Create table route (run only once)
app.get("/create-users-table", (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users_details (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255)
    );
  `;
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("❌ Error creating table:", err);
      return res.status(500).send("❌ Failed to create table");
    }
    res.send("✅ users_details table created successfully (with AUTO_INCREMENT id)");
  });
});

// ✅ Get all users
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users_details", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ Add new user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "Name and email required" });

  db.query(
    "INSERT INTO users_details (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ User added successfully!" });
    }
  );
});

// ✅ Delete user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users_details WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ User deleted successfully!" });
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
