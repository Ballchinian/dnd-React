import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import characterRoutes from "./routes/characters.js";
import battleRoutes from "./routes/battle.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/characters", characterRoutes);
app.use("/api/battles", battleRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error(err));