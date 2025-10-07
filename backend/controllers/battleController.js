import Battle from "../models/battleModel.js";

// Get all battles
export const getBattles = async (req, res) => {
  try {
    const battles = await Battle.find();
    res.json(battles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new battle session
export const createBattle = async (req, res) => {
  try {
    const newBattle = new Battle(req.body);
    const saved = await newBattle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a battle turn
export const updateBattleTurn = async (req, res) => {
  try {
    const { battleId, turnAction } = req.body;
    const battle = await Battle.findById(battleId);
    if (!battle) return res.status(404).json({ message: "Battle not found" });

    battle.turnLog.push(turnAction);

    // Update current turn and actionsRemaining for the actor
    const actor = battle.players.find(p => p.name === turnAction.actor);
    if (actor && turnAction.actionCost) {
      for (let i = 0; i < turnAction.actionCost; i++) {
        const lastTrueIndex = actor.actionsRemaining.lastIndexOf(true);
        if (lastTrueIndex !== -1) actor.actionsRemaining[lastTrueIndex] = false;
      }
    }

    battle.currentTurn += 1;

    const updated = await battle.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
