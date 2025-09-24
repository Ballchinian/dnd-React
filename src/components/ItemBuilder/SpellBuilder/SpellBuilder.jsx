import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
//import './SpellBuilder.css';
import { useState } from 'react';
import parseDmgDie from "../utill/parseDmgDie";
import { Dropdown, ButtonGroup, Form } from "react-bootstrap";

//How we are storing the spells
class Spell {
    constructor(spellName, DC, saveType, AoE, numRolled, diceRolled, modifier) {
        this.spellName = spellName;
        this.DC = DC; //Replaces Hit Die
        this.saveType = saveType; //Mind/Reflex/Fort
        this.AoE = AoE; //Boolean Yes/No
        this.numRolled = numRolled;
        this.diceRolled = diceRolled;
        this.modifier = modifier;
    }

    getSpellName() {
        return this.spellName;
    }
    getDC() {
        return this.DC;
    }
    getSaveType() {
        return this.saveType;
    }
    getAoE() {
        return this.AoE;
    }
    getDmgDieNumbers() {
        return `${this.numRolled}d${this.diceRolled}+${this.modifier}`;
    }
}

function SpellBuilder() {

    //UseStates both for adding and changing spells
    const [spellChoices, setSpellChoices] = useState([]);
    const [spellName, setSpellName] = useState("");
    const [DC, setDC] = useState(""); //Replaces Hit Die
    const [saveType, setSaveType] = useState("Mind"); //Default Mind
    const [AoE, setAoE] = useState(false); //Boolean toggle
    const [dmgDieNumbers, setDmgDieNumbers] = useState("");
    const [errors, setErrors] = useState("");

    //UseState for ChangeSpell
    const [selectedSpellName, setSelectedSpellName] = useState("Select spell to change");

    //UseState for swapping between AddSpell and ChangeSpell
    const [divVisibility, setDivVisibility] = useState(false);

    function resetValues() {
        setDC("");
        setSaveType("Mind");
        setAoE(false);
        setDmgDieNumbers("");
        setErrors("");
        setSpellName("");
        setSelectedSpellName("Select spell to change");
    }

    //Handles input changes for both adding and changing spells
    function handleSpellInputChange(e) {
        const { name, value, type, checked } = e.target;
        console.log(e.target)
        if (name === "spellName") setSpellName(value);
        if (name === "DC") setDC(value);
        if (name === "saveType") setSaveType(value);
        if (name === "AoE") setAoE(checked); //Toggle switch
        if (name === "dmgDieNumbers") setDmgDieNumbers(value);
    }

    //Swaps between AddSpell and ChangeSpell
    function handleSwapSpellUI() {
        setDivVisibility(!divVisibility);
        resetValues();
    }

    function handleAddSpell() {
        //Refines the user input
        const result = parseDmgDie(spellName, dmgDieNumbers);

        //Check for errors
        if (result.errors) {
            setErrors(result.errors);
            return;
        }

        //No errors, extract values
        const { numRolled, diceRolled, modifier } = result;

        //Create a new spell object
        const spellChoice = new Spell(
            spellName,
            DC,        //DC replaces Hit Die
            saveType,  //Mind/Reflex/Fort
            AoE,        //Boolean
            numRolled,
            diceRolled,
            modifier
        );

        //Add the spell to state spellChoices
        setSpellChoices((prev) => ([ ...prev, spellChoice ]));

        //Clear the input fields after adding the spell
        resetValues();
    }

    function handleChangeSpell() {
        const result = parseDmgDie(spellName, dmgDieNumbers);

        if (result.errors) {
            setErrors(result.errors);
            return;
        }

        const { numRolled, diceRolled, modifier } = result;

        //Edit current spell object
        const updatedSpells = spellChoices.map((spell) => {
            if (spell.getSpellName() === spellName) {
                return new Spell(
                    selectedSpellName, 
                    DC,
                    saveType,
                    AoE,
                    numRolled,
                    diceRolled,
                    modifier
                );
            }
            return spell;
        });

        setSpellChoices(updatedSpells);
        resetValues();
    }

    return <div>
        {/* Add Spell Section */}
        {/* className is flex column and display is flex to place buttons at end */}
        <Card className="flex-column" id="addSpellSection" style={{ display: divVisibility ? 'none' : 'flex' }}>
            <h2 className="text-center">Add Spell</h2>    
            <ol>

                {/* Input fields for adding a spell with error validation*/}
                <li>Name<input type="text" value={spellName} name="spellName" onChange={handleSpellInputChange} /></li>
                {errors.spellName && (
                    <div className="text-danger">{errors.spellName}</div>
                )}

                <li>DC<input type="text" value={DC} name="DC" onChange={handleSpellInputChange} /></li>

                {/* Save Type Radio Buttons */}
                <li>
                    Save Type:
                    {["Mind","Reflex","Fort"].map((type) => (
                        <Form.Check 
                            key={type}
                            id={`radio-${type}`}
                            type="radio"
                            label={type}
                            name="saveType"                
                            value={type}                  
                            checked={saveType === type} 
                            onChange={handleSpellInputChange}
                        />
                    ))}
                </li>

                {/* AoE Toggle Switch */}
                <li>
                    AoE (Area Effect):
                    <Form.Check 
                        type="switch"
                        id="aoe-switch"
                        name="AoE"
                        checked={AoE}
                        onChange={handleSpellInputChange}
                    />
                </li>

                {/* Damage Die Input */}
                <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleSpellInputChange} /></li>
                {errors.dmgDieNumbers && <div className="text-danger">{errors.dmgDieNumbers}</div>}
            </ol>

            <Button className="mt-4" onClick={handleAddSpell}>Add Spell</Button>
            <Button className="mt-5" onClick={handleSwapSpellUI}>Edit previous Spells</Button>
        </Card>

        {/* Change Spell Section */}
        <Card id="changeSpellSection" style={{ display: divVisibility ? 'flex' : 'none' }}>
            <h2 className="text-center">Change Spell</h2>

            {/* Dropdown for selecting spell to change */}
            <ButtonGroup className="d-flex align-items-end">
                <input

                    type="text"
                    className="form-control"
                    value={selectedSpellName}
                    onChange={(e) => setSelectedSpellName(e.target.value)}
                    disabled={selectedSpellName === "Select spell to change"}
                />
                <Dropdown
                    as={ButtonGroup}
                    onSelect={(selectedIndex) => {
                        const spell = spellChoices[selectedIndex];
                        setSelectedSpellName(spell.getSpellName());
                        setSpellName(spell.getSpellName());
                        setDC(spell.getDC());
                        setSaveType(spell.getSaveType());
                        setAoE(spell.getAoE());
                        setDmgDieNumbers(spell.getDmgDieNumbers());
                    }}
                >
                    <Dropdown.Toggle split id="dropdown-split-basic" />
                    <Dropdown.Menu>
                        {spellChoices.map((spell, index) => (
                            <Dropdown.Item key={index} eventKey={index}>
                                {spell.getSpellName()}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </ButtonGroup>

            <ol>
                <li>DC<input type="text" value={DC} name="DC" onChange={handleSpellInputChange} /></li>
                <li>
                    Save Type:
                    {["Mind","Reflex","Fort"].map((type) => (
                        <Form.Check 
                            key={type}
                            id={`radio-${type}`} // unique
                            type="radio"
                            label={type}
                            name="saveType"
                            value={type}
                            checked={saveType === type}
                            onChange={handleSpellInputChange}
                        />
                    ))}
                </li>
                <li>
                    AoE (Area Effect):
                    <Form.Check
                        type="switch"
                        id="aoe-switch-change"
                        name="AoE"
                        checked={AoE}
                        onChange={handleSpellInputChange}

                    />
                </li>
                <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleSpellInputChange} /></li>
                {errors.dmgDieNumbers && <div className="text-danger">{errors.dmgDieNumbers}</div>}  
            </ol>

            <Button className="mt-4" onClick={handleChangeSpell}>Change Spell</Button>
            <Button className="mt-5" onClick={handleSwapSpellUI}>Add new Spells</Button>
        </Card>
    </div>
}

export default SpellBuilder;
