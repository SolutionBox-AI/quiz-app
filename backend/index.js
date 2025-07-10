const express = require('express');
const cors = require('cors');
const path = require('path');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/create-test-folder/:testId', (req, res) => {
  const testId = req.params.testId;
  const fs = require('fs');
  const path = require('path');

  const folderPath = path.join(__dirname, 'uploads', testId);

  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating folder:", err);
      return res.status(500).send('❌ Failed to create folder');
    }
    res.send(`✅ Folder created: ${testId}`);
  });
});



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount quiz routes
app.use('/api/quiz', quizRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('<h2>🎉 Quiz App Backend is Running</h2>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
