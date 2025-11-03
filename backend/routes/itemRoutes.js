import express from "express";
import {
  getItems,
  getItem,
  addWeapon,
  updateWeapon,
  addSpell,
  updateSpell,
  deleteItem
} from "../controllers/itemController.js";

const router = express.Router();

// Get all items
router.get("/", getItems);
router.get("/:name", getItem);
// Weapon routes
router.post("/weapon", addWeapon);          
router.put("/weapon", updateWeapon);       
// Spell routes
router.post("/spell", addSpell);         
router.put("/spell", updateSpell);         

// Delete route (works for both weapons and spells)
router.delete("/", deleteItem);

export default router;
