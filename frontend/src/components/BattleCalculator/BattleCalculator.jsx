import { Card, Form, Dropdown, Button } from "react-bootstrap"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



function BattleCalculator() {
    const navigate = useNavigate();

    //Default values for all offensive bonuses
    const initialOffensiveBonusState = {
        Weapon:    { toHit: { circumstance: 0, item: 0, status: 0 }, damage: { circumstance: 0, item: 0, status: 0 } },
        Fortitude: { toHit: { circumstance: 0, item: 0, status: 0 }, damage: { circumstance: 0, item: 0, status: 0 } },
        Reflex:    { toHit: { circumstance: 0, item: 0, status: 0 }, damage: { circumstance: 0, item: 0, status: 0 } },
        Mind:      { toHit: { circumstance: 0, item: 0, status: 0 }, damage: { circumstance: 0, item: 0, status: 0 } },
    };

    //Default values for all defensive bonuses
    const initialDefensiveBonusState = {
        AC:        { circumstance: 0, item: 0, status: 0 },
        Fortitude: { circumstance: 0, item: 0, status: 0 },
        Reflex:    { circumstance: 0, item: 0, status: 0 },
        Mind:      { circumstance: 0, item: 0, status: 0 },
    };
    const defenceConditionTypes = ["AC", "Fortitude", "Reflex", "Mind"];
    const attackConditionTypes = ["Weapon", "Fortitude", "Reflex", "Mind"];

    const [selectedPlayer, setSelectedPlayer] = useState("Choose Player");
    //Weapon, spell (fort, reflex, mind)
    const [selectedConditionAttack, setSelectedConditionAttack] = useState("Select attack type");
    //AC, spell (fort, reflex, mind)
    const [selectedConditionDefence, setSelectedConditionDefence] = useState("Select defence type");
    //Local battleSession data (bonuses and selected weapons for each character)
    const [savedCharacters, setSavedCharacters] = useState({});
    const [selectedSpells, setSelectedSpells] = useState([]);
    const [selectedWeapons, setSelectedWeapons] = useState([]);
    const [offensiveBonuses, setOffensiveBonuses] = useState(initialOffensiveBonusState);
    const [defensiveBonuses, setDefensiveBonuses] = useState(initialDefensiveBonusState);
    //Temp storage for names of characters from backend
    const [databaseCharacters, setDatabaseCharacters] = useState([]);
    const [databaseWeapons, setDatabaseWeapons] = useState([]);
    const [databaseSpells, setDatabaseSpells] = useState([]);
  
    
    useEffect(() => {
        //Fetch all characters and items on first render
        async function fetchCharacters() {
            try {
                const res = await fetch("http://localhost:5000/api/characters");
                const data = await res.json();

                //Transform to just character names
                const charNames = data.map(char => char.characterName);
                setDatabaseCharacters(charNames);
            } catch (err) {
                console.error("Error fetching characters:", err);
            }
        }
        

        async function fetchItems() {
            try {
                const res = await fetch("http://localhost:5000/api/items");
                const data = await res.json();

                const weaponNames = data.weapons.map(weapon => weapon.weaponName);
                setDatabaseWeapons(weaponNames);

                const spellNames = data.spells.map(spell => spell.spellName);
                setDatabaseSpells(spellNames);
            } catch (err) {
                console.error("Error fetching items:", err);
            }
        }

        //Gets saved session if it exists to repopulate fields
        const saved = localStorage.getItem("battleSession");
        if (saved) {    
            const parsed = JSON.parse(saved);
            setSavedCharacters(parsed);
            
        }
            
       

        fetchCharacters();
        fetchItems();
    }, []);

    


    //Saves character when switching char or going to battleSimulator
    function handleSaveCharacter() {
        if (selectedPlayer === "Choose Player") return savedCharacters;

        const updatedState = {
            ...savedCharacters,
            [selectedPlayer]: {
                selectedWeapons,
                selectedSpells,
                offensiveBonuses,
                defensiveBonuses,
            }
        };

        setSavedCharacters(updatedState);
        return updatedState;
        }


    function handleGoToSimulator() {
        const updated = handleSaveCharacter(); //Get the updated state immediately
        localStorage.setItem("battleSession", JSON.stringify(updated));
        navigate("/battle-calculator/battle-simulator");
    }

    //Type: weapon, fortitude etc... 
    //Category: toHit/damage
    //BonusType: circumstance/item/status
    function handleOffensiveChange(type, category, bonusType, value) {
        setOffensiveBonuses(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [category]: {
                    ...prev[type][category],
                    [bonusType]: Number(value)
                }
            }
        }));
    }
    function handleDefensiveChange(type, bonusType, value) {
        setDefensiveBonuses(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [bonusType]: Number(value)
            }
        }));
    }

    //For repeated html on the Forms
    const renderBonusInput = (type, category, field, mode) => {
        //Circumstance -> circumstance for code
        const key = category.toLowerCase();
        return (
            <li>
                {`${category} Bonuses:`}
                <Form.Control
                    type="number"
                    value={
                        mode === "offensive"
                            ? offensiveBonuses[type][field][key]
                            : defensiveBonuses[type][key]
                    }
                    onChange={(e) =>
                        mode === "offensive"
                            ? handleOffensiveChange(type, field, key, e.target.value)
                            : handleDefensiveChange(type, key, e.target.value)
                    }
                />
            </li>
        );
    };

    //For more repeated html but focused on the spells and items
    const renderItemSelector = (
        title,
        selectedItems,
        setSelectedItems,
        databaseItems
    ) => (
        <div>
            {/*Choice of Items, with an onClick unselect option*/}
            {selectedItems.map((item) => (
                <li
                    key={item}
                    onClick={() =>
                        setSelectedItems((prev) => prev.filter((i) => i !== item))
                    }
                    style={{cursor: "pointer", marginBottom: "12px",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                    onMouseLeave={(e) => (e.target.style.color = "#a6c0b7")}
                >
                    {item}
                </li>
            ))}

            {/* Dropdown to select a new item */}
            <Dropdown
                className="mt-4"
                onSelect={(item) =>
                    setSelectedItems((prev) =>
                        prev.includes(item) ? prev : [...prev, item]
                    )
                }
            >
                <Dropdown.Toggle variant="success">
                    {title.charAt(0).toUpperCase() + title.slice(1)} List
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {/*Lists all the spells/weapons in the database*/}
                    {databaseItems.map((item) => (
                        <Dropdown.Item key={item} eventKey={item}>
                            {item}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );


    return (
        <div className="d-flex flex-column align-items-center">
            {/* Player Dropdown always visible */}
            <Dropdown
                onSelect={(nextPlayer) => {
                    //Save the currently selected player's state
                    const updated = handleSaveCharacter();

                    //Save updated state immediately to localStorage 
                    localStorage.setItem("battleSession", JSON.stringify(updated));

                    //Update the player selection
                    setSelectedPlayer(nextPlayer);

                    //Load that player’s saved data (if it exists)
                    if (updated[nextPlayer]) {
                        setSelectedWeapons(updated[nextPlayer].selectedWeapons);
                        setSelectedSpells(updated[nextPlayer].selectedSpells);
                        setOffensiveBonuses(updated[nextPlayer].offensiveBonuses);
                        setDefensiveBonuses(updated[nextPlayer].defensiveBonuses);
                    } else {
                        setSelectedWeapons([]);
                        setSelectedSpells([]);
                        setOffensiveBonuses(initialOffensiveBonusState);
                        setDefensiveBonuses(initialDefensiveBonusState);
                    }
                }}

                style={{ marginTop: "100px" }}
            >
                <Dropdown.Toggle variant="dark" style={{ fontSize: "40px" }}>
                    {selectedPlayer}
                </Dropdown.Toggle>
                {/*Lists all the characters to select from*/}
                <Dropdown.Menu>
                    {databaseCharacters.map((player) =>( 
                        <Dropdown.Item eventKey={player} key={player}>{player}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <Button
                variant="dark"
                className="m-4"
                onClick={() => handleGoToSimulator(selectedPlayer)}
            >
                Go to fight!
            </Button>
            {/* Only show rest once a player is chosen */}
            {selectedPlayer !== "Choose Player" && (
                <div className="d-flex flex-column align-items-center w-100">
                    <div className="d-flex justify-content-center w-100">
                        {/* Left Column: Attack */}
                        <Card style={{ margin: "20px" }}>
                            <h2>Offensive Stats</h2>
                            {/*Select the offensive stat that the player wishes to edit*/}
                            <Dropdown
                                style={{ marginBottom: "20px" }}
                                onSelect={(key) => setSelectedConditionAttack(key)}
                            >
                                <Dropdown.Toggle variant="success">
                                    {selectedConditionAttack}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Weapon" key="weapon">Weapon</Dropdown.Item>
                                    <Dropdown.Item eventKey="Fortitude" key="fortitude">Spell (Fortitude)</Dropdown.Item>
                                    <Dropdown.Item eventKey="Reflex" key="reflex">Spell (Reflex)</Dropdown.Item>
                                    <Dropdown.Item eventKey="Mind" key="mind">Spell (Mind)</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            {/*As long as Select attack type is selected, show to hit and damage sections*/}
                            <h3
                                style={{
                                    display: selectedConditionAttack !== "Select attack type" ? "block" : "none",
                                }}
                            >
                                To Hit
                            </h3>
                            {/*Block other attack conditions if not selected*/}
                            {attackConditionTypes.map((type) => (
                                <ol key={type} style={{ display: selectedConditionAttack === type ? "block" : "none" }}>
                                    {renderBonusInput(type, "Circumstance", "toHit", "offensive")}
                                    {renderBonusInput(type, "Item", "toHit", "offensive")}
                                    {renderBonusInput(type, "Status", "toHit", "offensive")}
                                </ol>
                            ))}
                            {/*Repeated for Damage section*/}
                            <h3
                                style={{
                                    display: selectedConditionAttack !== "Select attack type" ? "block" : "none",
                                }}
                            >
                                Damage
                            </h3>
                            {attackConditionTypes.map((type) => (
                                <ol key={type} style={{ display: selectedConditionAttack === type ? "block" : "none" }}>
                                    {renderBonusInput(type, "Circumstance", "damage", "offensive")}
                                    {renderBonusInput(type, "Item", "damage", "offensive")}
                                    {renderBonusInput(type, "Status", "damage", "offensive")}
                                </ol>
                            ))}
                        </Card>
                        
                        {/* Middle Column: Choice of Weapons */}
                        <Card style={{margin:"20px"}}>
                            <h2>Select Items</h2>
                            {renderItemSelector("weapon", selectedWeapons, setSelectedWeapons, databaseWeapons)}
                            {renderItemSelector("spell", selectedSpells, setSelectedSpells, databaseSpells)}
                        </Card>

                        {/* Right Column: Defence */}
                        <Card style={{ margin: "20px" }}>
                            <h2>Defensive Stats</h2>
                            <Dropdown
                                onSelect={(key) => setSelectedConditionDefence(key)}
                                style={{ marginBottom: "20px" }}
                            >
                                <Dropdown.Toggle variant="success">
                                    {selectedConditionDefence}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="AC" key="AC">AC</Dropdown.Item>
                                    <Dropdown.Item eventKey="Fortitude" key="fortitude">Spell (Fortitude)</Dropdown.Item>
                                    <Dropdown.Item eventKey="Reflex" key="reflex">Spell (Reflex)</Dropdown.Item>
                                    <Dropdown.Item eventKey="Mind" key="mind">Spell (Mind)</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <h3
                                style={{
                                    display: selectedConditionDefence !== "Select defence type" ? "block" : "none",
                                }}
                            >
                                To save
                            </h3>
                            {defenceConditionTypes.map((type) => (
                                <ol
                                    key={type}
                                    style={{ display: selectedConditionDefence === type ? "block" : "none" }}
                                    >
                                    {renderBonusInput(type, "Circumstance", "", "defensive")}
                                    {renderBonusInput(type, "Item", "", "defensive")}
                                    {renderBonusInput(type, "Status", "", "defensive")}
                                </ol>
                            ))}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BattleCalculator
