// index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const quizRoutes = require("./routes/quizRoutes");
const mappingRoutes = require("./routes/mappingRoutes");

app.use("/api/quiz", quizRoutes);
app.use("/api/mapping", mappingRoutes);  // ✅ Important!

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/quizdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
