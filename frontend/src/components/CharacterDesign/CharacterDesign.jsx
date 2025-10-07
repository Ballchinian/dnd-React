import { CardBody, Card, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import "./CharacterDesign.css";
import { useParams, useNavigate } from "react-router-dom";
import NewCharacterPicture from "../../images/characterImages/blank character.png";

function CharacterDesign() {
    const navigate = useNavigate();
    
    //From url
    let { name } = useParams();

    //Confirmation States
    const [editNameVis, setEditNameVis] = useState(true);
    const [createOverEdit, setCreateOverEdit] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({})

    //Show preview of image before upload
    const [previewUrl, setPreviewUrl] = useState("");
    //Stored Characters
    const [characterStorage, setCharacterStorage] = useState([])

    //Stats we care about
    const [characterName, setCharacterName] = useState("");
    const [imgUrl, setImgUrl] = useState("")
    const [characterStats, setCharacterStats] = useState({
        AC: 0,
        athletics: 0,
        health: 0,
        reflex: 0,
        fortitude: 0,
        mind: 0
    });

 
    useEffect(() => {
        if (name !== "newCharacter") {
            setCharacterName(name);
            //Finds the character from the backend and sets the stats and image
            const fetchCharacters = async () => {
                try {
                    const res = await fetch("http://localhost:5000/api/characters");
                    const data = await res.json();
                    setCharacterStorage(data);
                    
                    const char = data.find(c => c.characterName === name);
                    if (char) {
                        setCharacterStats(char.stats);
                        setImgUrl(char.image);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchCharacters();
        } else {
            setEditNameVis(false);
            setCreateOverEdit(true);
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
    async function handleChangeCharacter() {  
        if (uploading) {
            alert("Please wait, image is still uploading...");
            return;
        }
        //Validation for character
        const newErrors={}
        Object.entries(characterStats).forEach(([key, value]) => {
            if (value === "" || isNaN(value)) {
                newErrors[key] = `${key} must be a number!`;
            }
        });
        if (!characterName || characterName.trim() === "") {
            newErrors.characterName = "Character name is required.";
        }
        if (name !== characterName) {
            const isDuplicate = characterStorage.some(
                c => c &&
                    c.characterName.toLowerCase() === characterName.trim().toLowerCase() &&
                    c.characterName.toLowerCase() !== name.toLowerCase()
            );
            if (isDuplicate) newErrors.duplicate = "A character with this name already exists.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => setErrors({}), 2000);
            return;
        }
        setErrors({});    

        //Create the character object to send to backend
        const characterData = {
            characterName: characterName,
            stats: characterStats,
            image: imgUrl // <-- include the URL here
        };

        try {
            //Decides to make a character if new, if not then edit it
           if (createOverEdit) {
                //Create new character
                const res = await fetch("http://localhost:5000/api/characters", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(characterData)
                });
                const saved = await res.json();
                setCharacterStorage(prev => [...prev, saved]);
            } else {
                //Edit existing character
                const res = await fetch(`http://localhost:5000/api/characters/${name}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(characterData)
                });
                const updated = await res.json();

                //Update local storage array by matching the old name
                setCharacterStorage(prev =>
                    prev.map(c => c.characterName === name ? updated : c)
                );
            }
        } catch (err) {
            console.error(err)
        }

        navigate("/character-selection");
        //Checks if the character is new, if so change it to edit from now on
        if (createOverEdit===true) {
            setCreateOverEdit(false);
        }
    };

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        //Show local preview immediately
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        // Start loading
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:5000/api/upload-image", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            setImgUrl(data.url);
            //Remove preview once we have a hosted URL
            setPreviewUrl(""); 
        } catch (err) {
            console.error("Error uploading image:", err);
        } finally {
            setUploading(false);
        }   
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
                {errors.characterName && (
                    <div className="text-danger">{errors.characterName}</div>
                )}
                {errors.duplicate && (
                    <div className="text-danger">{errors.duplicate}</div>
                )}
                <img
                    style={{ width: "200px", height: "200px", marginTop: "20px" }}
                    src={previewUrl || imgUrl || NewCharacterPicture}  // pick preview first
                    alt="Character"
                    />
                {uploading && <div className="text-warning mt-2">Uploading image...</div>}
                <div className="mt-3">
                    <Form.Control 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
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
