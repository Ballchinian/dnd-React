export default {
    name: "Stand",
    type: "automatic",
    text : "You stand up from being prone.",
    effects: [
        { type: "removeCondition", values: ["Prone"], target: "attacker" }
    ],
    description: "You stand up from being prone."
};