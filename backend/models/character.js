import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  characterName: { type: String, required: true, unique: true },
  stats: {
    AC: Number,
    athletics: Number,
    health: Number,
    reflex: Number,
    fortitude: Number,
    mind: Number
  },
  imageUrl: String,
  effects: [String]
}, { timestamps: true });

export default mongoose.model("Character", characterSchema);