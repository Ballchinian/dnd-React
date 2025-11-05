import { CardBody, Card, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import "./CharacterDesign.css";
import CharacterSkills from "./CharacterSkills/CharacterSkills";
import { useParams, useNavigate } from "react-router-dom";
import NewCharacterPicture from "../../images/characterImages/blank character.png";

function CharacterDesign() {
    const navigate = useNavigate();
    
    //From url
    let { initialName } = useParams();
    //Confirmation States
    const [editNameVis, setEditNameVis] = useState(initialName !== "newCharacter");
    const [createOverEdit, setCreateOverEdit] = useState(initialName === "newCharacter");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({})
    const [editingSkills, setEditingSkills] = useState(false);

    //Show preview of image before upload
    const [previewUrl, setPreviewUrl] = useState("");
    //Stored Characters
    const [characterStorage, setCharacterStorage] = useState([])

    //Info that will be essential for character 
    const [characterName, setCharacterName] = useState("");
    const [imgUrl, setImgUrl] = useState("")
    const [characterStats, setCharacterStats] = useState({
        ac: 0,
        dc: 0,
        health: 0,
        reflex: 0,
        fortitude: 0,
        will: 0,
        skills: {
            perception: 0,
            acrobatics: 0,
            athletics: 0,
            arcana: 0,
            crafting: 0,
            deception: 0,
            diplomacy: 0,
            intimidation: 0,
            medicine: 0,
            nature: 0,
            occultism: 0,
            performance: 0,
            religion: 0,
            society: 0,
            stealth: 0,
            survival: 0,
            thievery: 0
        }
        });

    
    //---Initialises characterStorage to find existing characters for duplication reasons---
    useEffect(() => {
        
        const fetchCharacters = async () => {
                try {
                    const res = await fetch("http://localhost:5000/api/characters");
                    const data = await res.json();
                    setCharacterStorage(data);
                    
                    //We search the database to find the old characters name
                
                
                    //If its an existing character
                    if (initialName !== "newCharacter") {
                        setCharacterName(initialName);

                        //Finds the character from the backend and sets the stats and image
                        const char = data.find(c => c.characterName === initialName);

                        if (char) {
                            setCharacterStats(char.stats);
                            setImgUrl(char.image);
                        } 
                    }
                } catch (err) {
                    console.error(err);
                }
        };
        fetchCharacters();
    }, [initialName]);


    //For all the different fields not including characterName or skills
     function handleStatChange(e) {
        const { name, value } = e.target;
        setCharacterStats(prev => ({ ...prev, [name]: Number(value) }));
    }
    
    async function handleChangeCharacter() {  
        if (uploading) {
            alert("Please wait, image is still uploading...");
            return;
        }

        //---Errors!---
        const newErrors={}

        //For stats not including skills
        Object.entries(characterStats).forEach(([key, value]) => {
            if (value === "" || isNaN(value)) {
                //skills is included in characterStats, must be iterated through seperatly
                if (key!=="skills") {
                    newErrors[key] = `${key} must be a number!`;
                }
            }
        });

        //For skills under skills
        Object.entries(characterStats.skills).forEach(([key, value]) => {
            if (value === "" || isNaN(value)) {
                newErrors[key] = `${key} must be a number!`;
            }
        })

        if (!characterName || characterName.trim() === "") {
            newErrors.characterName = "Character name is required.";
        }
        
        if (characterStorage.length > 0) {
            const isDuplicate = characterStorage.some(
                c =>
                    c &&
                    c.characterName.toLowerCase() === characterName.trim().toLowerCase() &&
                    c.characterName.toLowerCase() !== initialName.toLowerCase()
                );
            if (isDuplicate) newErrors.duplicate = "A character with this name already exists.";
            
        }
        console.log(newErrors);

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
                const res = await fetch(`http://localhost:5000/api/characters/${initialName}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(characterData)
                });
                const updated = await res.json();

                //Update local storage array by matching the old name
                setCharacterStorage(prev =>
                    prev.map(c => c.characterName === initialName ? updated : c)
                );
                
            }
            //Checks if the character is new, if so change it to edit from now on
            navigate("/character-selection");
            if (createOverEdit) setCreateOverEdit(false);
        } catch (err) {
            console.error(err)
        }

        
        
       
    };

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        //Show local preview immediately
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        //Start loading
        setUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("http://localhost:5000/api/characters/upload", {
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
    
    //For loading html forms
    const renderStatForms = stat => (
        <div>
            <p>{stat.charAt(0).toUpperCase() + stat.slice(1)}</p>
            <Form.Control
                type="number"
                name={stat}
                value={characterStats[stat]}
                onChange={handleStatChange} 
            />
            {errors.stat && (<div className="text-danger">{errors.stat}</div>)}
        </div>
    )

    return (
        <div className="d-flex flex-column align-items-center" style={{ width: "100%", paddingTop: "40px", paddingBottom: "40px" }}>
            
            {/*Character Name + Image*/}
            <div className="text-center mb-4">
                {/*Listed name as an h1 element, convert to Form element on selection*/}
                {editNameVis ? (
                    <h1 
                        style={{ cursor: "pointer" }} 
                        onClick={() => setEditNameVis(false)}
                    >
                        {characterName}
                    </h1>
                    
                ) : (
                    //Listed name as an Form element, convert to h1 element on deselection
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
                {/*Updates user on the image still being loaded, cant exist unless its finished*/}
                {uploading && <div className="text-warning mt-2">Uploading image...</div>}
                <div className="mt-3">
                    <Form.Control 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                    />
                </div>
            </div>

            {/*---Stats section---*/}
            <div style={{ width:"100%", justifyContent:"center" }}>
                {!editingSkills && (
                    <>
                    <div className="d-flex mb-4 justify-content-center">
                        {/* Left card */}
                        <Card style={{ width:"200px", margin:"60px", }}>
                            <CardBody>
                                <h3>Stats</h3>
                                {renderStatForms("ac")}
                                {renderStatForms("dc")}
                                {renderStatForms("health")}
                            </CardBody>
                        </Card>
                    
                        {/* Right card */}
                        <Card style={{ width:"200px", margin:"60px"}}>
                            <CardBody>
                                <h3>Saves</h3>
                                {renderStatForms("reflex")}
                                {renderStatForms("fortitude")}
                                {renderStatForms("will")}
                            </CardBody>
                        </Card>

                    </div>
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="success"
                            className="mt-5 justify-content-center d-flex"
                            onClick={() => setEditingSkills(prev => !prev)}
                        >
                            Edit Skills
                        </Button>
                    </div>
                    </>
                )}
                
            </div>
            
            {/*---Skills section---*/}
            <div style={{width:"100%"}}>
                {/*Shows upon edit skills being pressed*/}
                {editingSkills && (
                    <CharacterSkills
                        
                        skills={characterStats.skills}
                        setSkills={(newSkills) => setCharacterStats((prev) => ({ ...prev, skills: newSkills }))}
                        setEditingSkills={setEditingSkills}
                    />
                )}
            </div>
            {/*---Edit/new character button---*/} 
            <Button 
                style={{ width: "200px", marginTop: "40px", marginBottom: "40px" }} 
                variant="dark" 
                onClick={handleChangeCharacter} > 
            {createOverEdit ? 'New Character' : 'Edit Character'} </Button>
        </div>
    );
}

export default CharacterDesign;
