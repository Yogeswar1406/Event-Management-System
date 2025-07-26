const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "event_db"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// Serve static HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});


app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, "admin_events.html"));
});


// ✅ Register User
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const checkQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(checkQuery, [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            console.log("User already exists");
            return res.status(409).send("User already exists");
        }

        const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        connection.query(insertQuery, [name, email, password], (err) => {
            if (err) throw err;
            console.log("User registered successfully");
            res.redirect("/login");
        });
    });
});

// ✅ Login User
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const loginQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
    connection.query(loginQuery, [email, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            console.log("Login successful");
            res.redirect("/dashboard"); 
        } else {
            console.log("Invalid credentials");
            res.status(401).send("Invalid credentials");
        }
    });
});

app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
