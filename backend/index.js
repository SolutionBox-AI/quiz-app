const express = require('express');
const mongoose = require('mongoose');
const quizRoutes = require('./routes/quizRoutes');
require('dotenv').config();

const cors = require('cors');
app.use(cors());

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/quiz', quizRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection failed:', err));
