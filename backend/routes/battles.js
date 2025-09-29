import express from "express";
import { getBattles, createBattle, updateBattleTurn } from "../controllers/battleController.js";

const router = express.Router();

router.get("/", getBattles);
router.post("/", createBattle);             // Create new battle session
router.put("/turn", updateBattleTurn);     // Update a turn

export default router;
