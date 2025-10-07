import './CharacterSelection.css';
import { useNavigate } from "react-router-dom";
import { Card, Button, Form } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
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
                    <Button variant="secondary" onClick={prev}>Prev</Button>
                    <div className="d-flex overflow-hidden" style={{ width: "900px" }}>
                        {filteredCharacters.map((character) => (
                            <Card
                                className="d-flex align-items-center justify-content-center"
                                key={character.name}
                                style={{
                                    height: "35vh",
                                    width: "300px",
                                    flex: "0 0 auto",
                                    transform: `translateX(${-index * 300}px)`,
                                    margin: "0"
                                }}
                                onClick={() => handleCharacterSelect(character.name)}
                            >
                                <Card.Header>{character.name}</Card.Header>
                                <Card.Img
                                    style={{ width: "225px", height: "180px", objectFit: "contain" }}
                                    src={character.image}
                                />
                            </Card>
                        ))}
                    </div>
                    <Button variant="secondary" onClick={next}>Next</Button>
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
