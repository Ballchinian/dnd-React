export const resolveEffects = (creature) => {
  const updatedStats = { ...creature.stats };

  for (const effect of creature.effects) {
    const match = effect.match(/^([\w\s]+?)(?:\s(\d+))?$/);
    if (!match) continue;

    const [, name, numStr] = match;
    const num = numStr ? parseInt(numStr) : 0;

    switch (name.toLowerCase()) {
      case "frightened":
        updatedStats.attackBonus -= num;
        updatedStats.skillChecks -= num;
        break;
      case "grabbed":
        updatedStats.ac -= 2;
        break;
      case "prone":
        updatedStats.ac -= 2;
        updatedStats.attackBonus -= 2;
        break;
      default:
        break;
    }
  }

  return updatedStats;
};
