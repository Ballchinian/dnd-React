import express from "express";
import { resolveAction} from "../controllers/battleController.js";

const router = express.Router();

router.post("/", resolveAction); //Resolve an action

export default router;
