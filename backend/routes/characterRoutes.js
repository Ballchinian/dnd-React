import express from "express";
import { getCharacters, createCharacter, updateCharacter, deleteCharacter } from "../controllers/characterController.js";
import { parser } from '../config/cloudinary.js';

const router = express.Router();

// Upload a character with an image
router.post('/upload', parser.single('image'), createCharacter);

//Get all characters
router.get("/", getCharacters);

//Add character
router.post("/", createCharacter);

//Update Character
router.put("/:name", updateCharacter);

// Delete a character
router.delete("/:name", deleteCharacter);

export default router;