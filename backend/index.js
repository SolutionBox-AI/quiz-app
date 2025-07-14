// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // For .env config if used
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
const quizRoutes = require("./routes/quizRoutes");
const mappingRoutes = require("./routes/mappingRoutes");

app.use("/api/quiz", quizRoutes);
app.use("/api/mapping", mappingRoutes); // ✅ Add new mapping route

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
