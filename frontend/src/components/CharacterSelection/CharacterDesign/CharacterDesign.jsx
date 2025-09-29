import { CardBody, Card, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import "./CharacterDesign.css";
import { useParams, useNavigate } from "react-router-dom";
import NewCharacterPicture from "../../../images/characterImages/blank character.png";

function CharacterDesign() {
    const navigate = useNavigate();
    
    //From url
    const { name } = useParams();

    //UI States
    const [editNameVis, setEditNameVis] = useState(true);
    const [createOverEdit, setCreateOverEdit] = useState(false);
    const [confirmedName, setConfirmedName] = useState();

    //Stored Characters
    const [characterStorage, setCharacterStorage] = useState([])

    //Stats we care about
    const [characterName, setCharacterName] = useState("");
    const [imgUrl, setImgUrl] = useState("")
    const [errors, setErrors] = useState({})
    const [characterStats, setCharacterStats] = useState({
        AC: 0,
        athletics: 0,
        health: 0,
        reflex: 0,
        fortitude: 0,
        mind: 0
    });

    //When entering, check if a newCharacter is being selected or if an old character is being edited, then set the UI up
    useEffect(() => {
        if (name === "newCharacter") {
            setEditNameVis(false);
            setCreateOverEdit(true);
        } else {
            setCharacterName(name);
        }
    }, [name]);


    function handleCharacterInputChange(e) {
        const { name, value } = e.target;
        setCharacterStats(prev => ({
            ...prev,
            [name]: value
    }));
}

    //Purely for the bottom button and if it shows new character or edit character
    function handleChangeCharacter() {  

        //New character mode
        if (createOverEdit===true && characterName !== "") {
            setCreateOverEdit(false);
        }

        //Edit character mode
        const newErrors={}
        Object.entries(characterStats).forEach(([key, value]) => {
            if (value === "" || isNaN(value)) {
                newErrors[key] = `${key} must be a number!`;
            }
        });
        if (!characterName || characterName.trim() === "") {
            newErrors.characterName = "Character name is required.";
        }
        if (characterStorage.some(
            w => w.characterName.toLowerCase() === characterName.trim().toLowerCase()
        )) {
            newErrors.duplicate = "A character with this name already exists.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setConfirmedName()
            return;
        }
        setErrors({});

        let confirmationMessage;
        //Shows user that their user went through
        if (createOverEdit) {
            confirmationMessage = `${characterName} has been made!`;
        } else {
            confirmationMessage = `${characterName} has been edited`;
        }
        setConfirmedName(confirmationMessage);

        setCharacterStorage(prev => [
        ...prev,
        {
            characterName: characterName,
            stats: {
            ...characterStats
            }
        }
        ]);
        console.log(characterStorage);
        //To change with backend logic
    };

    function handeImageUpload() {
        //To change with backend logic
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
                {confirmedName && (
                        <div className="text-success">{confirmedName}</div>
                    )}
                {errors.characterName && (
                    <div className="text-danger">{errors.characterName}</div>
                )}
                {errors.duplicate && (
                    <div className="text-danger">{errors.duplicate}</div>
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
                        <Form.Control 
                            type="number" 
                            name="AC" 
                            value={characterStats.AC} 
                            onChange={handleCharacterInputChange} 
                        />
                        {errors.AC && (
                            <div className="text-danger">{errors.AC}</div>
                        )}

                        <p>Athletics</p>
                        <Form.Control 
                            type="number" 
                            name="athletics"
                            value={characterStats.athletics} 
                            onChange={handleCharacterInputChange} 
                        />
                        {errors.athletics && (
                            <div className="text-danger">{errors.athletics}</div>
                        )}

                        <p>Health</p>
                        <Form.Control 
                            type="number" 
                            name="health"
                            value={characterStats.health} 
                            onChange={handleCharacterInputChange} 
                        />
                        {errors.health && (
                            <div className="text-danger">{errors.health}</div>
                        )}
                    </CardBody>
                </Card>

                {/* Right card */}
                <Card style={{ width:"200px", margin:"60px", height:"auto" }}>
                    <CardBody>
                        <h3>Saves</h3>

                        <p>Reflex</p>
                        <Form.Control 
                            type="number" 
                            name="reflex"
                            value={characterStats.reflex} 
                            onChange={handleCharacterInputChange} 
                        />
                        {errors.reflex && (
                            <div className="text-danger">{errors.reflex}</div>
                        )}

                        <p>Fortitude</p>
                        <Form.Control 
                            type="number" 
                            name="fortitude"
                            value={characterStats.fortitude} 
                            onChange={handleCharacterInputChange} 
                        />
                        {errors.fortitude && (
                            <div className="text-danger">{errors.fortitude}</div>
                        )}

                        <p>Mind</p>
                        <Form.Control 
                            type="number" 
                            name="mind"
                            value={characterStats.mind} 
                            onChange={handleCharacterInputChange} 
                        />
                        {errors.mind && (
                            <div className="text-danger">{errors.mind}</div>
                        )}
                    </CardBody>
                </Card>
            </div>
            {/* Bottom button */} 
            <Button 
                style={{ width: "200px", marginTop: "40px", marginBottom: "40px" }} 
                variant="dark" 
                onClick={handleChangeCharacter} > 
            {createOverEdit ? 'New Character' : 'Edit Character'} </Button>
        </div>
    );
}

export default CharacterDesign;
