import rollDice from "../utility/rollDice.js";
import avgDice from "../utility/avgDie.js";
import successTable from "../utility/successTable.js";

export const resolveSkillAction = (actionModule, attacker, defender, avgOrLuck = false) => {
    const { check, outcomes } = actionModule;
    const playerSkill = attacker.stats[check.type];
    const foeDefense = defender.stats[check.vs];

    const { roll, outcomeKey, outcomeText } = successTable(playerSkill, foeDefense)

    //---Gathers text from actionModule and the respective action about how successful it was---
    const outcome = outcomes[outcomeKey];
    const effects = [];
    let updatedAttacker = { ...attacker, effects: [...(attacker.effects || [])] };
    let updatedDefender = { ...defender, effects: [...(defender.effects || [])] };

    //---Iterate through the different effects the action applies---
    for (const effect of outcome.effects) {
        switch (effect.type) {
        case "damage":
            //If average health damage, then we need the middle roll
            const result = avgOrLuck 
                ? { rolledDamage: avgDice(effect.roll), dieTracker: [] } 
                : rollDice(effect.roll);

            //dieTracker is there just to display what the user rolled in damage 
            //(pointless if just one die has been rolled) -> dieTracker.length > 1
            const { rolledDamage: damage, dieTracker } = result;
            const luckTextAddition = dieTracker && dieTracker.length > 1
                ? `[${dieTracker.join(", ")}] `
                : "";

            //Defender should be the default route, but can damage yourself
            if (effect.target === "defender" || !effect.target) {
                updatedDefender.stats.currentHealth = Math.max(0, updatedDefender.stats.currentHealth - damage)
            } else {
                updatedAttacker.stats.currentHealth = Math.max(0, updatedAttacker.stats.currentHealth - damage)
            };
            effects.push(`Dealt ${damage} ${luckTextAddition}${effect.damageType} damage to ${effect.target || "defender"}`);
            break;
        case "condition":
            //If the target is afflicted with a condition, apply it to the right one and log the effect in effects.
            let targetForCondition;
            if (effect.target === "attacker") {
                targetForCondition = attacker.name;
                updatedAttacker.effects.push(effect.value);
            } else {
                targetForCondition = defender.name;
                updatedDefender.effects.push(effect.value);
            }
            effects.push(`${targetForCondition} gains ${effect.value}`);
            break;
        case "removeCondition":
            //TODO
            effects.push(`Removed ${effect.values.join(", ")}`);
            break;
        default:
            break;
        }
    }

    const log = {
        mainLine: `${actionModule.name} is a ${outcomeText}! ${attacker.name} rolls a ${roll}`,
        secondLine: `${outcome.text} ${effects.join(", ")}`,
        attacker: `${attacker.name} -> ${check.type}: ${playerSkill}`,
        defender: `${defender.name} -> ${check.vs}: ${foeDefense}`,
        effects
    };

  return { updatedAttacker, updatedDefender, log };
};
