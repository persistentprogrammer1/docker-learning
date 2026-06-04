const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Headers', 'Content-Type');
	  res.header('Access-Control-Allow-Methods', 'GET, POST');
	  next();
});

const db = new Pool({
	  host: 'database',
	  user: 'root',
	  password: 'mypassword',
	  database: 'tododb',
	  port: 5432
});

async function initDB() {
	  try {
		      await db.query(`CREATE TABLE IF NOT EXISTS todos (
		            id SERIAL PRIMARY KEY,
			          text VARCHAR(255) NOT NULL
				      )`);
		      console.log('Database initialized!');
		    } catch (err) {
			        console.error('DB init failed, retrying...', err.code);
			        setTimeout(initDB, 3000);
			      }
}

initDB();

app.get('/todos', async (req, res) => {
	  try {
		      const result = await db.query('SELECT * FROM todos');
		      res.json(result.rows);
		    } catch (err) {
			        res.status(500).json({ error: err.message });
			      }
});

app.post('/todos', async (req, res) => {
	  try {
		      const result = await db.query(
			            'INSERT INTO todos (text) VALUES ($1) RETURNING *',
			            [req.body.text]
			          );
		      res.json(result.rows[0]);
		    } catch (err) {
			        res.status(500).json({ error: err.message });
			      }
});

app.listen(3000, () => {
	  console.log('Todo app running on port 3000 - v2');
});
