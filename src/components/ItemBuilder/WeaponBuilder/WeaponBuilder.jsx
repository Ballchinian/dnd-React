import {Button, Card , Dropdown, ButtonGroup} from 'react-bootstrap';
import { useState } from 'react';
import parseDmgDie from "../utill/parseDmgDie";


//How we are storing the weapons
class Weapon {
    constructor(weaponName, weaponHit, numRolled, diceRolled, modifier) {
        this.weaponName = weaponName;
        this.weaponHit = weaponHit;
        this.numRolled = numRolled;
        this.diceRolled = diceRolled;
        this.modifier = modifier;
    }
    getWeaponName() {
        return this.weaponName;
    }
    getWeaponHit() {
        return this.weaponHit;
    }
    getDmgDieNumbers() {
        return `${this.numRolled}d${this.diceRolled}+${this.modifier}`;
    }
}

function WeaponBuilder() {

    //UseStates both for adding and changing weapons
    const [weaponChoices, setWeaponChoices] = useState([]);
    const [weaponName, setWeaponName] = useState("");
    const [dmgDieNumbers, setDmgDieNumbers] = useState("");
    const [weaponHit, setWeaponHit] = useState(0);
    const [errors, setErrors] = useState("");

    //UseState for ChangeWeapon
    const [selectedWeaponName, setSelectedWeaponName] = useState("Select weapon to change");

    //UseState for swapping between AddWeapon and ChangeWeapon
    const [divVisibility, setDivVisibility] = useState(false);

    function resetValues() {
        setWeaponHit(0);
        setDmgDieNumbers("");
        setErrors({});
        setWeaponName("");
        setSelectedWeaponName("Select weapon to change");
    }

    //Handles input changes for both adding and changing weapons
    function handleWeaponInputChange(e) {
        const { name, value } = e.target;
            if (name === "weaponName") setWeaponName(value);
            if (name === "weaponHit") setWeaponHit(value);
            if (name === "dmgDieNumbers") setDmgDieNumbers(value);
    }

    //Swaps between AddWeapon and ChangeWeapon
    function handleSwapWeaponUI() {
        setDivVisibility(!divVisibility);
        resetValues();
    }

    function handleSaveWeapon() {
        const newErrors={}
        //Validate & parse damage dice
        const result = parseDmgDie(weaponName, dmgDieNumbers);

        //Check for errors (made it so multiple errors can show up at once using object newErrors)
        if (weaponChoices.some(
            w => w.getWeaponName().toLowerCase() === weaponName.trim().toLowerCase() &&
                w.getWeaponName() !== selectedWeaponName
        )) {
            newErrors.duplicate = "A weapon with this name already exists.";
        }
        if (weaponHit === "" || isNaN(weaponHit)) {
            newErrors.weaponHit = "Hit value must be a number.";
        }
        if (result.errors) {
            Object.assign(newErrors, result.errors);
        }

        // If any errors, set them and stop
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        //No errors, extract values
        const { numRolled, diceRolled, modifier } = result;

        //Create a new weapon object
        const newWeapon = new Weapon(
            weaponName,
            weaponHit,
            numRolled,
            diceRolled,
            modifier
        );


        setWeaponChoices((prev) => {
            
            
            //Find existing weapon index (if any) by its original name
            const index = prev.findIndex(weapon => weapon.getWeaponName() === selectedWeaponName);

            if (index !== -1 && selectedWeaponName !== "Select weapon to change") {
                //UPDATE MODE
                const updated = [...prev];
                updated[index] = newWeapon;
                return updated;
            }

            //ADD MODE
            return [...prev, newWeapon];
        });

        //Reset form
        resetValues();
    }

   
    return <div>
            {/* Add Weapon Section */}
            {/* className is flex column and display is flex to place buttons at end */}
            <Card className="flex-column" id="addWeaponSection" style={{ display: divVisibility ? 'none' : 'flex' }}>
                <h2 className="text-center">Add Weapon</h2>    
                <ol>

                    {/* Input fields for adding a weapon with error validation*/}
                    <li>Name<input type="text" value={weaponName} name="weaponName" onChange={handleWeaponInputChange} ></input></li>
                    {errors.name && (
                        <div className="text-danger">{errors.name}</div>
                    )}
                    {errors.duplicate && (
                        <div className="text-danger">{errors.duplicate}</div>
                    )}

                    <li>Hit Die<input type="number" value={weaponHit}  name="weaponHit" onChange={handleWeaponInputChange}></input></li>
                    {errors.weaponHit && (
                        <div className="text-danger">{errors.weaponHit}</div>
                    )}

                    <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleWeaponInputChange}></input></li>
                    {errors.dmgDieNumbers && (
                        <div className="text-danger">{errors.dmgDieNumbers}</div>
                    )}
                </ol>

                <Button onClick={ handleSaveWeapon }>Add Weapon</Button>
                <Button className="mt-5" onClick={ handleSwapWeaponUI }>Edit previous Weapons</Button>
            </Card>

            {/* Change Weapon Section */}
            {/* className is flex column and display is flex to place buttons at end */}
            <Card className="flex-column" id="changeWeaponSection" style={{ display: divVisibility ? 'flex' : 'none' }}>
                <h2 className="text-center">Change Weapon</h2>

                {/* Dropdown for selecting weapon to change, align items is to lower it in line for dropbox*/}
                <ButtonGroup className="d-flex align-items-end">
                    {/* Left side: input for renaming weapon */}
                    <input
                        placeholder={selectedWeaponName} 
                        name="weaponName"
                        type="text"
                        className="form-control"
                        value={weaponName}
                        onChange={handleWeaponInputChange}
                        disabled={selectedWeaponName === "Select weapon to change"}
                    />

                    {/* Right side: dropdown toggle */}
                    <Dropdown
                        as={ButtonGroup}
                        onSelect={(selectedIndex) => {
                            const weapon = weaponChoices[selectedIndex];
                            setSelectedWeaponName(weapon.getWeaponName());
                            setWeaponName(weapon.getWeaponName());
                            setDmgDieNumbers(weapon.getDmgDieNumbers());
                            setWeaponHit(weapon.getWeaponHit());              
                        }}
                    >
                        <Dropdown.Toggle split id="dropdown-split-basic" />

                        <Dropdown.Menu>
                            {weaponChoices.map((weapon, index) => (
                                <Dropdown.Item key={index} eventKey={index}>
                                    {weapon.getWeaponName()}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </ButtonGroup>

                <ol>
                    <li>Hit Die<input type="text" value={weaponHit}  name="weaponHit" onChange={handleWeaponInputChange}></input></li>
                    {errors.weaponHit && (
                        <div className="text-danger">{errors.weaponHit}</div>
                    )}

                    <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleWeaponInputChange}></input></li>
                    {errors.dmgDieNumbers && (
                        <div className="text-danger">{errors.dmgDieNumbers}</div>
                    )}
                </ol>
                    
                <Button onClick={ handleSaveWeapon }>Change Weapon</Button>
                <Button className="mt-5" onClick={ handleSwapWeaponUI }>Add new Weapons</Button>
            </Card>


    </div>
}


export default WeaponBuilder;

