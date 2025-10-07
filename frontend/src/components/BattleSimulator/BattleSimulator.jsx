import { useState } from "react";
import { Dropdown, Button, Card, Form } from "react-bootstrap";
import blankPicture from "../../images/characterImages/blank character.png";
import CharacterCard from "./CharacterCard/CharacterCard"


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
      <div className="row align-items-center mt-2">
        <div className="col d-flex flex-column">
          <label className="text-center">Automatic Effect resolution</label>
          <Form.Check type="checkbox" label="" />
        </div>

        <div className="col d-flex justify-content-center">
          <Button variant="outline-info">Swap</Button>
        </div>

        <div className="col d-flex flex-column">
          <label>Average or Luck</label>
          <Form.Check type="checkbox" label="" />
        </div>
      </div>

      <div className="d-flex justify-content-center w-100">
        {/* Attacking Character */}
        <CharacterCard title="Attacking Character" hp={110} image={blankPicture} />

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
        <CharacterCard title="Defending Character" hp={110} image={blankPicture} />
      </div>
    </div>
  );
}

export default BattleSimulator;
