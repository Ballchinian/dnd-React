import express from "express";
import { getCharacters, createCharacter } from "../controllers/characterController.js";

const router = express.Router();

// Get all characters
router.get("/", getCharacters);

// Add a new character
router.post("/", createCharacter);

export default router;