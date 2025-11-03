export default function successTable(playerSkill, foeDefense) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + playerSkill;
    //Pathfinder thinks crits are lame, so I have to code this true to the spirit of the game. 20 doesnt always crit :( )
    let outcomeIndex, degreeOfSuccess=0;
    let outcomeKeys = ["criticalFailure", "failure", "success", "criticalSuccess"];
    let outcomeTexts = ["critical failure", "failure", "success", "critical success"]

    //Need a nat 1 or nat 20 to go up or down a degree of success
    if (roll === 20) degreeOfSuccess++;
    if (roll === 1) degreeOfSuccess--;

    //Crit Failure
    if (total <= foeDefense - 10) {
        //Cant have a value worse than crit failure
        if (degreeOfSuccess === -1) {
            degreeOfSuccess = 0
        }
        outcomeIndex = 0
    }
    //Failure
    else if (total <= foeDefense) {
        outcomeIndex = 1

    }
    //Crit Success
    else if (total >= foeDefense + 10) {
        //Cant have a value better than crit success
        if (degreeOfSuccess === 1) {
            degreeOfSuccess = 0
        }
        outcomeIndex = 3
    }
    //Success
    else {
        outcomeIndex = 2
    };

    outcomeIndex +=degreeOfSuccess

     return {
        roll,
        total,
        outcomeKey: outcomeKeys[outcomeIndex],
        outcomeText: outcomeTexts[outcomeIndex]
    };

}