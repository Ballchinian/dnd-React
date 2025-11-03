import {Button, Card, Dropdown, ButtonGroup} from 'react-bootstrap';
import {FaTrashAlt} from "react-icons/fa";
import {useState, useEffect} from 'react';
import parseDmgDie from "../utill/parseDmgDie";

function WeaponBuilder() {
    const [weaponChoices, setWeaponChoices] = useState([]);
    const [weaponName, setWeaponName] = useState("");
    const [weaponHit, setWeaponHit] = useState(0);
    const [dmgDieNumbers, setDmgDieNumbers] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedWeaponName, setSelectedWeaponName] = useState("Select weapon to change");
    const [divVisibility, setDivVisibility] = useState(false);

    //FetchWeaponsFromBackendOnMount
    useEffect(() => {
        async function fetchWeapons() {
            try {
                const res = await fetch("http://localhost:5000/api/items");
                const data = await res.json();
                setWeaponChoices(data.weapons);
            } catch (err) {
                console.error("FailedToFetchWeapons:", err);
            }
        }
        fetchWeapons();
    }, []);

    //ResetFormValues
    function resetValues() {
        setWeaponHit(0);
        setDmgDieNumbers("");
        setErrors({});
        setWeaponName("");
        setSelectedWeaponName("Select weapon to change");
    }

    //HandleInputChanges
    function handleWeaponInputChange(e) {
        const {name, value} = e.target;
        if (name === "weaponName") setWeaponName(value);
        if (name === "weaponHit") setWeaponHit(value);
        if (name === "dmgDieNumbers") setDmgDieNumbers(value);
    }

    //ToggleAddOrEditSection
    function handleSwapWeaponUI() {
        setDivVisibility(!divVisibility);
        resetValues();
    }

    //SaveWeaponToBackend
    async function handleSaveWeapon() {
        const newErrors = {};
        const result = parseDmgDie(weaponName, dmgDieNumbers);

        //CheckForDuplicateAndValidationErrors
        if (weaponChoices.some(w =>
            w.weaponName.toLowerCase() === weaponName.trim().toLowerCase() &&
            w.weaponName !== selectedWeaponName
        )) {
            newErrors.duplicate = "A Weapon With This Name Already Exists.";
        }
        if (weaponHit === "" || isNaN(weaponHit)) {
            newErrors.weaponHit = "Hit Value Must Be A Number.";
        }
        if (result.errors) Object.assign(newErrors, result.errors);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        const {numRolled, diceRolled, modifier} = result;
        const payload = {weaponName, weaponHit, numRolled, diceRolled, modifier};

        try {
            if (selectedWeaponName !== "Select weapon to change") {
                //UpdateExistingWeapon
                await fetch("http://localhost:5000/api/items/weapon", {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({originalName: selectedWeaponName, ...payload})
                });
            } else {
                //AddNewWeapon
                await fetch("http://localhost:5000/api/items/weapon", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payload)
                });
            }
            //RefreshWeaponList
            const refreshRes = await fetch("http://localhost:5000/api/items");
            const data = await refreshRes.json();
            setWeaponChoices(data.weapons);
            resetValues();
        } catch (err) {
            console.error(err);
            setErrors({api: err.message});
        }
    }

    //DeleteWeaponFromBackend
    async function handleDeleteWeapon(name) {
        try {
            const res = await fetch("http://localhost:5000/api/items", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({type: "weapon", name})
            });
            if (!res.ok) throw new Error("FailedToDeleteWeapon");

            //RefreshWeaponList
            const refreshRes = await fetch("http://localhost:5000/api/items");
            const data = await refreshRes.json();
            setWeaponChoices(data.weapons);
            resetValues();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            {/*AddWeaponSection*/}
            <Card className="flex-column" style={{display: divVisibility ? 'none' : 'flex'}}>
                <h2 className="text-center">Add Weapon</h2>
                <ol>
                    <li>Name<input type="text" value={weaponName} name="weaponName" onChange={handleWeaponInputChange}/></li>
                    {errors.duplicate && <div className="text-danger">{errors.duplicate}</div>}
                    <li>Hit Die<input type="number" value={weaponHit} name="weaponHit" onChange={handleWeaponInputChange}/></li>
                    {errors.weaponHit && <div className="text-danger">{errors.weaponHit}</div>}
                    <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleWeaponInputChange}/></li>
                    {errors.dmgDieNumbers && <div className="text-danger">{errors.dmgDieNumbers}</div>}
                    {errors.api && <div className="text-danger">{errors.api}</div>}
                </ol>
                <Button onClick={handleSaveWeapon}>Add Weapon</Button>
                <Button className="mt-3" onClick={handleSwapWeaponUI}>Edit Previous Weapons</Button>
            </Card>

            {/*ChangeWeaponSection*/}
            <Card className="flex-column" style={{display: divVisibility ? 'flex' : 'none'}}>
                <h2 className="text-center">Change Weapon</h2>

                <ButtonGroup className="d-flex align-items-end mb-3">
                    <input
                        placeholder={selectedWeaponName}
                        name="weaponName"
                        type="text"
                        className="form-control"
                        value={weaponName}
                        onChange={handleWeaponInputChange}
                        disabled={selectedWeaponName === "Select weapon to change"}
                    />
                    <Dropdown
                        as={ButtonGroup}
                        onSelect={(selectedIndex) => {
                            const weapon = weaponChoices[selectedIndex];
                            setSelectedWeaponName(weapon.weaponName);
                            setWeaponName(weapon.weaponName);
                            setDmgDieNumbers(`${weapon.numRolled}d${weapon.diceRolled}+${weapon.modifier}`);
                            setWeaponHit(weapon.weaponHit);
                        }}
                    >
                        <Dropdown.Toggle split id="dropdown-split-basic"/>
                        <Dropdown.Menu>
                            {weaponChoices.map((weapon, index) => (
                                <Dropdown.Item key={index} eventKey={index}>{weapon.weaponName}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </ButtonGroup>

                <ol>
                    <li>Hit Die<input type="text" value={weaponHit} name="weaponHit" onChange={handleWeaponInputChange}/></li>
                    <li>Damage Die<input type="text" name="dmgDieNumbers" value={dmgDieNumbers} onChange={handleWeaponInputChange}/></li>
                </ol>

                <div className="d-flex justify-content-between">
                    <Button className="p-2 w-100" onClick={handleSaveWeapon}>Change Weapon</Button>
                    {selectedWeaponName !== "Select weapon to change" && (
                        <Button
                            variant="danger"
                            onClick={() => handleDeleteWeapon(selectedWeaponName)}
                            style={{display: "flex", alignItems: "center", gap: "10px"}}
                        >
                            <FaTrashAlt/> Delete
                        </Button>
                    )}
                </div>

                <Button className="mt-3" onClick={handleSwapWeaponUI}>Add New Weapons</Button>
            </Card>
        </div>
    );
}

export default WeaponBuilder;
