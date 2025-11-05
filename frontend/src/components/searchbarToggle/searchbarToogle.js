import { useState } from "react";
import { Form } from "react-bootstrap";

function SearchbarToggle({
    placeholder = "Search...",
    list = [],
    onSelect = () => {},
    onBlur = () => {},
    getLabel = (item) => item, //function to allow for custom gathering function from the data given    
    getImage = () => null, //function similar to label to select where the image is from (assumed null)          
}) {
    //current value of search bar
    const [query, setQuery] = useState("");

    //filter values given in list based on query results in search bar
    const filtered = list.filter((item) => {
        const label = getLabel(item);
        return (
            label.toLowerCase().includes(query.toLowerCase())
        );
    });

    return (
        <div className="mb-3">
            <Form.Control
                type="text"
                placeholder={placeholder}
                //autoFocus selects the box when it appears
                autoFocus
                value={query}
                //Updates value of search bar in memory
                onChange={(e) => setQuery(e.target.value)}
                //When unselected remove query and change it back to a button, not a search bar
                onBlur={() => {
                    setQuery("");
                    onBlur();
                }}
            />

            {query && (
                <div
                    style={{
                        background: "white",
                        color: "black",
                        marginTop: "2px",
                        maxHeight: "120px",
                        overflowY: "auto",
                    }}
                >
                    {filtered.length > 0 ? (
                        filtered.map((item, i) => (
                            //from filtered list, display results underneath the search bar
                            <div
                                key={i}
                                style={{
                                    padding: "4px 8px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                                //Allow for clicking to select and reset the query
                                onMouseDown={() => {
                                    onSelect(item);
                                    setQuery("");
                                }}
                            >
                                {/* optional image preview for character selection */}
                                {getImage(item) && (
                                    <img
                                        //Name of the character for the alt and src url
                                        alt={getLabel(item)}
                                        src={getImage(item)}
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )}
                                <span>{getLabel(item)}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: "4px 8px" }}>No matches</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchbarToggle;
