import rollDice from "../utility/rollDice.js";
import avgDice from "../utility/avgDie.js";
import successTable from "../utility/successTable.js";


export const resolveSkillAction = (actionModule, attacker, defender, avgOrLuck = false) => {
    const type = actionModule.type;
    let roll = "-", outcomeText = "", outcome, outcomes, outcomeKey;
    let check, playerSkill, foeDefense;
    let actionText
    //---Skill Check! Only if we have a vs do we need these values---
    if (type === "skill") {
        ({ check, outcomes } = actionModule)
        playerSkill = attacker.stats.skills[check.type];
        foeDefense = defender.stats[check.vs];

        //Gathers text from actionModule and the respective action about how successful it was
       ({ roll, outcomeKey, outcomeText } = successTable(playerSkill, foeDefense))
        outcome = outcomes[outcomeKey];
    } else if (type === "automatic") {
        outcome = actionModule
        outcomeText = outcome.outcomeText;
    }
    const effectsLog = [];
    let updatedAttacker = { ...attacker, effects: [...(attacker.effects || [])] };
    let updatedDefender = { ...defender, effects: [...(defender.effects || [])] };

    //---Iterate through the different effects the action applies---
    for (const effect of outcome.effects) {
        const isAttacker = effect.target === "attacker";
        const targetName = isAttacker ? attacker.name : defender.name;
        const targetStats = isAttacker ? updatedAttacker : updatedDefender;
        let targetEffects = targetStats.effects;

        switch (effect.type) {
        case "damage":
            //If average health damage, then we need the middle roll
            const result = avgOrLuck 
                ? { rolledDamage: avgDice(effect.roll), dieTracker: [] } 
                : rollDice(effect.roll);

            //dieTracker is there just to display what the user rolled in damage 
            //(pointless if just one die has been rolled) -> dieTracker.length > 1
            const { rolledDamage: damage, dieTracker } = result;
            const luckTextAddition = dieTracker.length > 1
                ? `[${dieTracker.join(", ")}] `
                : "";

            //Defender should be the default route, but can damage yourself
            targetStats.stats.currentHealth = Math.max(0, targetStats.stats.currentHealth - damage)

            effectsLog.push(`Dealt ${damage} ${luckTextAddition}${effect.damageType} damage to ${targetName}`);
            break;

        case "condition":
        case "removeCondition":
            const targetHasEffect = targetEffects.includes(effect.value);

            //Determine action text and update targetEffects
            actionText = effect.type === "condition"
                ? (targetHasEffect ? "already has" : "gains")
                : (targetHasEffect ? "removes" : "doesn't have");

            //Apply effect if needed
            if (effect.type === "condition" && !targetHasEffect) targetEffects.push(effect.value);
            if (effect.type === "removeCondition" && targetHasEffect) {
                targetEffects = targetEffects.filter(e => e !== effect.value)
                targetStats.effects = targetEffects;
            };

            //Push log
            effectsLog.push(`${targetName} ${actionText} ${effect.value}`);
            break
                
       
        default:
            console.log("No effect type to apply")
            break;
        }
    }

    const redundantEffect = actionText === "already has" || actionText === "doesn't have";

    const log = {
        mainLine: roll !== "-" ? `${actionModule.name} is a ${outcomeText}! ${attacker.name} rolls a ${roll}` : ``,
        secondLine: redundantEffect 
            ? `${effectsLog.join(", ")}`
            : `${outcome.text} ${effectsLog.join(", ")}`,
        attacker: playerSkill || playerSkill === 0 ? `${attacker.name} -> ${check.type}: ${playerSkill}` : undefined,
        defender: foeDefense || foeDefense === 0 ? `${defender.name} -> ${check.vs}: ${foeDefense}` : undefined,
        effectsLog
    };

  return { updatedAttacker, updatedDefender, log };
};
