import './CharacterSelection.css';
import { useNavigate } from "react-router-dom";
import { Card, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import Todd from '../../images/characterImages/Todd.jpg';
import ShadarKai from '../../images/characterImages/Shadar-Kai.jpg';
import Erm from '../../images/characterImages/Erm.png';
import characterImageTemplate from "../../images/characterImages/blank character.png";

function CharacterSelection() {
    const navigate = useNavigate();

    const [index, setIndex] = useState(0);
    const characters = [
        { name: "Goblin", level: 1, src: Todd },
        { name: "Kobalt", level: 3, src: ShadarKai },
        { name: "Dragon", level: 20, src: Erm },
        { name: "Todd", level: 99, src: characterImageTemplate }
    ];
    const characterLength = characters.length;
    
    function handleCharacterSelect(characterName) {
        navigate(`/character-selection/character-design/${characterName}`);
    }

    function prev() {    
        if (index !== 0) {
            setIndex(index - 1);
        }
    }

    function next() {
        if (characterLength - index > 3) {
            setIndex(index + 1);
        }
    }

    return (
        <div 
            className="d-flex flex-column align-items-center" 
            style={{ height: "100vh", justifyContent: "space-between", padding: "20px" }}
        >
            {/* Character Carousel */}
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
                <div className="d-flex">
                    <Button variant="secondary" onClick={prev}>Prev</Button>
                    <div className="d-flex overflow-hidden" style={{ width: "900px" }}>
                        {characters.map((character) => (
                            <Card 
                                className="d-flex align-items-center justify-content-center" 
                                key={character.name}
                                name={character.name}
                                style={{
                                    height: "35vh", 
                                    width: "300px", 
                                    flex: "0 0 auto",
                                    transform: `translateX(${-index*300}px)`,
                                    margin: "0"
                                }}
                                onClick={() => {handleCharacterSelect(character.name)}}
                            >
                                <Card.Header>{character.name}</Card.Header>
                                <Card.Img 
                                    style={{ width:"225px", height:"180px", objectFit:"contain" }} 
                                    src={character.src} 
                                />
                            </Card>
                        ))}
                    </div>
                    <Button variant="secondary" onClick={next}>Next</Button>
                </div>
            </div>

            {/* Bottom button */}
            <Button 
                onClick={() => handleCharacterSelect("newCharacter")} 
                style={{ marginBottom: "20px" }}
                variant="dark"
            >
                Create a new character
            </Button>
        </div>
    );
}

export default CharacterSelection;
