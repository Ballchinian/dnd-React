//Parsing through the damage die input to get the different values
function parseDmgDie(name, dmgDieNumbers) {

    //Making sure dmgDieNumbers is in the correct format
    const formatCheck = dmgDieNumbers.replace(/[^\d+d+\d]/g, '').split(/d|\+/);

    //Different varables contained within dmgDieNumbers (to be extracted)
    var dmgDieCheck = true;
    let numRolled = 0;
    let diceRolled = 0;
    let modifier = 0;
    console.log(`${numRolled} and ${diceRolled} and ${modifier}`);
    formatCheck.forEach((dmgDieSplit, index) => {
        console.log(`${dmgDieSplit} and the index ${index}`)
        if (dmgDieSplit === '0' || dmgDieSplit === '') {
            if (index === 2) {
                modifier=0;
                
            } else {
                dmgDieCheck = false;
            }
            
        } else {
            //Convert to a number
            const value = Number(dmgDieSplit);

            if (index === 0) {
                //First iteration: add to numRolled
                numRolled += value;
            } else if (index === 1) {
                //Second iteration: add to diceRolled
                diceRolled += value;
            } else if (index === 2) {
                //Third iteration: add to modifier
                modifier += value;
            }
        }
    });

    console.log(`${numRolled} and ${diceRolled} and ${modifier}`);
    let newErrors = {};

        if (name.trim() === "") {
            newErrors.name = "Weapon name is required";
        }


        if (!Number.isInteger(+diceRolled) || !dmgDieCheck) {
            newErrors.dmgDieNumbers = "Invalid damage die (e.g. 4d6+3)";
        }


        if (Object.keys(newErrors).length > 0) {
            return {errors: newErrors};
        }
    return { numRolled, diceRolled, modifier };
};

export default parseDmgDie;

