const express = require('express');
const fs = require('fs');
const path = require('path');
// uuid
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// route to return the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// TODO API Routes

// GET /api/notes 
app.get('/api/notes', (req, res) => {
  res.send('GET /api/notes route');
});