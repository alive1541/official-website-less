import { CHANGE_LANGUAGE } from "./types";
import { combineReducers } from "redux";

export function language(state = "id", action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return action.value;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  language
});

export default rootReducer;
