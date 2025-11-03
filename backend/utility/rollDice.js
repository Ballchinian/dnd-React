export default function rollDice(formula) {
    //(/d+) matches one or more digits, then finds the letter d, then finds one or more digits again. 
    //Example 2d54 -> [2d54, 2, 54]
    const match = formula.match(/(\d+)d(\d+)/);
    if (!match) return 0;
    //(match[1], 10) -> the 10 sets it to decimal notation (base 10)
    const num = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    //dieTracker is purely for frontend UI, total is for calculations
    let total = 0;
    let dieTracker =[]
    let dieRolled;
    for (let i = 0; i < num; i++) {
        dieRolled = Math.floor(Math.random() * sides) + 1;
        total += dieRolled
        dieTracker.push(dieRolled)
    }
    return { rolledDamage: total, dieTracker };
}
