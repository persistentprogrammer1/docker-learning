const express = require('express');
const app = express();
app.use(express.json());

let todos = [];

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const todo = { id: Date.now(), text: req.body.text };
  todos.push(todo);
  res.json(todo);
});

app.listen(3000, () => {
  console.log('Todo app running on port 3000');
});
