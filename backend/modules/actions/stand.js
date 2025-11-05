export default {
    name: "Stand",
    type: "automatic",
    text : "You stand up from being prone.",
    effects: [
        { type: "removeCondition", value: "Prone", target: "attacker" }
    ],
    description: "You stand up from being prone."
};