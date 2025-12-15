const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const app = express(); app.use(cors());
app.use(express.json()); 
const pool = new Pool({
    user: process.env.DB_USER || "postgres", host: process.env.DB_HOST || "database", database: process.env.DB_NAME || "listdb", password: process.env.DB_PASS || "front", port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});
const waitForDB = async () => {
    let connected = false;
    while (!connected) {
        try {
            await pool.query("SELECT 1");
            console.log("✅ PostgreSQL connected");
            connected = true;
        } catch (err) {
            console.log("⏳ Waiting for database...");
            await new Promise(r => setTimeout(r, 3000));
        }
    }
};
waitForDB();
app.get("/", (req, res) => { res.send("Backend working!"); });
app.post("/items", async (req, res) => { try {const { text } = req.body; 
const result = await pool.query( 
    "INSERT INTO items (text) VALUES ($1) RETURNING *", [text] );
    res.json(result.rows[0]);
} catch (err) {
    console.error("Error while inserting:", err);
    res.status(500).json({ error: "Error while inserting an item" });
}});

app.get("/items", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM items ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Searching error:", err);
        res.status(500).json({ error: "Error while searching items" });
    }
});
app.listen(3000, '0.0.0.0', () => { console.log("Backend at http://0.0.0.0:3000"); });
