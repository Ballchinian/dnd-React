import dotenv from "dotenv";
dotenv.config();

//Framework for building web applications in Node.js
import express from "express";
//Middleware to enable CORS
import cors from "cors";
//MongoDB object modeling tool (to define schemas) 
import mongoose from "mongoose";

import characterRoutes from "./routes/characterRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";

//Starts server
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
//Parase JSON bodies
app.use(express.json());

//Routes
app.use("/api/actions", actionRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/battles", battleRoutes);
app.use("/api/items", itemRoutes);

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    //Modern connection options (im not sure what it means)
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error(err));