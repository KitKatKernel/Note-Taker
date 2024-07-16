const express = require('express'); // Express framework
const fs = require('fs'); // module to read and write files
const path = require('path'); // paths module
const { v4: uuidv4 } = require('uuid'); // UUID to create unique IDs

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // parse incoming requests
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); // files from public directory

// Defines route to index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Defines route to notes page (notes.html)
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// Error handling and details
const handleError = (err, res) => res.status(500).json({ error: 'An error occurred', details: err });

// API route to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', (err, data) => {
    if (err) return handleError(err, res); 
    res.json(JSON.parse(data)); 
  });
});

// API route to create a new note
app.post('/api/notes', (req, res) => {
  fs.readFile('db/db.json', (err, data) => {
    if (err) return handleError(err, res); 
    const notes = JSON.parse(data); 
    const newNote = {
      id: uuidv4(), // Generate unique ID for new note
      title: req.body.title, // Get note title from request
      text: req.body.text // Get text from the request
    };
    notes.push(newNote); 
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) return handleError(err, res);
      res.json(newNote); 
    });
  });
});

// Bonus API route to delete a note by its unique ID
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('db/db.json', (err, data) => {
    if (err) return handleError(err, res); 
    const notes = JSON.parse(data); 
    // Create a new array excluding the note with the specified ID
    // Filter the notes array to remove the note matching req.params.id
    const newNotes = notes.filter(note => note.id !== req.params.id); 
    fs.writeFile('db/db.json', JSON.stringify(newNotes), (err) => {
      if (err) return handleError(err, res); 
      res.json({ success: true }); // Send success message as response
    });
  });
});

// Fallback route for any undefined routes
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`App started on http://localhost:${PORT}`));