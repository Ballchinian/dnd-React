import mongoose from "mongoose";

const battleSchema = new mongoose.Schema({
  players: [
    {
      name: String,
      hp: Number,
      actionsRemaining: [Boolean],
      effects: [String],
    }
  ],
  currentTurn: Number,
  turnLog: [
    {
      action: String,
      actor: String,
      target: String,
      result: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Battle", battleSchema);