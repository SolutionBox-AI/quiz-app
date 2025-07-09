const express = require('express');
const cors = require('cors');
const path = require('path');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

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
