export default {
    name: "Trip",
    type: "skill",
    check: {
        type: "athletics",
        vs: "reflex"
    },
    outcomes: {
        criticalSuccess: {
            text: "The target falls, lands prone, and takes 1d6 bludgeoning damage.",
            effects: [
                { type: "condition", value: "Prone", target: "defender" },
                { type: "damage", roll: "1d6", damageType: "bludgeoning" }
            ]
        },
        success: {
            text: "The target falls and lands prone.",
            effects: [{ type: "condition", value: "Prone", target: "defender" }]
        },
        failure: {
            text: "You fail to trip the target.",
            effects: []
        },
        criticalFailure: {
            text: "You lose your balance, fall, and land prone.",
            effects: [{ type: "condition", value: "Prone", target: "attacker" }]
        }
    },
    description: "Your target can't be more than one size larger than you. You try to knock a creature to the ground. Attempt an Athletics check against the target's Reflex DC."
};