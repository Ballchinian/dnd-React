import {Button, Card, Dropdown, ButtonGroup, Form} from "react-bootstrap";
import {FaTrashAlt} from "react-icons/fa";
import {useState, useEffect} from "react";
import parseDmgDie from "../utill/parseDmgDie";

function SpellBuilder() {
    const [spellChoices, setSpellChoices] = useState([]);
    const [spellName, setSpellName] = useState("");
    const [DC, setDC] = useState(0);
    const [saveType, setSaveType] = useState("Mind");
    const [AoE, setAoE] = useState(false);
    const [dmgDieNumbers, setDmgDieNumbers] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedSpellName, setSelectedSpellName] = useState("Select spell to change");
    const [divVisibility, setDivVisibility] = useState(false);

    useEffect(() => {
        async function fetchSpells() {
            try {
                const res = await fetch("http://localhost:5000/api/items");
                const data = await res.json();
                setSpellChoices(data.spells || []);
            } catch (err) {
                console.error("FailedToFetchSpells:", err);
            }
        }
        fetchSpells();
    }, []);

    function resetValues() {
        setDC(0);
        setSaveType("Mind");
        setAoE(false);
        setDmgDieNumbers("");
        setErrors({});
        setSpellName("");
        setSelectedSpellName("Select spell to change");
    }

    function handleSpellInputChange(e) {
        const {name, value, checked} = e.target;
        if (name === "spellName") setSpellName(value);
        if (name === "DC") setDC(value);
        if (name === "addSaveType" || name === "changeSaveType") setSaveType(value);
        if (name === "AoE") setAoE(checked);
        if (name === "dmgDieNumbers") setDmgDieNumbers(value);
    }

    function handleSwapSpellUI() {
        setDivVisibility(!divVisibility);
        resetValues();
    }

    async function handleSaveSpell() {
        const newErrors = {};
        const result = parseDmgDie(spellName, dmgDieNumbers);

        if (spellChoices.some(s => 
            s.spellName.toLowerCase() === spellName.trim().toLowerCase() &&
            s.spellName !== selectedSpellName
        )) {
            newErrors.duplicate = "A Spell With This Name Already Exists.";
        }
        if (DC === "" || isNaN(DC)) {
            newErrors.DC = "DC Value Must Be A Number.";
        }
        if (result.errors) Object.assign(newErrors, result.errors);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        const {numRolled, diceRolled, modifier} = result;
        const payload = {spellName, DC, saveType, AoE, numRolled, diceRolled, modifier};

        try {
            //Edit a previous spell
            if (selectedSpellName !== "Select spell to change") {
                await fetch("http://localhost:5000/api/items/spell", {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({originalName: selectedSpellName, ...payload})
                });
            //Add a spell
            } else {
                await fetch("http://localhost:5000/api/items/spell", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payload)
                });
            }

            const refreshRes = await fetch("http://localhost:5000/api/items");
            const data = await refreshRes.json();
            setSpellChoices(data.spells);
            resetValues();
        } catch (err) {
            console.error(err);
            setErrors({api: err.message});
        }
    }

    async function handleDeleteSpell(name) {
        try {
            await fetch("http://localhost:5000/api/items", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({type: "spell", name})
            });
            const refreshRes = await fetch("http://localhost:5000/api/items");
            const data = await refreshRes.json();
            setSpellChoices(data.spells);
            resetValues();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            {/*AddSpell*/}
            <Card className="flex-column" style={{display: divVisibility ? 'none' : 'flex'}}>
                <h2 className="text-center">Add Spell</h2>
                <ol>
                    <li>Name<input type="text" value={spellName} name="spellName" onChange={handleSpellInputChange}/></li>
                    {errors.duplicate && <div className="text-danger">{errors.duplicate}</div>}
                    <li>DC<input type="number" value={DC} name="DC" onChange={handleSpellInputChange}/></li>
                    {errors.DC && <div className="text-danger">{errors.DC}</div>}
                    <li>
                        Save Type:
                        {["Mind","Reflex","Fort"].map(type => (
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
                    <li>
                        AoE:
                        <Form.Check
                            type="switch"
                            id="aoeAdd"
                            name="AoE"
                            checked={AoE}
                            onChange={handleSpellInputChange}
                        />
                    </li>
                    <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleSpellInputChange}/></li>
                    {errors.dmgDieNumbers && <div className="text-danger">{errors.dmgDieNumbers}</div>}
                    {errors.api && <div className="text-danger">{errors.api}</div>}
                </ol>
                <Button onClick={handleSaveSpell}>Add Spell</Button>
                <Button className="mt-3" onClick={handleSwapSpellUI}>Edit Previous Spells</Button>
            </Card>

            {/*ChangeSpell*/}
            <Card className="flex-column" style={{display: divVisibility ? 'flex' : 'none'}}>
                <h2 className="text-center">Change Spell</h2>
                <ButtonGroup className="d-flex align-items-end mb-3">
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
                            setSelectedSpellName(spell.spellName);
                            setSpellName(spell.spellName);
                            setDC(spell.DC);
                            setSaveType(spell.saveType);
                            setAoE(spell.AoE);
                            setDmgDieNumbers(`${spell.numRolled}d${spell.diceRolled}+${spell.modifier}`);
                        }}
                    >
                        <Dropdown.Toggle split id="dropdown-split-basic"/>
                        <Dropdown.Menu>
                            {spellChoices.map((spell, idx) => (
                                <Dropdown.Item key={idx} eventKey={idx}>{spell.spellName}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </ButtonGroup>

                <ol>
                    <li>DC<input type="number" value={DC} name="DC" onChange={handleSpellInputChange}/></li>
                    <li>
                        Save Type:
                        {["Mind","Reflex","Fort"].map(type => (
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
                        AoE:
                        <Form.Check
                            type="switch"
                            id="aoeChange"
                            name="AoE"
                            checked={AoE}
                            onChange={handleSpellInputChange}
                        />
                    </li>
                    <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleSpellInputChange}/></li>
                </ol>

                <div className="d-flex justify-content-between">
                    <Button className="p-2 w-100" onClick={handleSaveSpell}>Save Changes</Button>
                    {selectedSpellName !== "Select spell to change" && (
                        <Button
                            variant="danger"
                            onClick={() => handleDeleteSpell(selectedSpellName)}
                            style={{display: "flex", alignItems: "center", gap: "10px"}}
                        >
                            <FaTrashAlt/> Delete
                        </Button>
                    )}
                </div>

                <Button className="mt-3" onClick={handleSwapSpellUI}>Add New Spells</Button>

                
            </Card>
        </div>
    );
}

export default SpellBuilder;
