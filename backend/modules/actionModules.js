import grapple from "./actions/grapple.js";
import trip from "./actions/trip.js";
import demoralize from "./actions/demoralize.js";

//List of all the global actions avalaible to the character
export const actionModules = {
  Grapple: grapple,
  Trip: trip,
  Demoralize: demoralize,
};

//Export just the keys (for frontend)
export const actionNames = Object.keys(actionModules);
