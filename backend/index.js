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

// Define Schema and Model
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
    console.error('❌ Error fetching tests:', err.message);
    res.status(500).json({ error: 'Failed to load tests', details: err.message });
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
    console.error('❌ Error seeding data:', err.message);
    res.status(500).send('Failed to seed sample test');
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Example insertion code using MongoDB native driver
db.tests.insertMany([
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "London"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  }
]);

