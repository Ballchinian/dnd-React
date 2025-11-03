import Character from "../models/characterModel.js";

export const getCharacters = async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCharacter = async (req, res) => {
  try {
    const newCharacter = new Character(req.body);
    const saved = await newCharacter.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const updateCharacter = async (req, res) => {
  try {
    const updated = await Character.findOneAndUpdate(
      { characterName: req.params.name },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCharacter = async (req, res) => {
  try {
    await Character.findOneAndDelete({ characterName: req.params.name });
    res.json({ message: "Character deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};