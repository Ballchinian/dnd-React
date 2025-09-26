import { Dropdown, ButtonGroup, Form, Button, Card } from "react-bootstrap";
import { useState } from 'react';
import parseDmgDie from "../utill/parseDmgDie";

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
    const [DC, setDC] = useState(0); 
    const [saveType, setSaveType] = useState("Mind"); //Default Mind
    const [AoE, setAoE] = useState(false); //Boolean toggle
    const [dmgDieNumbers, setDmgDieNumbers] = useState("");
    const [errors, setErrors] = useState({});

    //UseState for ChangeSpell
    const [selectedSpellName, setSelectedSpellName] = useState("Select spell to change");

    //UseState for swapping between AddSpell and ChangeSpell
    const [divVisibility, setDivVisibility] = useState(false);

    function resetValues() {
        setDC(0);
        setSaveType("Mind");
        setAoE(false);
        setDmgDieNumbers("");
        setErrors({});
        setSpellName("");
        setSelectedSpellName("Select spell to change");
    }

    //Handles input changes for both adding and changing spells
    function handleSpellInputChange(e) {
        const { name, value, checked } = e.target;
        if (name === "spellName") setSpellName(value);
        if (name === "DC") setDC(value);
        if ((name === "addSaveType" || (name === "changeSaveType"))) setSaveType(value);
        if (name === "AoE") setAoE(checked); //Toggle switch
        if (name === "dmgDieNumbers") setDmgDieNumbers(value);
    }

    //Swaps between AddSpell and ChangeSpell
    function handleSwapSpellUI() {
        setDivVisibility(!divVisibility);
        resetValues();
    }

    function handleSaveSpell() {
        const newErrors={}
        //Validate & parse damage dice
        const result = parseDmgDie(spellName, dmgDieNumbers);
        
       if (spellChoices.some(
            w => w.getSpellName().toLowerCase() === spellName.trim().toLowerCase() &&
                w.getSpellName() !== selectedSpellName
        )) {
            newErrors.duplicate = "A spell with this name already exists.";
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

        //Build the spell object
        const newSpell = new Spell(
            spellName,
            DC,
            saveType,
            AoE,
            numRolled,
            diceRolled,
            modifier
        );

        //Decide whether to ADD or UPDATE
        setSpellChoices((prev) => {
            //Find existing spell index (if any) by its original name
            const index = prev.findIndex(spell => spell.getSpellName() === selectedSpellName);

            if (index !== -1 && selectedSpellName !== "Select spell to change") {
                //UPDATE MODE
                const updated = [...prev];
                updated[index] = newSpell;
                return updated;
            }

            //ADD MODE
            return [...prev, newSpell];
        });

        //Reset form
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
                {errors.name && (
                    <div className="text-danger">{errors.name}</div>
                )}
                {errors.duplicate && (
                        <div className="text-danger">{errors.duplicate}</div>
                    )}

                <li>DC<input type="number" value={DC} name="DC" onChange={handleSpellInputChange} /></li>

                {/* Save Type Radio Buttons */}
                <li>
                    Save Type:
                    {["Mind","Reflex","Fort"].map((type) => (
                        <Form.Check 
                            key={type}
                            id={`addRadio${type}`}
                            type="radio"
                            label={type}
                            name="addSaveType"                
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
                        id="aoeAdd"
                        name="AoE"
                        checked={AoE}
                        onChange={handleSpellInputChange}
                    />
                </li>

                {/* Damage Die Input */}
                <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleSpellInputChange} /></li>
                {errors.dmgDieNumbers && <div className="text-danger">{errors.dmgDieNumbers}</div>}
            </ol>

            <Button className="mt-4" onClick={handleSaveSpell}>Add Spell</Button>
            <Button className="mt-5" onClick={handleSwapSpellUI}>Edit previous Spells</Button>
        </Card>

        {/* Change Spell Section */}
        <Card id="changeSpellSection" style={{ display: divVisibility ? 'flex' : 'none' }}>
            <h2 className="text-center">Change Spell</h2>

            {/* Dropdown for selecting spell to change */}
            <ButtonGroup className="d-flex align-items-end">
                <input
                    placeholder={selectedSpellName} 
                    name="spellName"
                    type="text"
                    className="form-control"
                    value={spellName}
                    onChange={handleSpellInputChange}
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
                <li>DC<input type="number" value={DC} name="DC" onChange={handleSpellInputChange} /></li>
                <li>
                    Save Type:
                    {["Mind","Reflex","Fort"].map((type) => (
                        <Form.Check 
                            key={type}
                            id={`changeRadio${type}`}
                            type="radio"
                            label={type}
                            name="changeSaveType"
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
                        id="aoeChange"
                        name="AoE"
                        checked={AoE}
                        onChange={handleSpellInputChange}

                    />
                </li>
                <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleSpellInputChange} /></li>
                {errors.dmgDieNumbers && <div className="text-danger">{errors.dmgDieNumbers}</div>}  
            </ol>

            <Button className="mt-4" onClick={handleSaveSpell}>Change Spell</Button>
            <Button className="mt-5" onClick={handleSwapSpellUI}>Add new Spells</Button>
        </Card>
    </div>
}

export default SpellBuilder;
