const express = require('express');
const cors = require('cors');
const path = require('path');
const quizRoutes = require('./routes/quizRoutes'); // Routes file
const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');


const router = express.Router();
const uploadsPath = path.join(__dirname, '../uploads');




// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static route to serve uploaded test JSONs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/quiz', quizRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('<h2>🎉 Quiz App Backend is Running</h2>');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
