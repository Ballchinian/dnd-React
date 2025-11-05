import mongoose from "mongoose";

const spellSchema = new mongoose.Schema({
    spellName: { type: String, required: true, unique: true },
    DC: { type: Number, required: true },
    saveType: { type: String, enum: ["Will", "Reflex", "Fort"], required: true },
    AoE: { type: Boolean, default: false },
    numRolled: { type: Number, required: true },
    diceRolled: { type: Number, required: true },
    modifier: { type: Number, required: true }
}, { timestamps: true });

const Spell = mongoose.model("Spell", spellSchema);
export default Spell;
