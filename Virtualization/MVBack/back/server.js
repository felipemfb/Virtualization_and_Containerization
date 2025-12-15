const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "192.168.56.30",                                     // localhost 192.168.56.30 ou backend
  database: "listdb",
  password: "front",
  port: 5432,
});

pool.query(`SELECT NOW()`, (err, res) => {
  if(err) console.error(`Connection error`, err);
  else console.log(`PostgreSQL connection OK`, res.rows);
});

app.get("/", (req, res) => {
  res.send("Backend working!");
});

app.post("/items", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query(
      "INSERT INTO items (text) VALUES ($1) RETURNING *",
      [text]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error while inserting:", err);
    res.status(500).json({ error: "Error while inserting an item" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Searching error:", err);
    res.status(500).json({ error: "Error while searching items" });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log("Backend at http://localhost:3000");
});