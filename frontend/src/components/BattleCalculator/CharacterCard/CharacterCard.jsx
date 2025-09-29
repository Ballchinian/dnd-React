import { useState, useEffect } from "react";
import { Button, Card, Form, ProgressBar } from "react-bootstrap";


//Fake data for demo
const CONDITION_LIST = ["Runic Weapon", "Slowed", "Frightened"];
const CHARACTER_LIST_FORM = [
    {
        characterName: "Todd the brave",
        stats:{
            AC:5,
            athletics:0,
            health:0,
            reflex:0,
            fortitude:0,
            mind:0
        }},
    {
        characterName: "Todd the cunning",
        stats:{
            AC:5,
            athletics:0,
            health:0,
            reflex:0,
            fortitude:0,
            mind:0
        },
    }]

const CHARACTER_LIST = CHARACTER_LIST_FORM.map(
  (character) => character.characterName
);

function CharacterCard({ title, hp, image }) {
  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("battleSession");
    if (raw) {
      const data = JSON.parse(raw);

      //1hr expiry check
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - data.timestamp < oneHour) {
        setSavedData(data);
      } else {
        localStorage.removeItem("battleSession");
      }
    }
  }, []);
  
  //For the search bar when adding effect
  const [effects, setEffects] = useState([]);
  const [addingEffect, setAddingEffect] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  //For the search bar when selecting character
  const [character, setCharacter] = useState(null);
  const [choosingCharacter, setChoosingCharacter] = useState(false);
  const [characterSearch, setCharacterSearch] = useState("");

  //Effects
  const handleSelectEffect = (effect) => {
    if (!effects.includes(effect)) {
      setEffects([...effects, effect]);
    }
    setSearchTerm("");
    setAddingEffect(false);
  };

  const handleEffectBlur = () => {
    setSearchTerm("");
    setAddingEffect(false);
  };

  const filteredConditions = CONDITION_LIST.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Character selection
  const handleSelectCharacter = (char) => {
    setCharacter(char);
    setCharacterSearch("");
    setChoosingCharacter(false);
  };

  const handleCharacterBlur = () => {
    setCharacterSearch("");
    setChoosingCharacter(false);
  };

  const filteredCharacters = CHARACTER_LIST.filter((c) =>
    c.toLowerCase().includes(characterSearch.toLowerCase())
  );

  return (
    <Card style={{ width: "250px", margin: "20px" }}>
      <Card.Body>
        <h5>{title}</h5>

        {/* Character selection */}
        {/*Shows character name if selected*/}
        {character && <p className="fw-bold">{character}</p>}
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
                        src={image}
                        alt={char}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                        }}
                      />
                      {char}
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
        <img src={image} alt="Character" className="w-100 mb-2" />

        {/* HP Bar */}
        <ProgressBar
          variant="success"
          now={(hp / 110) * 100}
          label={`${hp}/110`}
          className="mb-2"
        />

        {/* Effects list */}
        <div className="mb-2">
          {effects.map((e, i) => (
            <p key={i} className="mb-1">
              {e}
            </p>
          ))}
        </div>

        {/* Add Effect button OR search bar */}
        {/*If selected, change button for search bar*/}
        {!addingEffect ? (
          <Button
            variant="outline-info"
            className="w-100 mt-3"
            onClick={() => setAddingEffect(true)}
          >
            Add Effect
          </Button>
        ) : (
          <div>
            <Form.Control
              className="mt-4"
              type="text"
              placeholder="Search conditions..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={handleEffectBlur}
            />
            {searchTerm && (
              <div
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