import hitAndCritChanceCal from "../utility/hitAndCritChanceCal.js";
import { actionModules } from "../modules/actionModules.js";
import { resolveSkillAction } from "../modules/resolveActionHelper.js";
import rollDice from "../utility/rollDice.js";
import successTable from "../utility/successTable.js";

export const resolveAction = async (req, res) => {
  try {
    const { attacker, defender, action, avgOrLuck, offensiveBonuses, defensiveBonuses } = req.body;
    //updatedDefender will be modified later for hp updates
    //log lists the text returned for frontend
    let log = {};
    let updatedAttacker = { ...attacker };
    let updatedDefender = { ...defender };

    //---Stats---
    //Need another varable to reflect values after adding bonuses for calculations
    const defenderTemp = {
      ...defender,
      stats: {...defender.stats}
    }
    if (!action) {
      return res.status(400).json({ error: "No action selected" });
    }
    //Performs one loop for each stat, and the second loop adds all the bonuses within that stat.
    Object.keys(defensiveBonuses).forEach(defensiveStat => {
      //To add circumstance, item and status together
      let totalBonus = 0;
      //ac, fortitude etc...
      const defensiveStatReadable = defensiveStat.toLowerCase();
      //circum/item/status
      Object.values(defensiveBonuses[defensiveStat]).forEach(bonus => {
        totalBonus += Number(bonus)
      }) 
      //Change defender object to have adjusted stats (not to save to database)
      defenderTemp.stats[defensiveStatReadable] += totalBonus; 
    })
  
    //---Check if the action is a non-weapon/spell and go to respective module---
    if (actionModules[action]) {
      const result = resolveSkillAction(actionModules[action], attacker, defender, avgOrLuck, offensiveBonuses, defensiveBonuses);
      return res.json(result);
    }

    //---If it isnt in actionModules, it must be a weapon or spell---
    //TODO -- INTEGRATE SPELL AND WEAPON INTO resolveActionHelper.js
    let item;
    try {
      //Attempts to fetch the item by name
      const response = await fetch(`http://localhost:5000/api/items/${action}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      //In a more acceptable format
      item = data;
      if (!item) throw new Error("Item not found in database");
    } catch (err) {
      console.error("Error fetching item:", err);
      return res.status(500).json({ error: "Failed to fetch item" });
    }

    //---Add Bonuses to data from localStorage--- TODO
    const weaponEdit = item.info;
    const spellEdit = item.info;

    //---Weapon logic---
    if (item.type === "weapon") {
      const weapon = item.info;
      const { name, weaponHit, numRolled, diceRolled, modifier } = weapon;
      const targetAC = defenderTemp.stats.ac;
      let hitChance, critChance, expectedDamage, roll, outcomeText, outcomeKey, dieTracker;
      //Average Mode
      if (avgOrLuck) {
        const greaterThanToHitTable = targetAC - weaponHit + 10;
        [hitChance, critChance] = hitAndCritChanceCal(greaterThanToHitTable);
        const rolledDamage = numRolled * ((diceRolled/2)+0.5) + (modifier??0);
        expectedDamage = hitChance * rolledDamage + critChance * rolledDamage * 2;
      //Luck Mode
      } else {
        ({ roll, outcomeKey, outcomeText } = successTable(weaponHit, targetAC));
        if (outcomeKey === "failure" || outcomeKey === "criticalFailure") {
          expectedDamage = 0
        } else  {
          //If we havent failed we can roll for damage
          const result = rollDice(`${numRolled}d${diceRolled}`);
          let rolledDamage = result.rolledDamage;
          dieTracker = result.dieTracker;
          rolledDamage += (modifier ?? 0);
          expectedDamage = outcomeKey === "criticalSuccess" ? rolledDamage * 2 : rolledDamage;
        }
      }

      //Update defender health (Math.max to ensure it cant be negative)
      expectedDamage = Math.round(expectedDamage * 10) / 10;
      updatedDefender.stats.currentHealth = Math.max( 0, defenderTemp.stats.currentHealth  - expectedDamage);

      //For logging on the frontend
      log.mainLine = avgOrLuck
        ? `${attacker.name} attacks dealing ${(expectedDamage).toFixed(1)} damage.`
        : `${action} attacks with a ${outcomeText}! ${attacker.name} rolls a ${roll}`;
      log.secondLine = avgOrLuck
        ? `Hit chance: [${Math.round(hitChance * 100)}% hit, ${Math.round(critChance * 100)}% crit]`
        : (expectedDamage > 0
            ? `${attacker.name} deals ${(expectedDamage).toFixed(1)} damage. ${avgOrLuck ? `` : `[${dieTracker.join(", ")}] + ${modifier}`}`
            : ``);
      log.defender = `${defenderTemp.name} (AC ${targetAC})`;
      log.attacker = `
        Hit -> ${weaponHit}
        Damage -> ${numRolled}d${diceRolled}+${modifier}
      `;
    }

    //---Spell logic---
    else if (item.type === "spell") {
      const spell = item.info;
      const { saveType, DC, numRolled, diceRolled, modifier } = spell;
      //Determine which defense stat to use
      const saveTarget =
        saveType === "fortitude" ? defenderTemp.stats.fortitude: 
        saveType === "reflex" ? defenderTemp.stats.reflex: 
        defenderTemp.stats.will; //Default to Will
      let hitChance, critChance, expectedDamage, roll, outcomeText, outcomeKey, dieTracker;

      //Average Mode
      if (avgOrLuck) {
        const greaterThanToHitTable = saveTarget - DC + 30;
        [hitChance, critChance] = hitAndCritChanceCal(greaterThanToHitTable);
        const rolledDamage = numRolled * ((diceRolled/2)+0.5) + (modifier ?? 0);
        expectedDamage = rolledDamage * hitChance + 2 * rolledDamage * critChance; 
      //Luck Mode
      } else {
        ({ roll, outcomeKey, outcomeText } = successTable(saveTarget, DC));
        if (outcomeKey === "failure" || outcomeKey === "criticalFailure") {
          expectedDamage = 0
        } else  {
          //If we havent failed we can roll for damage
          const result = rollDice(`${numRolled}d${diceRolled}`);
          let rolledDamage = result.rolledDamage;
          rolledDamage += (modifier??0)
          dieTracker = result.dieTracker;
          
          expectedDamage = outcomeKey === "criticalSuccess" ? rolledDamage * 2 : rolledDamage;
        }
      }
      
      //Update defender health (Math.max to ensure it cant be negative)
      expectedDamage = Math.round(expectedDamage * 10) / 10;
      updatedDefender.stats.currentHealth  = Math.max(0, defenderTemp.stats.currentHealth  - expectedDamage);

      //For logging on the frontend
      log.mainLine = avgOrLuck 
        ? `${attacker.name} attacks dealing ${(expectedDamage).toFixed(1)} damage.`
        : `${action} attacks with a ${outcomeText}! ${attacker.name} rolls a ${roll}`;
      log.secondLine = avgOrLuck 
        ? `Hit chance: [${Math.round(hitChance * 100)}% hit, ${Math.round(critChance * 100)}% crit]` 
        : (expectedDamage > 0
          ? `${attacker.name} deals ${(expectedDamage).toFixed(1)} damage. ${avgOrLuck ? `` : `[${dieTracker.join(", ")}] + ${modifier}`}`
          : ``);
      log.defender = `${defenderTemp.name} (${saveType} ${saveTarget})`;
      log.attacker = `DC -> ${spell.DC}
      Damage -> ${numRolled}d${diceRolled}+${modifier}`;
    }
    else {
      console.log("Unknown action type:", item.type);
    }
    //Return result  
    res.json({
      updatedAttacker,
      updatedDefender,
      log,
    });
  } catch (err) {
    console.error("Error in resolveAction:", err);
    res.status(500).json({ error: "Failed to resolve action" });
  }
};
