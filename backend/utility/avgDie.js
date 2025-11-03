export default function avgDice(formula) {
  //(/d+) matches one or more digits, then finds the letter d, then finds one or more digits again. 
  //Example 2d54 -> [2d54, 2, 54]
  const match = formula.match(/(\d+)d(\d+)/);
  if (!match) return 0;
  //(match[1], 10) -> the 10 sets it to decimal notation (base 10)
  const num = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  return num * (sides / 2 + 0.5); 
}