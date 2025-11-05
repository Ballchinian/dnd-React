export default {
    name: "Grapple",
    type: "skill",
    check: {
        type: "athletics",
        vs: "fortitude"
    },
    outcomes: {
        criticalSuccess: {
            text: "Your target is restrained until the end of your next turn unless you move or your target Escapes.",
            effects: [{ type: "condition", value: "Restrained", duration: "minusOneEveryTurn", target: "defender" }]
        },
        success: {
            text: "Your target is grabbed until the end of your next turn unless you move or your target Escapes.",
            effects: [{ type: "condition", value: "Grabbed", duration: "minusOneEveryTurn", target: "defender" }]
        },
        failure: {
            text: "You fail to grab your target. If you already had them grabbed or restrained, those conditions end.",
            effects: [
                { type: "removeCondition", value: "Grabbed", target: "defender" },
                { type: "removeCondition", value: "Restrained", target: "defender" }
            ]
        },
        criticalFailure: {
            text: "You lose your grip; if they were grabbed, they break free and can grab you or knock you prone.",
            effects: [
                { type: "condition", value: "Prone", target: "attacker" },
                { type: "removeCondition", value: "Grabbed", target: "defender" },
                { type: "removeCondition", value: "Restrained", target: "defender" },
            ]
        }
    },
    description: "You attempt to grab a creature or object with your free hand. Attempt an Athletics check against the target's Fortitude DC. You can Grapple a target you already have grabbed or restrained without having a hand free."
};