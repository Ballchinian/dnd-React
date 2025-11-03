import { useState, useEffect } from "react";
import { Button, Card, Form, ProgressBar } from "react-bootstrap";
import blankPicture from ".././../../images/characterImages/blank character.png";

//Fake data for demo
const CONDITION_LIST = ["Runic Weapon", "Slowed", "Frightened"];

function CharacterCard({ title, character, setCharacter, characterList }) {

    //For the search bar when adding effect
    const [addingEffect, setAddingEffect] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    //For the search bar when selecting character
    const [choosingCharacter, setChoosingCharacter] = useState(false);
    const [characterSearch, setCharacterSearch] = useState("");

    //Give effect to character if it doesnt already have it
    const handleSelectEffect = (effect) => {
        if (!character.effects.includes(effect)) {
            setCharacter({
                ...character,
                effects: [...character.effects, effect],
            });
        }
        setSearchTerm("");
        setAddingEffect(false);
    };

    //Enables removale of effects (once effect clicked on frontend, function should run)
    const handleRemoveEffect = (effectToRemove) => {
        setCharacter((prev) => ({
            ...prev,
            effects: prev.effects.filter((effect) => effect !== effectToRemove),
        }));
    };

    //Enables deletion from search bar of effects
    const handleEffectBlur = () => {
        setSearchTerm("");
        setAddingEffect(false);
    };

    //filters from available list of conditions
    const filteredConditions = CONDITION_LIST.filter((c) =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Character selection
    const handleSelectCharacter = (selectedChar) => {
        //sets additional parameters to assist with sending data to backend and keeping track (health)
        setCharacter({
            name: selectedChar.characterName,
            image: selectedChar.image || blankPicture,
            effects: selectedChar.effects || [],
            stats: {
                ...selectedChar.stats,
                maxHealth: selectedChar.stats.health,
                currentHealth: selectedChar.stats.health,
            },
        });

        setCharacterSearch("");
        setChoosingCharacter(false);
    };

    //Enables deletion from search bar of characters
    const handleCharacterBlur = () => {
        setCharacterSearch("");
        setChoosingCharacter(false);
    };

    //Sets up filtered list of characters based on search
    const filteredCharacters = characterList.filter((c) =>
        c.characterName.toLowerCase().includes(characterSearch.toLowerCase())
    );

    return (
        <Card style={{ width: "250px", margin: "20px" }}>
            <Card.Body>
                <h3>{title}</h3>

                {/*---Character selection--- */}
                {/*Shows character name if selected*/}
                {character?.name && (
                    <p style={{ fontSize: "24px", color: "white" }}>{character.name}</p>
                )}

                {/*If focused on select character, change it from button to search bar*/}
                {!choosingCharacter ? (
                    <Button
                        variant="outline-info"
                        className="w-100 mb-3"
                        onClick={() => setChoosingCharacter(true)}
                    >
                        Select Character
                    </Button>
                ) : (
                    //Search Bar for characters
                    <div className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search characters..."
                            autoFocus
                            value={characterSearch}
                            onChange={(e) => setCharacterSearch(e.target.value)}
                            onBlur={handleCharacterBlur}
                        />

                        {characterSearch && (
                            <div
                                //results from search bar on characters
                                style={{
                                    background: "white",
                                    color: "black",
                                    border: "1px solid #ccc",
                                    marginTop: "2px",
                                    borderRadius: "4px",
                                    maxHeight: "120px",
                                    overflowY: "auto",
                                }}
                            >
                                {/*If no chars, then put no matches, otherwise...*/}
                                {filteredCharacters.length > 0 ? (
                                    filteredCharacters.map((char, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: "4px 8px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                            }}
                                            onMouseDown={() => handleSelectCharacter(char)}
                                        >
                                            {/*Mini logo of character*/}
                                            <img
                                                src={char.image}
                                                alt={char.characterName}
                                                style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    borderRadius: "50%",
                                                }}
                                            />
                                            <span>{char.characterName}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: "4px 8px" }}>No matches</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Character image */}
                <img src={character?.image || blankPicture} alt="Character" className="w-100 mb-2" />

                {/*---HP Bar---*/}
                <ProgressBar
                    variant="success"
                    now={
                        //Sets progress bar based on currentHealth / maxHealth (if maxHealth doesbt exist, set to 100%)
                        character?.stats?.maxHealth
                            ? (character?.stats?.currentHealth / character?.stats?.maxHealth) * 100
                            : 100
                    }
                    //lists 0 health if no character is selected
                    label={`${character?.stats?.currentHealth ?? 0}/${character?.stats?.maxHealth ?? 0}`}
                    className="mb-2"
                    onClick={() => {
                        //If its a blank character, dont let health be assigned
                        if (!character.name) return;
                        const newHealth = prompt("Enter new current health:");
                        if (newHealth !== null) {
                            //Clamp health between 0 and maxHealth, then set
                            setCharacter({
                                ...character,
                                stats: {
                                    ...character.stats,
                                    currentHealth: Math.min(
                                        character.stats.maxHealth,
                                        Math.max(0, parseInt(newHealth))
                                    ),
                                },
                            });
                        }
                    }}
                />

                {/*---Effects section---*/}
                {/*If the character has effects, enable the display of them*/}
                {character.effects?.length > 0 && (
                    <div className="mt-4 ">
                        <h6 className="fw-bold">Active Effects:</h6>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                        >
                            {/*Where the actual effects are mapped out*/}
                            {character.effects.map((effect, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleRemoveEffect(effect)}
                                    style={{
                                        padding: "6px 10px",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "#28a745"; // success color on hover
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                    title="Click to remove effect"
                                >
                                    {effect}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/*Add Effect button / search bar*/}
                {/*If selected, change button for search bar*/}
                {!addingEffect ? (
                    <Button
                        variant="outline-info"
                        className="w-100 mt-3"
                        onClick={() => {
                            if (character.name) setAddingEffect(true);
                        }}
                    >
                        Add Effect
                    </Button>
                ) : (
                    <div>
                        {/*Search bar for effects*/}
                        <Form.Control
                            className="mt-3"
                            type="text"
                            placeholder="Search conditions..."
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onBlur={handleEffectBlur}
                        />
                        {searchTerm && (
                            //where all the conditions are listed
                            <div
                                style={{
                                    background: "white",
                                    color: "black",
                                    maxHeight: "120px",
                                    overflowY: "auto",
                                }}
                            >
                                {/*If no results, put no matches*/}
                                {filteredConditions.length > 0 ? (
                                    filteredConditions.map((cond, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: "4px 8px",
                                                cursor: "pointer",
                                            }}
                                            onMouseDown={() => handleSelectEffect(cond)}
                                        >
                                            {cond}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: "4px 8px" }}>No matches</div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default CharacterCard;
