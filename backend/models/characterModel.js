import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
    characterName: { type: String, required: true, unique: true },
    stats: {
        ac: Number,
        dc: Number,
        health: Number,
        reflex: Number,
        fortitude: Number,
        will: Number,
        skills: {
            perception: Number,
            athletics: Number,
            acrobatics: Number,
            arcana: Number,
            crafting: Number,
            deception: Number,
            diplomacy: Number,
            intimidation: Number,
            medicine: Number,
            nature: Number,
            occultism: Number,
            performance: Number,
            religion: Number,
            society: Number,
            stealth: Number,
            survival: Number,
            thievery: Number
        }
    },
    image: String,
    effects: [String]
}, { timestamps: true });

export default mongoose.model("Character", characterSchema);
