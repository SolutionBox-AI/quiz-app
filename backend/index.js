require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Schema & Model
const TestSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    }
  ]
});

const Test = mongoose.model('Test', TestSchema);

// Routes

// Health Check
app.get('/', (req, res) => {
  res.send('🎯 Quiz API is running!');
});

// Get all tests
app.get('/api/tests', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load tests', details: err.message });
  }
});

// Add new test
app.post('/api/tests', async (req, res) => {
  try {
    const newTest = new Test(req.body);
    await newTest.save();
    res.status(201).json({ message: '✅ Test saved successfully', test: newTest });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save test', details: err.message });
  }
});

// Seed sample test
app.get('/api/seed', async (req, res) => {
  try {
    const sampleTest = new Test({
      title: 'Sample Quiz',
      questions: [
        {
          question: 'What is 2 + 2?',
          options: ['3', '4', '5'],
          answer: '4',
        },
        {
          question: 'Capital of India?',
          options: ['Delhi', 'Mumbai'],
          answer: 'Delhi',
        },
      ],
    });

    await sampleTest.save();
    res.send('✅ Sample quiz added');
  } catch (err) {
    res.status(500).send('Failed to seed sample test');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
