import express from "express";
import { actionNames } from "../modules/actionModules.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(actionNames);
});

export default router;
