import Character from "../models/character.js";

// Get all characters
export const getCharacters = async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a character
export const createCharacter = async (req, res) => {
  try {
    const newCharacter = new Character(req.body);
    const saved = await newCharacter.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};