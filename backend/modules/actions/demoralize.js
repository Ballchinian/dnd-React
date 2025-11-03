export default {
  name: "Demoralize",
  check: {
    type: "intimidation",
    vs: "will"
  },
  outcomes: {
    criticalSuccess: {
      text: "The target becomes frightened 2.",
      effects: [
        { type: "condition", value: "Frightened", number: 2, duration: "minusOneEveryTurn" }
      ]
    },
    success: {
      text: "The target becomes frightened 1.",
      effects: [
        { type: "condition", value: "Frightened", number: 1, duration: "minusOneEveryTurn" }
      ]
    },
    failure: {
      text: "You fail to frighten the target.",
      effects: []
    },
    criticalFailure: {
      text: "You fail to frighten the target.",
      effects: []
    }
  },
  description: "With a sudden shout, a well-timed taunt, or a cutting put-down, you can shake an enemy's resolve. Choose a creature within 30 feet of you who you're aware of. Attempt an Intimidation check against that target's Will DC. If the target doesn't understand the language you are speaking, or you're not speaking a language, you take a –4 circumstance penalty to the check. Regardless of your result, the target is temporarily immune to your attempts to Demoralize it for 10 minutes."
};
