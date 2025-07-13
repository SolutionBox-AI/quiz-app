const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env (locally)

const app = express();
const PORT = process.env.PORT || 5000;

const mappingRoutes = require("./routes/mappingRoutes");
app.use("/api/mapping", mappingRoutes);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quiz", quizRoutes);

const mappingRoutes = require("./routes/mappingRoutes");
app.use("/api/mapping", mappingRoutes);


// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizdb";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
