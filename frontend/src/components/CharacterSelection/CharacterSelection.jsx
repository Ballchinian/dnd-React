import './CharacterSelection.css';
import { useNavigate } from "react-router-dom";
import { Card, Button, Form } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import characterImageTemplate from "../../images/characterImages/blank character.png";

function CharacterSelection() {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState([]); //All characters from backend
    const [filteredCharacters, setFilteredCharacters] = useState([]); //Characters filtered by search bar
    const [index, setIndex] = useState(0); //Current carousel index
    const [searchTerm, setSearchTerm] = useState(""); //Current search query

    //Fetch all characters on first render
    useEffect(() => {
        async function fetchCharacters() {
            try {
                const res = await fetch("http://localhost:5000/api/characters");
                const data = await res.json();
                const transformed = data.map(char => ({
                    name: char.characterName,
                    stats: char.stats,
                    //Fallback if no custom image
                    image: char.image || characterImageTemplate, 
                }));
                //Save full list
                setCharacters(transformed); 
                //Show all initially
                setFilteredCharacters(transformed); 
            } catch (err) {
                console.error("Error fetching characters:", err);
            }
        }
        fetchCharacters();
    }, []); //Run once on mount

    //Handle search input changes
    const handleSearch = (e) => {
        const value = e.target.value;
        //Update search term
        setSearchTerm(value); 
        const filtered = characters.filter(c =>
            //Case-insensitive match
            c.name.toLowerCase().includes(value.toLowerCase()) 
        );
        //Update filtered list
        setFilteredCharacters(filtered); 
        //Reset carousel to first
        setIndex(0);
    };

    const handleDeleteCharacter = async (characterName) => {
        if (!window.confirm(`Are you sure you want to delete "${characterName}"?`)) return;

        try {
            const res = await fetch(`http://localhost:5000/api/characters/${characterName}`, {
                method: "DELETE",
            });

            if (res.ok) {
                //Remove character from frontend lists
                setCharacters(prev => prev.filter(c => c.name !== characterName));
                setFilteredCharacters(prev => prev.filter(c => c.name !== characterName));

                //Adjust index if it’s too high
                setIndex(0)
            } else {
                console.error("Failed to delete character");
            }
        } catch (err) {
            console.error("Error deleting character:", err);
        }
    };

    //Number of filtered characters
    const characterLength = filteredCharacters.length; 
    const handleCharacterSelect = (characterName) => {
        //Go to character page
        navigate(`/character-selection/character-design/${characterName}`); 
    };
    const prev = () => {
        //Move left if possible
        if (index > 0) setIndex(index - 1); 
    };
    const next = () => {
        //Move right if enough characters
        if (characterLength - index > 3) setIndex(index + 1); 
    };

    return (
        <div
            className="d-flex flex-column align-items-center"
            style={{
                minHeight: "100vh", //Allows page to grow if content gets taller
                padding: "20px",
                gap: "100px"  
            }}
                    >
            {/*search bar*/}
            <div style={{ width: "300px" }}>
                <Form.Control
                    type="text"
                    placeholder="Search characters..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {/*character carousel*/}
            <div className="d-flex justify-content-center align-items-center">
                <div className="d-flex">

                    {/*Show prev button only if there are 3 or more characters */}
                    {characterLength >= 4 && (
                        <Button variant="secondary" onClick={prev}>Prev</Button>
                    )}

                    <div className="carousel-wrapper" style={{ width: "900px", overflow: "hidden" }}>
                        <div
                            className="d-flex "
                            style={{ transform: `translateX(-${index * 300}px)`, transition: "transform 0.3s ease"}}
                        >
                            {filteredCharacters.map((character) => (
                                <Card
                                    className="d-flex align-items-center"
                                    key={character.name}
                                    style={{
                                        
                                        height: "35vh",
                                        width: "300px",
                                        flex: "0 0 300px",                  
                                        margin: "0"
                                    }}
                                    
                                >
                                    <Card.Header>{character.name}</Card.Header>
                                    <Card.Img
                                        style={{ width: "225px", height: "180px", objectFit: "contain"}}
                                        src={character.image}
                                        onClick={() => handleCharacterSelect(character.name)}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = `scale(1.05)`}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = `scale(1)`}
                                    />
                                    <Button
                                        variant="danger"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: "auto"
                                        }}
                                        onClick={() => handleDeleteCharacter(character.name)}
                                    >
                                        <FaTrash style={{ marginRight: "8px" }} />
                                        Delete
                                    </Button>
                                </Card>
                                
                            ))}
                        </div>
                    </div>
                    {/*Show prev button only if there are 3 or more characters */}
                    {characterLength >= 4 && (
                        <Button variant="secondary" onClick={next}>Next</Button>
                    )}
                </div>
            </div>
            {/*bottom button*/}
            <Button
                onClick={() => handleCharacterSelect("newCharacter")}
                variant="dark"
            >
                Create a new character
            </Button>
        </div>
    );
}

export default CharacterSelection;
