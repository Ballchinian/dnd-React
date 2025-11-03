import mongoose from "mongoose";

const weaponSchema = new mongoose.Schema({
    weaponName: { type: String, required: true, unique: true },
    weaponHit: { type: Number, required: true },
    numRolled: { type: Number, required: true },
    diceRolled: { type: Number, required: true },
    modifier: { type: Number, required: true }
}, { timestamps: true });

const Weapon = mongoose.model("Weapon", weaponSchema);
export default Weapon;
