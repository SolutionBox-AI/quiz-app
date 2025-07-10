require('dotenv').config(); // Load env variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Test Schema & Model
const TestSchema = new mongoose.Schema({
  title: String,
  questions: Array,
});
const Test = mongoose.model('Test', TestSchema);

// Sample Route

app.get('/', (req, res) => {
  res.send('Quiz API is running!');
});

app.get('/api/tests', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ error: 'Failed to load tests' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

