import Weapon from "../models/weaponModel.js";
import Spell from "../models/spellModel.js";


export const getItems = async (req, res) => {
    try {
        const weapons = await Weapon.find();
        const spells = await Spell.find();
        res.json({ weapons, spells });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch items" });
    }
};

export const getItem = async (req, res) => {
    try {
        //Find the weapon that matches the name
        const { name } = req.params;
        const weapon = await Weapon.findOne({ weaponName: name });
        if (weapon) return res.json({ type: "weapon", info: weapon });
        //If not found try spell
        const spell = await Spell.findOne({ spellName: name });
        if (spell) return res.json({ type: "spell", info: spell });
        res.status(404).json({ error: "Item not found" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch item" });
    }
};

export const addWeapon = async (req, res) => {
    try {
        const { weaponName, weaponHit, numRolled, diceRolled, modifier } = req.body;

        const existing = await Weapon.findOne({ weaponName });
        if (existing) return res.status(400).json({ error: "Weapon already exists" });

        const weapon = new Weapon({ weaponName, weaponHit, numRolled, diceRolled, modifier });
        await weapon.save();

        res.json({ success: true, weapon });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add weapon" });
    }
};

export const updateWeapon = async (req, res) => {
    try {
        const { originalName, weaponName, weaponHit, numRolled, diceRolled, modifier } = req.body;
        const weapon = await Weapon.findOne({ weaponName: originalName });
        if (!weapon) return res.status(404).json({ error: "Weapon not found" });

        weapon.weaponName = weaponName;
        weapon.weaponHit = weaponHit;
        weapon.numRolled = numRolled;
        weapon.diceRolled = diceRolled;
        weapon.modifier = modifier;

        await weapon.save();
        res.json({ success: true, weapon });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update weapon" });
    }
};

export const addSpell = async (req, res) => {
    try {
        const { spellName, DC, saveType, AoE, numRolled, diceRolled, modifier } = req.body;

        const existing = await Spell.findOne({ spellName });
        if (existing) return res.status(400).json({ error: "Spell already exists" });

        const spell = new Spell({ spellName, DC, saveType, AoE, numRolled, diceRolled, modifier });
        await spell.save();

        res.json({ success: true, spell });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add spell" });
    }
};

export const updateSpell = async (req, res) => {
    try {
        const { originalName, spellName, DC, saveType, AoE, numRolled, diceRolled, modifier } = req.body;

        const spell = await Spell.findOne({ spellName: originalName });
        if (!spell) return res.status(404).json({ error: "Spell not found" });

        spell.spellName = spellName;
        spell.DC = DC;
        spell.saveType = saveType;
        spell.AoE = AoE;
        spell.numRolled = numRolled;
        spell.diceRolled = diceRolled;
        spell.modifier = modifier;

        await spell.save();
        res.json({ success: true, spell });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update spell" });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { type, name } = req.body;

        if (type === "weapon") {
            await Weapon.deleteOne({ weaponName: name });
            return res.json({ success: true });
        }

        if (type === "spell") {
            await Spell.deleteOne({ spellName: name });
            return res.json({ success: true });
        }

        res.status(400).json({ error: "Invalid type" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete item" });
    }
};
