import { Card, Form, Dropdown, Button } from "react-bootstrap"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BattleCalculator() {
    const navigate = useNavigate();

    const defenceConditionTypes = ["Fortitude", "Reflex", "Mind"];
    const attackConditionTypes = ["Weapon", "Fortitude", "Reflex", "Mind"];

    const [selectedPlayer, setSelectedPlayer] = useState("Choose Player");
    const [selectedConditionAttack, setSelectedConditionAttack] = useState("Select attack type");
    const [selectedConditionDefence, setSelectedConditionDefence] = useState("Select defence type");
    
    const [selectedWeapons, setSelectedWeapons] = useState([]);
    const databaseWeapons = ["Sword","Mace","Firebook"]

    function handleGoToSimulator(characterName) {
        // optional: slugify for safe URLs
        const slug = characterName.replace(/\s+/g, "-").toLowerCase();
        navigate(`/battle-calculator/battle-simulator/${slug}`);
    }

    return (
        <div className="d-flex flex-column align-items-center">
            {/* Player Dropdown always visible */}
            <Dropdown
                onSelect={(key) => setSelectedPlayer(key)}
                style={{ marginTop: "100px" }}
            >
                <Dropdown.Toggle variant="dark" style={{ fontSize: "40px" }}>
                    {selectedPlayer}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Player 1">Player 1</Dropdown.Item>
                    <Dropdown.Item eventKey="Player 2">Player 2</Dropdown.Item>
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
                                    <Dropdown.Item eventKey="Weapon">Weapon</Dropdown.Item>
                                    <Dropdown.Item eventKey="Fortitude">Spell (Fortitude)</Dropdown.Item>
                                    <Dropdown.Item eventKey="Reflex">Spell (Reflex)</Dropdown.Item>
                                    <Dropdown.Item eventKey="Mind">Spell (Mind)</Dropdown.Item>
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
                                <ol
                                    key={type}
                                    style={{ display: selectedConditionAttack === type ? "block" : "none" }}
                                >
                                    <li>Circumstance Bonuses: <Form.Control type="number" placeholder="0" /></li>
                                    <li>Item Bonuses: <Form.Control type="number" placeholder="0" /></li>
                                    <li>Status Bonuses: <Form.Control type="number" placeholder="0" /></li>
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
                                <ol
                                    key={`damage_${type}`}
                                    style={{ display: selectedConditionAttack === type ? "block" : "none" }}
                                >
                                    <li>Circumstance Bonuses: <Form.Control type="number" placeholder="0" /></li>
                                    <li>Item Bonuses: <Form.Control type="number" placeholder="0" /></li>
                                    <li>Status Bonuses: <Form.Control type="number" placeholder="0" /></li>
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
                                        <Dropdown.Item eventKey={weapon}>
                                            {weapon}
                                        </Dropdown.Item>
                                    ))}

                                    

                                </Dropdown.Menu>
                            </Dropdown>
                        </Card>

                        {/* Right Column: Defence */}
                        <Card style={{ margin: "20px" }}>
                            <h2>Defensive Stats</h2>
                            <h3>AC</h3>
                            <ol>
                                <li>Circumstance Bonuses: <Form.Control type="number" placeholder="0" /></li>
                                <li>Item Bonuses: <Form.Control type="number" placeholder="0" /></li>
                                <li>Status Bonuses: <Form.Control type="number" placeholder="0" /></li>
                            </ol>

                            <Dropdown
                                onSelect={(key) => setSelectedConditionDefence(key)}
                                style={{ marginTop: "20px" }}
                            >
                                <Dropdown.Toggle variant="success">
                                    {selectedConditionDefence}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Fortitude">Fortitude</Dropdown.Item>
                                    <Dropdown.Item eventKey="Reflex">Reflex</Dropdown.Item>
                                    <Dropdown.Item eventKey="Mind">Mind</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {defenceConditionTypes.map((type) => (
                                <ol
                                    key={type}
                                    style={{ display: selectedConditionDefence === type ? "block" : "none" }}
                                >
                                    <li>Circumstance Bonuses: <Form.Control type="number" placeholder="0" /></li>
                                    <li>Item Bonuses: <Form.Control type="number" placeholder="0" /></li>
                                    <li>Status Bonuses: <Form.Control type="number" placeholder="0" /></li>
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
