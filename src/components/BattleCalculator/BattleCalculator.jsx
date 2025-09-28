import { Card, Form, Dropdown, Button } from "react-bootstrap"
import { useState } from "react";
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
    const [selectedConditionAttack, setSelectedConditionAttack] = useState("Select attack type");
    const [selectedConditionDefence, setSelectedConditionDefence] = useState("Select defence type");
    const [savedCharacters, setSavedCharacters] = useState({});

    const [selectedWeapons, setSelectedWeapons] = useState([]);
    const [offensiveBonuses, setOffensiveBonuses] = useState(initialOffensiveBonusState);

    const [defensiveBonuses, setDefensiveBonuses] = useState(initialDefensiveBonusState);
    const databaseWeapons = ["Sword","Mace","Firebook"]
    const players = ["Todd the brave", "Todd the cunning", "Todd the fearless"]

    //Saves character when switching char or going to fight
    function handleSaveCharacter(nextPlayer) {
        //So program doesnt save starting text
        if (selectedPlayer === "Choose Player") return {};

        //For async purposes, set up const for return later
        let updatedState = {
            ...savedCharacters,
            [selectedPlayer]: {
                selectedWeapons,
                offensiveBonuses,
                defensiveBonuses,
            },
        };

        //If go to fight is next, then add timestamp for storage
        if (!nextPlayer) {
            updatedState.timestamp = Date.now();
        //If the character already exists, else just reset the slate. 
        } else if (updatedState[nextPlayer]) {
            setSelectedWeapons(updatedState[nextPlayer].selectedWeapons);
            setOffensiveBonuses(updatedState[nextPlayer].offensiveBonuses);
            setDefensiveBonuses(updatedState[nextPlayer].defensiveBonuses);
        } else {
            setSelectedWeapons([]);
            setOffensiveBonuses(initialOffensiveBonusState);
            setDefensiveBonuses(initialDefensiveBonusState);
        }

        setSavedCharacters(updatedState);
        return updatedState; //Return the latest version
    }

    function handleGoToSimulator() {
        const updated = handleSaveCharacter(); // get the updated state immediately
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



    return (
        <div className="d-flex flex-column align-items-center">
            {/* Player Dropdown always visible */}
            <Dropdown
                onSelect={(key) => {
                    handleSaveCharacter(key); 
                    setSelectedPlayer(key);
                }}
                style={{ marginTop: "100px" }}
            >
                <Dropdown.Toggle variant="dark" style={{ fontSize: "40px" }}>
                    {selectedPlayer}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {players.map((player) =>( 
                        <Dropdown.Item eventKey={player} key={player}>{player}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            {/* Only show rest once a player is chosen */}
            {selectedPlayer !== "Choose Player" && (
                <div className="d-flex flex-column align-items-center w-100">
                    {/* Button above the two columns */}
                    <Button
                        variant="dark"
                        className="m-4"
                        onClick={() => handleGoToSimulator(selectedPlayer)}
                    >
                        Go to fight!
                    </Button>

                    <div className="d-flex justify-content-center w-100">
                        {/* Left Column: Attack */}
                        <Card style={{ margin: "20px" }}>
                            <h2>Offensive Stats</h2>
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

                            <h3
                                style={{
                                    display: selectedConditionAttack !== "Select attack type" ? "block" : "none",
                                }}
                            >
                                To Hit
                            </h3>
                            {attackConditionTypes.map((type) => (
                                <ol key={type} style={{ display: selectedConditionAttack === type ? "block" : "none" }}>
                                    <li>
                                        Circumstance Bonuses:
                                        <Form.Control
                                        type="number"
                                        value={offensiveBonuses[type].toHit.circumstance}
                                        onChange={(e) =>
                                            handleOffensiveChange(type, "toHit", "circumstance", e.target.value)
                                        }
                                        />
                                    </li>
                                    <li>
                                        Item Bonuses:
                                        <Form.Control
                                        type="number"
                                        value={offensiveBonuses[type].toHit.item}
                                        onChange={(e) =>
                                            handleOffensiveChange(type, "toHit", "item", e.target.value)
                                        }
                                        />
                                    </li>
                                    <li>
                                        Status Bonuses:
                                        <Form.Control
                                        type="number"
                                        value={offensiveBonuses[type].toHit.status}
                                        onChange={(e) =>
                                            handleOffensiveChange(type, "toHit", "status", e.target.value)
                                        }
                                        />
                                    </li>
                                </ol>
                            ))}

                            <h3
                                style={{
                                    display: selectedConditionAttack !== "Select attack type" ? "block" : "none",
                                }}
                            >
                                Damage
                            </h3>
                            {attackConditionTypes.map((type) => (
                                <ol key={type} style={{ display: selectedConditionAttack === type ? "block" : "none" }}>
                                    <li>
                                        Circumstance Bonuses:
                                        <Form.Control
                                        type="number"
                                        value={offensiveBonuses[type].damage.circumstance}
                                        onChange={(e) =>
                                            handleOffensiveChange(type, "damage", "circumstance", e.target.value)
                                        }
                                        />
                                    </li>
                                    <li>
                                        Item Bonuses:
                                        <Form.Control
                                        type="number"
                                        value={offensiveBonuses[type].damage.item}
                                        onChange={(e) =>
                                            handleOffensiveChange(type, "damage", "item", e.target.value)
                                        }
                                        />
                                    </li>
                                    <li>
                                        Status Bonuses:
                                        <Form.Control
                                        type="number"
                                        value={offensiveBonuses[type].damage.status}
                                        onChange={(e) =>
                                            handleOffensiveChange(type, "damage", "status", e.target.value)
                                        }
                                        />
                                    </li>
                                    </ol>
                            ))}
                        </Card>
                        
                        {/* Middle Column: Choice of Weapons */}
                        <Card style={{margin:"20px"}}>
                            <h2>Select Weapons</h2>
                            {selectedWeapons.map((weapon) => (
                                <li
                                    key={weapon}
                                    onClick={() =>
                                        setSelectedWeapons((prev) =>
                                            prev.filter((w) => w !== weapon)
                                        )
                                    }
                                    style={{curser:"pointer", marginBottom:"12px"}}
                                    onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                                    onMouseLeave={(e) => (e.target.style.color = "#a6c0b7")}
                                >
                                    {weapon}
                                </li>
                            ))}
                            <Dropdown className="mt-4" onSelect={(weapon) => setSelectedWeapons((prev) => 
                                prev.includes(weapon) ? prev : [...prev, weapon])}>
                                <Dropdown.Toggle variant="success">
                                    Weapons List
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {databaseWeapons.map((weapon) => (
                                        <Dropdown.Item key={weapon} eventKey={weapon}>
                                            {weapon}
                                        </Dropdown.Item>
                                    ))}

                                    

                                </Dropdown.Menu>
                            </Dropdown>
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
                                    <li>
                                        Circumstance:
                                        <Form.Control
                                        type="number"
                                        value={defensiveBonuses[type].circumstance}
                                        onChange={(e) => handleDefensiveChange(type, "circumstance", e.target.value)}
                                        />
                                    </li>
                                    <li>
                                        Item:
                                        <Form.Control
                                        type="number"
                                        value={defensiveBonuses[type].item}
                                        onChange={(e) => handleDefensiveChange(type, "item", e.target.value)}
                                        />
                                    </li>
                                    <li>
                                        Status:
                                        <Form.Control
                                        type="number"
                                        value={defensiveBonuses[type].status}
                                        onChange={(e) => handleDefensiveChange(type, "status", e.target.value)}
                                        />
                                    </li>
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
