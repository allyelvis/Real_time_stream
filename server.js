// server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data (replace with a database in a real-world scenario)
const programmingLanguages = [
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Python' },
  { id: 3, name: 'Java' }
];

// Middleware to parse JSON requests
app.use(express.json());

// GET all programming languages
app.get('/languages', (req, res) => {
  res.json(programmingLanguages);
});

// POST a new programming language
app.post('/languages', (req, res) => {
  const newLanguage = req.body;
  programmingLanguages.push(newLanguage);
  res.status(201).json(newLanguage);
});

// PUT (update) an existing programming language
app.put('/languages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedLanguage = req.body;
  const index = programmingLanguages.findIndex(lang => lang.id === id);
  if (index !== -1) {
    programmingLanguages[index] = updatedLanguage;
    res.json(updatedLanguage);
  } else {
    res.status(404).json({ message: 'Language not found' });
  }
});

// DELETE a programming language
app.delete('/languages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = programmingLanguages.findIndex(lang => lang.id === id);
  if (index !== -1) {
    const deletedLanguage = programmingLanguages.splice(index, 1)[0];
    res.json(deletedLanguage);
  } else {
    res.status(404).json({ message: 'Language not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
