import { useEffect, useState } from "react";
import { Dropdown, Button, Card, Form } from "react-bootstrap";
import blankPicture from "../../images/characterImages/blank character.png";
import CharacterCard from "./CharacterCard/CharacterCard";

function BattleSimulator() {
    //
    const [log, setLog] = useState([]);
    const [characterList, setCharacterList] = useState([]);
    const [actionsRemaining, setActionsRemaining] = useState([true, true, true]);
    const [selectedAction, setSelectedAction] = useState("Grapple");
    //I.e grapple, trip, etc...
    const [globalActions, setGlobalActions] = useState([]);
    const [availableActions, setAvailableActions] = useState([]);
    const [offensiveBonuses, setOffensiveBonuses] = useState({});
    const [defensiveBonuses, setDefensiveBonuses] = useState({});
    const [error, setError] = useState("");
    const [swapTrigger, setSwapTrigger] = useState(0); //To Ensure re-render on swap
    const [avgOrLuck, setAvgOrLuck] = useState(true); //True = Average, False = Luck
    const [effectResolution, setEffectResolution] = useState(true); //True = Auto, False = Manual

    const [attacker, setAttacker] = useState({
        name: null,
        image: blankPicture,
        hp: 0,
        effects: [],
    });

    const [defender, setDefender] = useState({
        name: null,
        image: blankPicture,
        hp: 0,
        effects: [],
    });

    //Fetch character list for passing on to CharacterCard and backend on action resolve
    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/characters");
                const data = await res.json();
                setCharacterList(Object.values(data)); // contains full schema
            } catch (err) {
                console.error("Error fetching characters:", err);
            }
        };

        const fetchGlobalActions = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/actions");
                const data = await res.json();
                setGlobalActions(data); //["Grapple", "Trip", "Demoralize", ...etc]
            } catch (err) {
                console.error("Error fetching global actions:", err);
            }
        };

        fetchCharacters();
        fetchGlobalActions();
    }, []);

    //Load saved session from localStorage
    useEffect(() => {
        //Where all the bonuses are stored alongside item selection
        const saved = localStorage.getItem("battleSession");
        if (!saved) return;

        const parsed = JSON.parse(saved);

        //Load attacker info
        const currentAttacker = parsed[attacker.name];
        if (currentAttacker) {
            //Always include Grapple and Trip, then merge attacker’s actions
            setAvailableActions([
                ...globalActions,
                ...(currentAttacker.selectedWeapons || []),
                ...(currentAttacker.selectedSpells || []),
            ]);

            setOffensiveBonuses(currentAttacker.offensiveBonuses || {});
        }

        //Load defender info
        const currentDefender = parsed[defender.name];
        if (currentDefender) {
            setDefensiveBonuses(currentDefender.defensiveBonuses || {});
        }
    }, [attacker.name, defender.name, swapTrigger, globalActions]);

    const updateActions = ({ index = null, cost = null }) => {
        //Changes green action box (ensures one step at a time if clicked)
        setActionsRemaining((prev) => {
            const newActions = [...prev];
            if (index !== null) {
                //If the index is checked, if theres still a true box left, make the latest one false
                if (newActions[index]) {
                    const lastTrueIndex = newActions.lastIndexOf(true);
                    if (lastTrueIndex !== -1) {
                        newActions[lastTrueIndex] = false;
                    }
                //if the index isnt checked, if theres a false box left, make the latest one true
                } else {
                    const nextFalseIndex = newActions.indexOf(false);
                    if (nextFalseIndex !== -1) {
                        newActions[nextFalseIndex] = true;
                    }
                }
            }

            if (cost !== null) {
                //Spend a certain number of actions
                for (let i = 0; i < cost; i++) {
                    const lastTrueIndex = newActions.lastIndexOf(true);
                    if (lastTrueIndex !== -1) {
                        newActions[lastTrueIndex] = false;
                    }
                }
            }

            return newActions;
        });
    };

    const handleTurnCommence = async () => {
        if (!actionsRemaining.some((a) => a)) {
            setError("No actions remaining!");
            return;
        }

        if (attacker.name === null || defender.name === null) {
            setError("Both characters must be selected!");
            return;
        }

        setError("");
        updateActions({ cost: 1 });

        try {
            const response = await fetch("http://localhost:5000/api/battles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    attacker,
                    defender,
                    action: selectedAction,
                    avgOrLuck,
                    offensiveBonuses,
                    defensiveBonuses,
                }),
            });

            const data = await response.json();

            //Update attacker and defender from backend result
            setAttacker((prev) => ({ ...prev, ...data.updatedAttacker }));
            setDefender((prev) => ({ ...prev, ...data.updatedDefender }));

            setLog(data.log);
            //Show result text from backend
        } catch (err) {
            console.error("Error resolving action:", err);
            setError("Action failed to resolve");
        }
    };

    const handleCharacterSwap = () => {
        const tempAttacker = attacker;
        setAttacker(defender);
        setDefender(tempAttacker);
        //To force trigger in case swaps are using the same name
        setSwapTrigger((prev) => prev + 1);
        //So previous interaction isn't clogging screen
        setLog([]);
    };

    return (
        <div className="d-flex flex-column align-items-center p-4">
            {/*---Top Bar Controls---*/}
            <div className="row align-items-center mt-2">
                <div className="col d-flex flex-column">
                    <Button
                        onClick={() => setEffectResolution(!effectResolution)}
                        variant="outline-light"
                    >
                        {effectResolution ? (
                            <>
                                Automate <br /> Effects
                            </>
                        ) : (
                            <>
                                Manuel <br /> Effects
                            </>
                        )}
                    </Button>
                </div>

                <div className="col d-flex justify-content-center">
                    <Button
                        style={{ whiteSpace: "nowrap" }}
                        onClick={handleCharacterSwap}
                        variant="outline-info"
                    >
                        Swap Characters
                    </Button>
                </div>

                <div className="col d-flex flex-column">
                    <Button
                        onClick={() => {
                            setAvgOrLuck(!avgOrLuck);
                            setLog([]);
                        }}
                        variant="outline-light"
                    >
                        {avgOrLuck ? (
                            <>
                                Average Health <br /> Calculator
                            </>
                        ) : (
                            <>
                                Luck Health <br /> Calculator
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="d-flex justify-content-center w-100 mt-4">
                {/*---Attacking Character---*/}
                <CharacterCard
                    title="Attacking Character"
                    character={attacker}
                    setCharacter={setAttacker}
                    characterList={characterList}
                />

                {/*---Actions---*/}
                <Card style={{ width: "300px", margin: "20px" }}>
                    <Card.Body className="text-center">
                        <h4>Actions</h4>

                        {/*Toggleable action squares*/}
                        <div className="d-flex justify-content-center mb-3">
                            {actionsRemaining.map((active, i) => (
                                <div
                                    key={i}
                                    onClick={() => updateActions({ index: i })}
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        margin: "5px",
                                        backgroundColor: active ? "limegreen" : "gray",
                                        cursor: "pointer",
                                    }}
                                />
                            ))}
                        </div>

                        {/*Dropdown for action selection*/}
                        <Dropdown onSelect={(key) => setSelectedAction(key)} className="mb-3">
                            <Dropdown.Toggle variant="outline-light">
                                {selectedAction}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {availableActions.map((action, i) => (
                                    <Dropdown.Item key={i} eventKey={action}>
                                        {action}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/*Commence turn button*/}
                        <Button variant="success" className="mb-2" onClick={handleTurnCommence}>
                            Turn Commence!
                        </Button>

                        {error && <p className="text-danger">{error}</p>}
                    </Card.Body>
                </Card>

                {/*---Defending Character---*/}
                <CharacterCard
                    title="Defending Character"
                    character={defender}
                    setCharacter={setDefender}
                    characterList={characterList}
                />
            </div>
            
            {/*---Display fight result---*/}
            <div style={{ width: "30%", marginTop: "20px" }}>
                <Card style={{ width: "100%" }}>
                    <Card.Body className="text-center">
                        <h2
                            style={{
                                justifyContent: "center",
                                display: "flex",
                                margin: "0px",
                            }}
                            className="mt-3"
                        >
                            Resulting Math using {avgOrLuck ? `average` : `lucky`} rolls
                        </h2>

                        <div
                            style={{
                                display: "flex",
                                gap: "2rem", // spacing between the two
                                marginTop: "30px",
                                alignItems: "center",
                                justifyContent: "space-around",
                            }}
                        >
                            <h5 style={{ margin: 0, whiteSpace: "pre-line", textAlign: "center" }}>
                                {log.attacker}
                            </h5>
                            <h5 style={{ margin: 0 }}>{log.defender}</h5>
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            <p style={{ margin: 0 }}>{log.mainLine}</p>
                            <p style={{ margin: 0 }}>{log.secondLine}</p>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default BattleSimulator;
