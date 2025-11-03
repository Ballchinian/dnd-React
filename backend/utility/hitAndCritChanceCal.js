export default function hitAndCritChanceCal(greaterThanToHitTable) {
  let hitChance = 0, critChance = 0;

  //Good heavens, I coded this.
  //Its made from trial and error, im not even sure what it means
  if (greaterThanToHitTable >= 21) {
    critChance = 0.05;
  } else if (greaterThanToHitTable >= 2 && greaterThanToHitTable <= 20) {
    critChance = 1 - (greaterThanToHitTable - 1) / 20;
  }

  if (greaterThanToHitTable >= 31) {
    hitChance = 0;
  } else if (greaterThanToHitTable >= 20 && greaterThanToHitTable <= 30) {
    hitChance = 1 - (greaterThanToHitTable - 10) / 20;
  } else if (greaterThanToHitTable >= 13 && greaterThanToHitTable <= 19) {
    hitChance = 0.5;
  } else if (greaterThanToHitTable >= 2 && greaterThanToHitTable <= 12) {
    hitChance = (greaterThanToHitTable - 2) / 20;
  } else {
    critChance = 0.95;
    hitChance = 0;
  }

  return [hitChance, critChance];
}
