const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

const db = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: 'mypassword',
  database: 'tododb'
});

function connectWithRetry() {
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed, retrying in 3 seconds...', err.code);
      setTimeout(connectWithRetry, 3000);
      return;
    }
    console.log('Connected to MySQL!');
    db.query(`CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(255) NOT NULL
    )`, (err) => {
      if (err) console.error('Table creation failed:', err);
    });
  });
}

connectWithRetry();

app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/todos', (req, res) => {
  db.query('INSERT INTO todos (text) VALUES (?)', 
    [req.body.text], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, text: req.body.text });
  });
});

app.listen(3000, () => {
  console.log('Todo app running on port 3000');
});
