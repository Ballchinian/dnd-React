import { CardBody, Card, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import "./CharacterDesign.css";
import { useParams } from "react-router-dom";
import NewCharacterPicture from "../../../images/characterImages/blank character.png";

function CharacterDesign() {
    const [editNameVis, setEditNameVis] = useState(true);
    const [characterName, setCharacterName] = useState("");
    const [createOverEdit, setCreateOverEdit] = useState(false);
    const { name } = useParams();

    useEffect(() => {
        if (name === "newCharacter") {
            setEditNameVis(false);
            setCreateOverEdit(true);
        } else {
            setCharacterName(name);
        }
    }, []);

    function handleChangeCharacter() {
        if (createOverEdit===true && characterName !== "") {
            setCreateOverEdit(false);
        }
    };

    function handeImageUpload() {
        console.log("to do");
    }

    return (
        <div className="d-flex flex-column align-items-center" style={{ width: "100%", paddingTop: "40px", paddingBottom: "40px" }}>
            
            {/* Character Name + Image */}
            <div className="text-center mb-4">
                {editNameVis ? (
                    <h1 
                        style={{ cursor: "pointer" }} 
                        onClick={() => setEditNameVis(false)}
                    >
                        {characterName}
                    </h1>
                ) : (
                    <Form.Control
                        type="text"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        onBlur={() => { if (characterName.trim() !== "") setEditNameVis(true); }}
                        onKeyDown={(e) => { if (e.key === "Enter" && characterName.trim() !== "") setEditNameVis(true); }}
                        autoFocus
                    />
                )}

                <img
                    style={{ width: "200px", height: "200px", marginTop: "20px" }}
                    src={NewCharacterPicture}
                    alt="Character"
                />

                <div className="mt-3">
                    <Form.Control 
                        type="file" 
                        accept="image/*" 
                        onChange={handeImageUpload}
                    />
                </div>
            </div>

            {/* Stats row */}
            <div className="d-flex justify-content-center mb-4" style={{ width: "80%" }}>
                {/* Left card */}
                <Card style={{ width:"200px", margin:"60px", height:"auto" }}>
                    <CardBody>
                        <h3>Stats</h3>
                        <p>AC</p>
                        <Form.Control type="number" />
                        <p>Athletics</p>
                        <Form.Control type="number" />
                        <p>Health</p>
                        <Form.Control type="number" />
                    </CardBody>
                </Card>

                {/* Right card */}
                <Card style={{ width:"200px", margin:"60px", height:"auto" }}>
                    <CardBody>
                        <h3>Saves</h3>
                        <p>Reflex</p>
                        <Form.Control type="number" />
                        <p>Fortitude</p>
                        <Form.Control type="number" />
                        <p>Will</p>
                        <Form.Control type="number" />
                    </CardBody>
                </Card>
            </div>

            {/* Bottom button */}
            <Button 
                style={{ width: "200px", marginTop: "40px", marginBottom: "40px" }} 
                variant="dark"
                onClick={handleChangeCharacter}
            >
                {createOverEdit ? 'New Character' : 'Edit Character'}
            </Button>
        </div>
    );
}

export default CharacterDesign;
