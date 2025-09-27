import { useState, useEffect } from "react";
import { Dropdown, Button, Card, Form, ProgressBar } from "react-bootstrap";
import Todd from "../../../images/characterImages/Todd.jpg";
import { useLocation } from "react-router-dom";

//Fake data for demo
const CONDITION_LIST = ["Runic Weapon", "Slowed", "Frightened"];
const CHARACTER_LIST = ["Todd the Brave", "Todd the Cunning", "Todd the Fearless"];

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
        {character && <p className="fw-bold">{character}</p>}
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
        {!addingEffect ? (
          <Button
            variant="outline-info"
            className="w-100"
            onClick={() => setAddingEffect(true)}
          >
            Add Effect
          </Button>
        ) : (
          <div>
            <Form.Control
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

function BattleSimulator() {
  const [actionsRemaining, setActionsRemaining] = useState([true, true, true]);
  const [selectedAction, setSelectedAction] = useState("Grapple");
  const [error, setError] = useState("");

  const updateActions = ({ index = null, cost = null }) => {
    setActionsRemaining((prev) => {
      const newActions = [...prev];

      if (index !== null) {
        // --- Toggle specific index ---
        const lastTrueIndex = newActions.lastIndexOf(true);

        if (newActions[index]) {
          if (lastTrueIndex !== -1) {
            newActions[lastTrueIndex] = false;
          }
        } else {
          const nextFalseIndex = newActions.indexOf(false);
          if (nextFalseIndex !== -1) {
            newActions[nextFalseIndex] = true;
          }
        }
      }

      if (cost !== null) {
        // --- Spend a certain number of actions ---
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

  const handleTurnCommence = () => {
    //Eventually, need to make sure the error will show up if the cost is too great, then toggleActionSpend
    if (!actionsRemaining.some((a) => a)) {
      setError("No actions remaining!");
    } else {
      setError("");
      updateActions({cost:1});
      console.log("Turn commenced with:", selectedAction);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center p-4">
      {/* Top Bar Controls */}
      <div className="d-flex justify-content-around w-100 mb-4">
        <Form.Check type="checkbox" label="Automatic Effect resolution" />
        <Button variant="outline-info">Swap</Button>
        <Form.Check type="checkbox" label="Average or Luck" />
      </div>

      <div className="d-flex justify-content-center w-100">
        {/* Attacking Character */}
        <CharacterCard title="Attacking Character" hp={110} image={Todd} />

        {/* Actions */}
        <Card style={{ width: "300px", margin: "20px" }}>
          <Card.Body className="text-center">
            <h4>Actions</h4>

            {/* Toggleable action squares */}
            <div className="d-flex justify-content-center mb-3">
              {actionsRemaining.map((active, i) => (
                <div
                  key={i}
                  onClick={() => updateActions({index:i})}
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

            {/* Dropdown for action selection */}
            <Dropdown
              onSelect={(key) => setSelectedAction(key)}
              className="mb-3"
            >
              <Dropdown.Toggle variant="outline-light">
                {selectedAction}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Grapple">Grapple</Dropdown.Item>
                <Dropdown.Item eventKey="Trip">Trip</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Commence turn button */}
            <Button
              variant="success"
              className="mb-2"
              onClick={handleTurnCommence}
            >
              Turn Commence!
            </Button>

            {error && <p className="text-danger">{error}</p>}

            <h5 className="mt-3">Resulting Math</h5>
            <p>50% chance to hit, AC lowered by an average of 1.4</p>
          </Card.Body>
        </Card>

        {/* Defending Character */}
        <CharacterCard title="Defending Character" hp={110} image={Todd} />
      </div>
    </div>
  );
}

export default BattleSimulator;
